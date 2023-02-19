import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";

// TODO: Move out of here, maybe slap into ctx.
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
  },
});

export const profilePictureRouter = createTRPCRouter({
  requestUploadProfilePictureURL: protectedProcedure
    .meta({
      description: "Get a signed URL for uploading a profile picture",
    })
    .input(z.undefined())
    .mutation(async ({ ctx }) => {
      // Create temporary signed URL for uploading file
      const url = await getSignedUrl(
        s3,
        new PutObjectCommand({
          Bucket: "wigglepaw-profile-picture",
          Key: ctx.session.user.id,
          ContentType: "image/png",
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
        await s3.send(
          new HeadObjectCommand({
            Bucket: "wigglepaw-profile-picture",
            Key: ctx.session.user.id,
          })
        );
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
      const imageUri = `https://pub-ba94baa4e38145d4aee2d8a7d40db1e1.r2.dev/${
        ctx.session.user.id
      }?v=${Date.now()}`;

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
