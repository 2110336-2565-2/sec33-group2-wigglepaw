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
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });
      if (!user) return {};
      const userId = user?.userId;
      const owner = await ctx.prisma.petOwner.findFirst({
        where: {
          userId: userId,
        },
      });
      const sitter = await ctx.prisma.petSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const freelancer = await ctx.prisma.freelancePetSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const hotel = await ctx.prisma.petHotel.findFirst({
        where: {
          userId: userId,
        },
      });
      if (owner) return { userType: "PetOwner", ...user, ...owner };
      if (freelancer)
        return {
          userType: "FreelancePetSitter",
          ...user,
          ...sitter,
          ...freelancer,
        };
      if (hotel) return { userType: "PetHotel", ...user, ...sitter, ...hotel };
      return "Something went wrong.";
    }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          userId: input.userId,
        },
      });
      if (!user) return {};
      const userId = input?.userId;
      const owner = await ctx.prisma.petOwner.findFirst({
        where: {
          userId: userId,
        },
      });
      const sitter = await ctx.prisma.petSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const freelancer = await ctx.prisma.freelancePetSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const hotel = await ctx.prisma.petHotel.findFirst({
        where: {
          userId: userId,
        },
      });
      if (owner) return { userType: "PetOwner", ...user, ...owner };
      if (freelancer)
        return {
          userType: "FreelancePetSitter",
          ...user,
          ...sitter,
          ...freelancer,
        };
      if (hotel) return { userType: "PetHotel", ...user, ...sitter, ...hotel };
      return "Something went wrong.";
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user) return {};
      const userId = user?.userId;
      const owner = await ctx.prisma.petOwner.findFirst({
        where: {
          userId: userId,
        },
      });
      const sitter = await ctx.prisma.petSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const freelancer = await ctx.prisma.freelancePetSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const hotel = await ctx.prisma.petHotel.findFirst({
        where: {
          userId: userId,
        },
      });
      if (owner) return { userType: "PetOwner", ...user, ...owner };
      if (freelancer)
        return {
          userType: "FreelancePetSitter",
          ...user,
          ...sitter,
          ...freelancer,
        };
      if (hotel) return { userType: "PetHotel", ...user, ...sitter, ...hotel };
      return "Something went wrong.";
    }),

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
