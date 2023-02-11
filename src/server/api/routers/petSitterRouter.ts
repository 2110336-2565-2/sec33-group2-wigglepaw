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
    .query(async ({ ctx, input }) => {
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
  //   searchName: @string name such as "john smith"
  //   searchRating: @number not implement yet
  //   searchPriceMin: @number minimum price that user is ok with
  //   searchPriceMax: @number maximum price that user is ok with
  //   searchLocation: @string not implement yet
  //   searchPetType: @string pet types such as "cat dog" it will return petsitter that have both cat and dog
  //   searchStartSchedule: @string not implement yet
  //   searchEndSchedule: @string not implement yet
  //   searchIncludePetHotelFlag: @boolean if you want to inclde pet hotel in search result then set it to true
  //   searchIncludeFreelancePetSitterFlag: @boolean if you want to inclde FreelancePetSitter in search result then set it to true
    
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
            searchLogic.searchByName(input.searchName),
            searchLogic.searchByPriceMin(input.searchPriceMin),
            searchLogic.searchByPriceMax(input.searchPriceMax),
            searchLogic.searchBySinglePetType(input.searchPetType),
            searchLogic.searchByPetSitterType(
              input.searchIncludePetHotelFlag,
              input.searchIncludeFreelancePetSitterFlag
            ),
          ],
        },
        select: {
          userId: true,
        },
      });
    }),
});
