import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { postFields } from "../../../schema/schema";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import postPic from "../logic/s3Op/postPic";

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
      // Generate presigned URL for uploading images
      // one for each image, with name 0.png, 1.png, 2.png, ...
      const imageIdx = Array.from({ length: input.pictureCount }, (_, i) => i);
      const uploadUrls: string[] = await Promise.all(
        imageIdx.map((i) => postPic.signedUploadUrl(ctx.s3, postId, i))
      );
      // Add picture uri to post, in order to completing it.
      const pictureUri = imageIdx.map((i) => postPic.publicUrl(postId, i));
      await ctx.prisma.post.update({
        where: {
          postId,
        },
        data: {
          pictureUri,
        },
      });

      // Check in 5 minutes (expiresIn) if the frontend has uploaded the to uploadUrls.
      const uploadCheckTask = async () => {
        const allUploaded = await Promise.all(
          imageIdx.map((i) => postPic.checkUploaded(ctx.s3, postId, i))
        );

        if (!allUploaded) {
          console.error(`Not uploaded, deleteing post ${postId}`);
          // If not uploaded, delete post
          await ctx.prisma.post.delete({
            where: {
              postId,
            },
          });
        }
      };
      setTimeout(() => {
        uploadCheckTask().then().catch(console.error);
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

  getPostsByUserId: publicProcedure
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
      try {
        await postPic.deleteOfPost(ctx.s3, input.postId);
        const post = await ctx.prisma.post.delete({
          where: {
            postId: input.postId,
          },
        });
        return post;
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Post not found`,
            cause: err,
          });
        }
      }
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
