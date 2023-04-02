import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  reviewFields,
} from "../../../schema/schema";
import {
  makeFree,
  makeHotel,
  makeOwner,
  makePost,
  makeReview,
  updateAvgRating,
} from "../../../seed/db";
import { ReviewStatus } from "@prisma/client";

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
          status: ReviewStatus.submitted,
          ...input.review,
        },
      });

      await updateAvgRating(input.petSitterId);

      return createReview;
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

  report: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.review.update({
        where: {
          reviewId: input.reviewId,
        },
        data: {
          status: ReviewStatus.pending,
        },
      });
    }),

  resolve: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.review.update({
        where: {
          reviewId: input.reviewId,
        },
        data: {
          status: ReviewStatus.resolved,
        },
      });
    }),

  getAll: publicProcedure.mutation(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany();
  }),

  getAllReport: publicProcedure.mutation(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany({
      where: {
        status: ReviewStatus.resolved || ReviewStatus.pending,
      },
    });
  }),
});
