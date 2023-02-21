import { TRPCError, initTRPC } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
  postFields,
  sessionRequestFields,
} from "../../../schema/schema";
import {
  type UserSubType,
  UserType,
  UserProfile,
  UserProfileSubType,
} from "../../../types/user";
import type {
  FreelancePetSitter,
  PetHotel,
  PetOwner,
  PetSitter,
  User,
} from "@prisma/client";

export const sessionRequestRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        petSitterId: z.string().cuid(),
        petOwnerId: z.string().cuid(),
        sessionRequest: sessionRequestFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createSessionRequest = await ctx.prisma.sessionRequest.create({
        data: {
          petSitterId: input.petSitterId,
          petOwnerId: input.petOwnerId,
          ...input.sessionRequest,
        },
      });
      return createSessionRequest;
    }),

  cancel: publicProcedure
    .input(
      z.object({
        srId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createSessionRequest = await ctx.prisma.sessionRequest.updateMany({
        where: {
          srId: input.srId,
          status: "Waiting",
        },
        data: {
          status: "Cancelled",
        },
      });
      return createSessionRequest;
    }),

  accept: publicProcedure
    .input(
      z.object({
        srId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createSessionRequest = await ctx.prisma.sessionRequest.updateMany({
        where: {
          srId: input.srId,
          status: "Waiting",
        },
        data: {
          status: "Accepted",
        },
      });
      return createSessionRequest;
    }),

  decline: publicProcedure
    .input(
      z.object({
        srId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createSessionRequest = await ctx.prisma.sessionRequest.updateMany({
        where: {
          srId: input.srId,
          status: "Waiting",
        },
        data: {
          status: "Declined",
        },
      });
      return createSessionRequest;
    }),
});
