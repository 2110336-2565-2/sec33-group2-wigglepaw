import { initTRPC } from '@trpc/server';
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const touchyTestRouter = createTRPCRouter({
    getByUsername: publicProcedure.input(z.string()).query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          username: input,
        },
      });
    }),
    /* /api/trpc/greetings */
  greetings: publicProcedure
  .input(
    z.object({
      name:z.string(),
    }),
  )
  .query(({input}) => {
    return {
      text: `hello ${input?.name ?? 'world'}`,
    };
  }),
  createUser: publicProcedure.input(z.object({username:z.string(),email:z.string()}))
  .query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        username: input.username,
        email: input.email
      },
    });
  }),
});

