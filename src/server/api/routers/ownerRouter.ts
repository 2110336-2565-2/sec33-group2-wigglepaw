import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { contextProps } from "@trpc/react-query/shared";
import { TRPCError } from "@trpc/server";

export const ownerRouter = createTRPCRouter({
  // public procedure that fetch all owner
  // duplicated from petRouter
  getAllOwner: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.owner.findMany();
  }),

  // public procdure that fetch a pet by id
  getOwnerById: publicProcedure
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
    }),

  // create new user and the associated owner and credential record
  createOwner: publicProcedure
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

      return newUser;
    }),

    // updating owner information
    // updateOwner: publicProcedure

});
