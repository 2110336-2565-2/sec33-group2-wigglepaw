import {
  userFields,
  freelancePetSitterFields,
  petSitterFields,
} from "./../../../schema/schema";
import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
export const freelancePetSitterRouter = createTRPCRouter({
  createFreelancePetSitter: publicProcedure
    .input(
      z.object({
        user: userFields,
        petSitter: petSitterFields,
        freelancePetSitter: freelancePetSitterFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.freelancePetSitter.create({
        data: {
          petSitter: {
            create: {
              user: {
                create: input.user,
              },
              ...input.petSitter,
            },
          },
          ...input.freelancePetSitter,
        },
        include: {
          petSitter: {
            include: {
              user: true,
            },
          },
        },
      });
    }),
});
