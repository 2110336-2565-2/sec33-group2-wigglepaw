import { PetSitter } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  postFields,
} from "../../../schema/schema";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

/**
 * Make S3 parameter pointing to picture of post, to be used in S3 commands.
 */
const s3Param = (postId: string, i: number) => ({
  Bucket: process.env.S3_BUCKET,
  Key: `post-img/${postId}/${i}.png`,
});

async function checkIfUploaded(s3: S3Client, uploadUrls: string[]) {
  // Get if files exists in all uploadUrls
  try {
    await Promise.all(
      uploadUrls.map((url) =>
        s3.send(
          new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: url,
          })
        )
      )
    );

    return true;
  } catch (e) {
    return false;
  }
}

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        petSitterId: z.string().cuid(),
        post: postFields.omit({ pictureUri: true }),
        pictureCount: z.number().min(0).max(20),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create temporary post, with no picture
      const createPost = await ctx.prisma.post.create({
        data: {
          petSitterId: input.petSitterId,
          ...input.post,
          pictureUri: undefined,
        },
      });

      // Create presigned URL for uploading pictures
      // Generate name of image files
      const postId = createPost.postId;
      const imageKeys = Array.from(
        { length: input.pictureCount },
        (_, i) => s3Param(postId, i).Key
      );
      // Generate presigned URL for uploading images
      const uploadUrls = await Promise.all(
        imageKeys.map((key) =>
          getSignedUrl(
            ctx.s3,
            new PutObjectCommand({
              Bucket: process.env.S3_BUCKET,
              Key: key,
              ContentType: "image/png",
            }),
            { expiresIn: 60 * 5 }
          )
        )
      );

      // Add picture uri to post, in order to completing it.
      await ctx.prisma.post.update({
        where: {
          postId,
        },
        data: {
          pictureUri: imageKeys.map(
            (key) => `${process.env.S3_PUBLIC_URL!}/${key}`
          ),
        },
      });

      async function run() {
        if (!(await checkIfUploaded(ctx.s3, imageKeys))) {
          console.error(`Not uploaded, deleteing post ${postId}`);
          // If not uploaded, delete post
          await ctx.prisma.post.delete({
            where: {
              postId,
            },
          });
        }
      }

      // Check in 5 minutes (expiresIn) if the frontend has uploaded the to uploadUrls.
      setTimeout(() => {
        run().then().catch(console.error);
      }, 5 * 60 * 1000);

      return {
        post: createPost,
        uploadUrls,
      };
    }),

  getById: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          postId: input.postId,
        },
      });
      return post;
    }),

  getAllPostByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          petSitterId: input.userId,
        },
      });
      return posts;
    }),

  delete: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          postId: input.postId,
        },
      });
      if (!post) return "Post id not found";
      const del = await ctx.prisma.post.delete({
        where: {
          postId: input.postId,
        },
      });
      return del;
    }),

  update: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        data: postFields.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.post.update({
        where: {
          postId: input.postId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
