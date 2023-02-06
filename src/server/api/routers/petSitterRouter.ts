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
  .input(z.object({
    searchText: z.string(),
  }))
    .query(({ ctx, input }) => {
      const words = input.searchText.split(" ")
      return ctx.prisma.petSitter.findMany({
        where: {
            ...words.map(word => ({
          AND: [
          OR: [
            { freelancePetSitter: { firstName: { contains: word } } },
            { freelancePetSitter: { lastName: { contains: word } } },
            { freelancePetSitter: { lastName: { contains: word } } },
            { petHotel: { hotelName: { contains: word } } },
          ]
        }))
      ]
      });
        }
    }),

});