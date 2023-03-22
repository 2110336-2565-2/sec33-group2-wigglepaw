import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError, initTRPC } from "@trpc/server";
import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
  searchField,
} from "../../../schema/schema";
import { PetSitterSearchLogic } from "../logic/search/petSitterSearchLogic";

const zodUserFields = z.object({
  verifyStatus: z.boolean(),
  certificationUri: z.string().url(),
});

export const petSitterRouter = createTRPCRouter({
  getReviewsByUserId: publicProcedure
    .input(z.object({ petSitterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          userId: input.petSitterId,
        },
        include: {
          petSitter: {
            include: {
              review: true,
            },
          },
        },
      });

      if (!user) return null;

      try {
        return user.petSitter?.review;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "petSitterRouter fucked up",
          cause: error,
        });
      }
    }),

  getAvgRatingByUserId: publicProcedure
    .input(z.object({ petSitterId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          userId: input.petSitterId,
        },
        include: {
          petSitter: {
            include: {
              review: true,
            },
          },
        },
      });

      if (!user) return null;

      try {
        return user.petSitter?.avgRating;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "petSitterRouter fucked up",
          cause: error,
        });
      }
    }),

  getPostsByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        newestFirst: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const orderBy = input.newestFirst ? "desc" : "asc";
      const posts = await ctx.prisma.post.findMany({
        where: {
          petSitterId: input.userId,
        },
        orderBy: {
          createdAt: orderBy,
        },
      });
      return posts;
    }),

  update: publicProcedure
    .input(z.object({ userId: z.string(), data: petSitterFields }))
    .mutation(async ({ ctx, input }) => {
      const update = await prisma?.petSitter.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
  searchPetSitter: publicProcedure
    .input(searchField)
    .query(async ({ ctx, input }) => {
      const items = await ctx.prisma.petSitter.findMany({
        take: input.limit + 1,
        skip: input.skip,
        cursor: input.cursor ? { userId: input.cursor } : undefined,
        where: {
          AND: [
            input.searchName
              ? PetSitterSearchLogic.petSitterName(input.searchName)
              : {},
            input.searchPriceMin
              ? PetSitterSearchLogic.priceMin(input.searchPriceMin)
              : {},
            input.searchPriceMax
              ? PetSitterSearchLogic.priceMax(input.searchPriceMax)
              : {},
            input.searchPetTypes
              ? PetSitterSearchLogic.petTypes(input.searchPetTypes)
              : {},
            input.searchVerifyStatus
              ? PetSitterSearchLogic.verifyStatus(input.searchVerifyStatus)
              : {},
            input.searchIncludePetSitterType
              ? PetSitterSearchLogic.petSitterTypes(
                  input.searchIncludePetSitterType
                )
              : {},
            PetSitterSearchLogic.petSitterType(
              input.searchIncludePetHotel,
              input.searchIncludeFreelancePetSitter
            ),
          ],
        },
        orderBy: [PetSitterSearchLogic.sortBy(input.searchSortBy)],
        include: {
          user: true,
          petHotel: true,
          freelancePetSitter: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.userId;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
