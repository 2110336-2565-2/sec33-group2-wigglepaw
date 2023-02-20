import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  postFields,
} from "../../../schema/schema";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        petSitterId: z.string().cuid(),
        post: postFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createPost = await ctx.prisma.post.create({
        data: {
          petSitterId: input.petSitterId,
          ...input.post,
        },
      });
      const postId = createPost.postId;

      const connectSitter = await ctx.prisma.petSitter.update({
        where: {
          userId: input.petSitterId,
        },
        data: {
          post: {
            connect: {
              postId: postId,
            },
          },
        },
      });

      return createPost;
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
});
