import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

/**
 * Make S3 parameter pointing to profile picture of the user, to be used in S3 commands.
 */
const s3Param = (userId: string) => ({
  Bucket: process.env.S3_BUCKET,
  Key: `profile-img/${userId}.webp`,
});

/**
 * Get the public URL of the profile picture of the user.
 */
const publicUri = (userId: string) => {
  if (!process.env.S3_ENDPOINT) {
    throw new Error("S3_ENDPOINT not set");
  }
  if (!process.env.S3_BUCKET) {
    throw new Error("S3_BUCKET not set");
  }
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${
    s3Param(userId).Key
  }`;
};

export const profilePictureRouter = createTRPCRouter({
  requestUploadProfilePictureURL: protectedProcedure
    .meta({
      description: "Get a signed URL for uploading a profile picture",
    })
    .input(z.undefined())
    .mutation(async ({ ctx }) => {
      // Create temporary signed URL for uploading file
      const url = await getSignedUrl(
        ctx.s3,
        new PutObjectCommand({
          ...s3Param(ctx.session.user.id),
          ContentType: "image/webp",
          // TODO: Limit content length
        }),
        {
          expiresIn: 60,
        }
      );

      return url;
    }),

  confirmUploadProfilePicture: protectedProcedure
    .input(z.undefined())
    .mutation(async ({ ctx }) => {
      // Check if the profile picture exists in storage.
      // Frontend should have already uploaded the file, but who ever trust them.
      try {
        await ctx.s3.send(new HeadObjectCommand(s3Param(ctx.session.user.id)));
      } catch (e) {
        if (
          typeof e === "object" &&
          e !== null &&
          "name" in e &&
          e.name === "NotFound"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Profile picture not in storage",
            cause: e,
          });
        }
        throw e;
      }

      // Get the URL of the profile picture in storage. and store it in the database.
      //
      // The Uri here depend on user id, which may cause broswer cache problem.
      // to solve this, we add a timestamp to the end of the Uri, so the uri will be different every time.
      const imageUri = publicUri(ctx.session.user.id) + `?${Date.now()}`;

      console.log(ctx.session.user.id);
      const user = await ctx.prisma.user.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          imageUri: `${imageUri}`,
        },
      });

      return user;
    }),
});
