import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  sitterProcedure,
} from "../trpc";
import { postFields } from "../../../schema/schema";
import { TRPCError } from "@trpc/server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import postPic from "../logic/s3Op/postPic";

const POST_NOT_FOUND_ERR = "Post does not exist.";
const NOT_AUTHOR_ERR = "Session's user not author of this post.";

export const postRouter = createTRPCRouter({
  create: sitterProcedure
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

  delete: sitterProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const thisPost = await ctx.prisma.post.findUnique({
          where: { postId: input.postId },
          include: {
            petSitter: {
              select: { userId: true },
            },
          },
        });
        // If post with postId does not exist
        if (!thisPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: POST_NOT_FOUND_ERR,
          });
        }
        const posterId = thisPost.petSitter.userId;
        // If post's owner is not the same with the user session --> don't allow
        if (posterId != ctx.session.user.userId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: NOT_AUTHOR_ERR,
          });
        }
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

  update: sitterProcedure
    .input(
      z.object({
        postId: z.string(),
        data: postFields.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const thisPost = await ctx.prisma.post.findUnique({
          where: { postId: input.postId },
          include: {
            petSitter: {
              select: { userId: true },
            },
          },
        });
        // If post with postId does not exist
        if (!thisPost) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: POST_NOT_FOUND_ERR,
          });
        }
        const posterId = thisPost.petSitter.userId;
        // If post's owner is not the same with the user session --> don't allow
        if (posterId != ctx.session.user.userId) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: NOT_AUTHOR_ERR,
          });
        }
        const update = await ctx.prisma.post.update({
          where: {
            postId: input.postId,
          },
          data: { ...input.data },
        });
        return update;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          cause: err,
        });
      }
    }),
});
