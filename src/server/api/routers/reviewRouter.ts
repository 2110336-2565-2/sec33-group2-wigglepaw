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
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";

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
      try {
        const deleted = await ctx.prisma.review.delete({
          where: {
            reviewId: input.reviewId,
          },
        });
        const petSitterId = deleted.petSitterId;

        await updateAvgRating(petSitterId);
        return;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "reviewRouter fucked up",
          cause: err,
        });
      }
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

  setAdminComment: publicProcedure
    .input(
      z.object({
        reviewId: z.string().cuid(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.review.update({
        where: {
          reviewId: input.reviewId,
        },
        data: {
          adminComment: input.comment,
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

  getAll: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ reviewId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.review.findUnique({
        where: { reviewId: input.reviewId },
        include: {
          petSitter: {
            include: {
              user: true,
              freelancePetSitter: true,
              petHotel: true,
            },
          },
          petOwner: true,
        },
      });
    }),

  getAllPending: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany({
      where: {
        status: ReviewStatus.pending,
      },
    });
  }),

  getAllResolved: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany({
      where: {
        status: ReviewStatus.resolved,
      },
    });
  }),

  getAllReport: publicProcedure.query(async ({ ctx, input }) => {
    return await ctx.prisma.review.findMany({
      where: {
        OR: [
          { status: ReviewStatus.resolved },
          { status: ReviewStatus.pending },
        ],
      },
      include: {
        petOwner: {
          include: {
            user: true,
          },
        },
        petSitter: {
          include: {
            user: true,
            freelancePetSitter: true,
            petHotel: true,
          },
        },
      },
    });
  }),
});
