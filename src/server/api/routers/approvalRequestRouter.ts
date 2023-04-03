import { ApprovalRequestStatus } from "@prisma/client";
import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

const NO_CERTIFICATION_RESPONSE =
  "The pet sitter hasn't assigned a certificate.";

const NO_PETSITTER_RESPONSE = "Pet sitter id does not exist.";

const ALREADY_REQUESTED = "This pet sitter already submitted a request.";

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
      // Check if pet sitter already submitted request to the system
      const request = await ctx.prisma.approvalRequest.findUnique({
        where: {
          petSitterId: input.petSitterId,
        },
      });
      // If request already in database
      if (request != null) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: ALREADY_REQUESTED,
        });
      }
      return await ctx.prisma.approvalRequest.create({
        data: {
          petSitterId: input.petSitterId,
          status: ApprovalRequestStatus.pending,
          notes: "",
        },
        include: {
          petSitter: true,
        },
      });
    }),
  deleteById: publicProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.delete({
        where: { requestId: input.requestId },
      });
    }),
  approve: publicProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.update({
        where: { requestId: input.requestId },
        data: {
          status: ApprovalRequestStatus.approved,
          adminId: input.adminId,
        },
      });
    }),
  decline: publicProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.update({
        where: { requestId: input.requestId },
        data: {
          status: ApprovalRequestStatus.declined,
          adminId: input.adminId,
        },
      });
    }),
  pend: publicProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.update({
        where: { requestId: input.requestId },
        data: { status: ApprovalRequestStatus.pending, adminId: input.adminId },
      });
    }),
  updateNotes: publicProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.update({
        where: { requestId: input.requestId },
        data: { notes: input.notes },
      });
    }),
});
