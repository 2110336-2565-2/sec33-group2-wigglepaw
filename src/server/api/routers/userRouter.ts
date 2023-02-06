import { initTRPC } from '@trpc/server';
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const zodUserFields = z.object({
    userId: z.string().cuid().optional(),
    username: z.string(),
    email: z.string().email(),
    emailVerified: z.date().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    imageUri: z.string().optional(),
    backAccount: z.string().optional(),
    backName: z.string().optional(),
    // accounts: Account
});

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
    post: publicProcedure.input(z.array(zodUserFields)).mutation(({ ctx, input }) => {
        return ctx.prisma.user.createMany({
            data: input
          });
        }),

    deleteById: publicProcedure.input(z.object({userId:z.array(z.string())})).mutation(({ ctx, input }) => {
      return ctx.prisma.user.deleteMany({
          where: {
            userId: {
              in: input.userId
            }
          }
        });
      }),

      deleteByUsername: publicProcedure.input(z.object({username:z.array(z.string())})).mutation(({ ctx, input }) => {
        return ctx.prisma.user.deleteMany({
            where: {
              username: {
                in: input.username
              }
            }
          });
        }),
})