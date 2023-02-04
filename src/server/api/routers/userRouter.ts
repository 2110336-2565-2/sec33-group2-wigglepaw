import { initTRPC } from '@trpc/server';
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
    getById: publicProcedure.input(z.object({id:z.string()})).query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          userId: input.id,
        },
      });
    }),

    getByUsername: publicProcedure.input(z.object({username:z.string()})).query(({ ctx, input }) => {
        return ctx.prisma.user.findMany({
          where: {
            username: input.username,
          },
        });
      }),

    getByEmail: publicProcedure.input(z.object({email:z.string()})).query(({ ctx, input }) => {
    return ctx.prisma.user.findMany({
        where: {
            email: input.email,
        },
    });
    }),

})