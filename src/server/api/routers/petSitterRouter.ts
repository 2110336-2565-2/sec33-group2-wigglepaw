import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
  searchField,
} from "../../../schema/schema";
import * as searchLogic from "../logic/search";

const zodUserFields = z.object({
  verifyStatus: z.boolean(),
  certificationUri: z.string().url(),
});

export const petSitterRouter = createTRPCRouter({
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
    .input(searchField)
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.petSitter.findMany({
        where: {
          AND: [
            input.searchName ? searchLogic.searchByName(input.searchName) : {},
            input.searchPriceMin
              ? searchLogic.searchByPriceMin(input.searchPriceMin)
              : {},
            input.searchPriceMax
              ? searchLogic.searchByPriceMax(input.searchPriceMax)
              : {},
            input.searchPetTypes
              ? searchLogic.searchByPetTypes(input.searchPetTypes)
              : {},
            input.searchIncludePetSitterType
              ? searchLogic.searchByPetSitterTypes(
                  input.searchIncludePetSitterType
                )
              : {},
            searchLogic.searchByPetSitterType(
              input.searhcIncludePetHotel,
              input.searhcIncludeFreelancePetSitter
            ),
          ],
        },
        orderBy: [searchLogic.searchOrderBy(input.searchSortBy)],
        include: {
          user: true,
          petHotel: true,
          freelancePetSitter: true,
        },
      });
    }),
});
