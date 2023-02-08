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
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),

  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          username: input.username,
        },
      });
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          email: input.email,
        },
      });
    }),

  // post: publicProcedure.input(z.object(userFields)).query(({ ctx, input }) => {
  post: publicProcedure.input(userFields).mutation(({ ctx, input }) => {
    return ctx.prisma.user.create({
      data: input,
    });
  }),

  deleteById: publicProcedure
    .input(z.object({ userIds: z.array(z.string()) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.deleteMany({
        where: {
          userId: {
            in: input.userIds,
          },
        },
      });
    }),

  deleteByUsername: publicProcedure
    .input(z.object({ usernames: z.array(z.string()) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.deleteMany({
        where: {
          username: {
            in: input.usernames,
          },
        },
      });
    }),

  deleteByEmail: publicProcedure
    .input(z.object({ emails: z.array(z.string()) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.deleteMany({
        where: {
          email: {
            in: input.emails,
          },
        },
      });
    }),
});
