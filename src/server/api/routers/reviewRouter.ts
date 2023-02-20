import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  reviewFields,
} from "../../../schema/schema";

async function updateAvgRating(petSitterId: string) {
  const petSitter = await prisma.petSitter.findFirst({
    where: {
      userId: petSitterId,
    },
    include: {
      review: true,
    },
  });
  const reviews = petSitter?.review;
  if (!reviews) return;

  let sum = 0;
  for (const review of reviews) {
    sum += review.rating;
  }
  const avg = sum / reviews.length;

  const update = await prisma.petSitter.update({
    where: {
      userId: petSitterId,
    },
    data: { avgRating: avg },
  });
  return update;
}

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

      await updateAvgRating(input.petSitterId);

      return;
    }),

  delete: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deleted = await ctx.prisma.review.delete({
        where: {
          reviewId: input.reviewId,
        },
      });
      const petSitterId = deleted.petSitterId;

      await updateAvgRating(petSitterId);
      return;
    }),
});
