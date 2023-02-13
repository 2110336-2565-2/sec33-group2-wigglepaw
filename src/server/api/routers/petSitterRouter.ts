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

  dummySearchPetSitter: publicProcedure.query(({ ctx }) =>
    ctx.prisma.petSitter.findMany({ include: { user: true } })
  ),

  searchPetSitter: publicProcedure
    .input(
      z.object({
        searchText: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      const words = input.searchText.split(" ");
      return ctx.prisma.petSitter.findMany({
        where: {
          AND: words.map((word) => ({
            OR: [
              { freelancePetSitter: { firstName: { contains: word } } },
              { freelancePetSitter: { lastName: { contains: word } } },
              { petHotel: { hotelName: { contains: word } } },
            ],
          })),
        },
        include: {
          user: true,
        },
      });
    }),
  getByUsernameSortby: publicProcedure
    .input(
      z.object({
        username: z.string(),
        sortby: z.string(),
        petSitterType: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log("gg:   ", input);

      //PAI JOBS
      const user = await ctx.prisma.user.findMany({
        where: {
          username: input.username,
        },
      });
      const userId = user?.userId;
      const sitter = await ctx.prisma.petSitter.findMany({
        where: {
          userId: userId,
        },
      });
      const petHotel = await ctx.prisma.petHotel.findMany({
        where: {
          userId: userId,
        },
      });
      const ans = { ...petHotel, petSitter: { ...sitter, user: user } };
      return petHotel == null ? null : ans;
    }),
});
