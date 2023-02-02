import { initTRPC } from '@trpc/server';
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const t = initTRPC.create();

export const touchyTestRouter = createTRPCRouter({
    getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          id: input,
        },
      });
    }),
    /* /api/trpc/greetings */
  greetings: t.procedure
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
  });

