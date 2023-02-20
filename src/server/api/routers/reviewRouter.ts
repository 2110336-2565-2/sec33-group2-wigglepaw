import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  reviewFields,
} from "../../../schema/schema";

export const reviewRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        petSitterId: z.string().cuid(),
        petOwnerId: z.string().cuid(),
        review: reviewFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createReview = await ctx.prisma.review.create({
        data: {
          petSitterId: input.petSitterId,
          petOwnerId: input.petOwnerId,
          ...input.review,
        },
      });
      const reviewId = createReview.reviewId;

      const connectOwner = await ctx.prisma.petOwner.update({
        where: {
          userId: input.petOwnerId,
        },
        data: {
          review: {
            connect: {
              reviewId: reviewId,
            },
          },
        },
      });

      const connectSitter = await ctx.prisma.petSitter.update({
        where: {
          userId: input.petSitterId,
        },
        data: {
          review: {
            connect: {
              reviewId: reviewId,
            },
          },
        },
      });

      return;
    }),
});
