import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { contextProps } from "@trpc/react-query/shared";
import { TRPCError } from "@trpc/server";

export const ownerRouter = createTRPCRouter({
  // public procedure that fetch all owner
  // duplicated from petRouter
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.owner.findMany();
  }),

  // public procdure that fetch an owner by id
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const owner = await ctx.prisma.owner.findUnique({
        where: {
          id: input.id,
        },
      });
      if (!owner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No owner with id ${input.id}`,
        });
      }
      return owner
    }),

  // create new user and the associated owner and credential record
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, username, password } = input;

      const newUser = await ctx.prisma.user.create({
        data: {
          name: name,
          email: email,
          credential: {
            create: {
              username: username,
              password: password,
            },
          },
          owner: {
            create: {
              name: name,
              email: email,
            },
          },
        },
      });

      const newOwner = await ctx.prisma.owner.findUnique({
        where: {
          userId: newUser.id
        }
      })

      return newOwner;
    }),

    // updating owner information
    // updateOwner: publicProcedure

});
