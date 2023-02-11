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
