import { initTRPC } from '@trpc/server';
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const userFields = {
    userId: z.string().cuid().optional(),
    username: z.string(),
    email: z.string().email(),
    emailVerified: z.date(),
    phoneNumber: z.string(),
    address: z.string(),
    imageUri: z.string(),
    backAccount: z.string(),
    backName: z.string(),
    // accounts: Account
}

export const userRouter = createTRPCRouter({
    getByUserId: publicProcedure.input(z.object({userId:z.string()})).query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          userId: input.userId,
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

    // post: publicProcedure.input(z.object(userFields)).query(({ ctx, input }) => {
    post: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
        return ctx.prisma.user.createMany({
            data: [
              { username: 'Sonali', email: 'sonali@prisma.io' },
              { username: 'Alex', email: 'alex@prisma.io' },
            ],
          });
        }),

})