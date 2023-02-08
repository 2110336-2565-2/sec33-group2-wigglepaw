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

export const userRouter = createTRPCRouter({
  post: publicProcedure.input(userFields).mutation(({ ctx, input }) => {
    return ctx.prisma.user.create({
      data: input,
    });
  }),

  deleteByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          userId: input.userId,
        },
      });
    }),

  deleteByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          username: input.username,
        },
      });
    }),

  deleteByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          email: input.email,
        },
      });
    }),

  update: publicProcedure
    .input(z.object({ userId: z.string(), data: userFields }))
    .query(async ({ ctx, input }) => {
      const update = ctx.prisma.user.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
