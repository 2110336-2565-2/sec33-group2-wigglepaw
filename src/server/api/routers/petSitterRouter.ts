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
} from "../../../schema/schema";
import * as logic from "../logic/petSitterRouter";

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
    .input(
      z.object({
        searchName: z.string().default(""),
        searchRating: z.number().nullable().default(null),
        searchPriceMin: z.number().nullable().default(null),
        searchPriceMax: z.number().nullable().default(null),
        searchLocation: z.string().default(""),
        searchPetTypes: z.string().default(""),
        searchStartSchedule: z.string().default(""),
        searchEndSchedule: z.string().default(""),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.petSitter.findMany({
        where: {
          AND: [
            logic.searchPetSitterByText(input.searchName),
            logic.searchPetSitterByPriceMin(input.searchPriceMin),
            logic.searchPetSitterByPriceMax(input.searchPriceMax),
            logic.searchPetSitterByPetTypes(input.searchPetTypes),
          ],
        },
      });
    }),
});
