import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  reviewFields,
  approvalRequestFields,
} from "../../../schema/schema";
import {
  makeFree,
  makeHotel,
  makeOwner,
  makePost,
  makeReview,
  updateAvgRating,
} from "../../../seed/db";
import { TRPCError } from "@trpc/server";

const NO_CERTIFICATION_RESPONSE =
  "The pet sitter hasn't assigned a certificate.";

const NO_PETSITTER_RESPONSE = "Pet sitter id does not exist.";

export const approvalRequestRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        petSitterId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      const petSitter = await ctx.prisma.petSitter.findUnique({
        where: { userId: input.petSitterId },
      });
      if (!petSitter)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: NO_PETSITTER_RESPONSE,
        });
      // Check if pet sitter has a certificate assigned to system
      if (!petSitter.certificationUri)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: NO_CERTIFICATION_RESPONSE,
        });

      return await ctx.prisma.approvalRequest.create({
        data: {
          petSitterId: input.petSitterId,
          notes: "",
        },
        include: {
          petSitter: true,
        },
      });
    }),
});
