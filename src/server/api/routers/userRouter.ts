import { TRPCError, initTRPC } from "@trpc/server";
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
import Trpc from "../../../pages/api/trpc/[trpc].js";
import { UserType } from "../../../types/user";

export const userRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;
      const { petOwner, petSitter, ...userData } = user;

      if (petOwner)
        return { userType: UserType.PetOwner, ...userData, ...petOwner };

      if (petSitter) {
        const { freelancePetSitter, petHotel, ...petSitterData } = petSitter;
        if (freelancePetSitter)
          return {
            userType: UserType.FreelancePetSitter,
            ...userData,
            ...petSitterData,
            ...freelancePetSitter,
          };
        return {
          userType: UserType.PetHotel,
          ...userData,
          ...petSitterData,
          ...petHotel,
        };
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "userRouter fucked up",
      });
    }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          userId: input.userId,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;
      const { petOwner, petSitter, ...userData } = user;

      if (petOwner)
        return { userType: UserType.PetOwner, ...userData, ...petOwner };

      if (petSitter) {
        const { freelancePetSitter, petHotel, ...petSitterData } = petSitter;
        if (freelancePetSitter)
          return {
            userType: UserType.FreelancePetSitter,
            ...userData,
            ...petSitterData,
            ...freelancePetSitter,
          };
        return {
          userType: UserType.PetHotel,
          ...userData,
          ...petSitterData,
          ...petHotel,
        };
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "userRouter fucked up",
      });
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;
      const { petOwner, petSitter, ...userData } = user;

      if (petOwner)
        return { userType: UserType.PetOwner, ...userData, ...petOwner };

      if (petSitter) {
        const { freelancePetSitter, petHotel, ...petSitterData } = petSitter;
        if (freelancePetSitter)
          return {
            userType: UserType.FreelancePetSitter,
            ...userData,
            ...petSitterData,
            ...freelancePetSitter,
          };
        return {
          userType: UserType.PetHotel,
          ...userData,
          ...petSitterData,
          ...petHotel,
        };
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "userRouter fucked up",
      });
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
    .mutation(async ({ ctx, input }) => {
      const update = ctx.prisma.user.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
