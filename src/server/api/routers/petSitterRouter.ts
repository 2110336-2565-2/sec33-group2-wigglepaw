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
  searchPetSitterField,
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
    .input(z.object({ userId: z.string(), data: petSitterFields.partial() }))
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.petSitter.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),

  verifyMany: publicProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.petSitter.updateMany({
        where: {
          userId: { in: input.userIds },
        },
        data: { verifyStatus: true },
      });
      return update;
    }),
  // searchPetSitter
  // input:
  // note that all args default value will act as those fields are not in search criteria
  // read more about default value on searchField
  //   searchName: @string name such as "john smith"
  //   searchRating: @number not implement yet
  //   searchPriceMin:  @number minimum price that user is ok with
  // searchPriceMin can be null and default is null   ( also endPrice )
  // table below show when petsitter will be in search result (✓ mean show in result)
  // +---------------+------+---------------+
  // | input  \   db | null | num(endPrice) |
  // +---------------+------+---------------+
  // | null          | ✓    | ✓            |
  // +---------------+------+---------------+
  // | num(priceMin) | x    |  if endPrice  |
  // |               |      |  >  priceMin  |
  // +---------------+------+---------------+
  //   searchPriceMax:  @number maximum price that user is ok with
  //   searchLocation:  @string not implement yet
  //   searchPetType:   @string pet types such as "cat dog" it will return petsitter that have both cat and dog
  //   searchStartSchedule: @string not implement yet
  //   searchEndSchedule:   @string not implement yet
  //   searchIncludePetHotelFlag: @boolean if you want to include pet hotel in search result then set it to true
  //   searchIncludeFreelancePetSitterFlag: @boolean if you want to inclde FreelancePetSitter in search result then set it to true
  // table to show how to set value of searchIncludePetHotelFlag and searchIncludeFreelancePetSitterFlag
  // +-------------------------------+---------------------------+-------------------------------------+
  // | want to seach for \ args name | searchIncludePetHotelFlag | searchIncludeFreelancePetSitterFlag |
  // +-------------------------------+---------------------------+-------------------------------------+
  // | pet hotel                     | true                      | false                               |
  // +-------------------------------+---------------------------+-------------------------------------+
  // | freelance                     | false                     | true                                |
  // +-------------------------------+---------------------------+-------------------------------------+
  // | all                           | true                      | true                                |
  // +-------------------------------+---------------------------+-------------------------------------+
  //  searchSortBy: @string for sorting. support "name", "username", "price", "startPrice", "endPrice" default is username
  //  will implement sort by firstname lastname hotel name if needed

  // output:
  //   list of object that only contain user id that match search input
  //   example:
  //   [
  //     { "userId": "cldzsm2n6000z7k083zwda6b1" },
  //     { "userId": "cldzsm3tt00137k08lt9r3rfs" },
  //   ]
  searchPetSitter: publicProcedure
    .input(searchPetSitterField)
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
