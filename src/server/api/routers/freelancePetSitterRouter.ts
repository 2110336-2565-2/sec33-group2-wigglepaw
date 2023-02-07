import { freelancePetSitterFields } from "./../../../schema/schema";
import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const freelancePetSitterRouter = createTRPCRouter({
  createFreelancePetSitter: publicProcedure
    .input(freelancePetSitterFields)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.freelancePetSitter.create({
        data: input,
      });
    }),
});
