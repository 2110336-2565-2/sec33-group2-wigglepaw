import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const paiRouter = createTRPCRouter({
  getByEmail: publicProcedure
    .input(z.object({ emailll: z.string().email() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: {
          email: input.emailll,
        },
      });
    }),
});
