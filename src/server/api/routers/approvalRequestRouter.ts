import { ApprovalRequestStatus } from "@prisma/client";
import { prisma } from "./../../db";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  sitterProcedure,
  adminProcedure,
} from "../trpc";
import { TRPCError } from "@trpc/server";
import { Return } from "../../../schema/returnSchema";

const NO_CERTIFICATION_RESPONSE =
  "The pet sitter hasn't assigned a certificate.";

const NO_PETSITTER_RESPONSE = "Pet sitter id does not exist.";

const ALREADY_REQUESTED = "This pet sitter already submitted a request.";

export const approvalRequestRouter = createTRPCRouter({
  create: sitterProcedure
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
          latestStatusUpdateAt: new Date(),
          notes: "",
        },
        select: Return.approvalRequest,
      });
    }),
  deleteById: adminProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.delete({
        where: { requestId: input.requestId },
        select: Return.approvalRequest,
      });
    }),
  approve: adminProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if pet sitter exists
      const request = await ctx.prisma.approvalRequest.findUnique({
        where: {
          requestId: input.requestId,
        },
        include: {
          petSitter: true,
        },
      });
      const petSitterId = request.petSitter.userId;
      await ctx.prisma.petSitter.update({
        where: {
          userId: petSitterId,
        },
        data: {
          verifyStatus: true,
        },
      });
      return await ctx.prisma.approvalRequest.update({
        where: { requestId: input.requestId },
        data: {
          status: ApprovalRequestStatus.approved,
          adminId: input.adminId,
          latestStatusUpdateAt: new Date(),
        },
        select: Return.approvalRequest,
      });
    }),
  decline: adminProcedure
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
          latestStatusUpdateAt: new Date(),
        },
        select: Return.approvalRequest,
      });
    }),
  pend: adminProcedure
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
          status: ApprovalRequestStatus.pending,
          adminId: input.adminId,
          latestStatusUpdateAt: new Date(),
        },
        select: Return.approvalRequest,
      });
    }),
  updateNotes: adminProcedure
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
        data: { notes: input.notes, latestStatusUpdateAt: new Date() },
        select: Return.approvalRequest,
      });
    }),
  getOwnRequest: sitterProcedure.query(async ({ ctx }) => {
    // Check if pet sitter exists
    return await ctx.prisma.approvalRequest.findFirst({
      where: {
        petSitterId: ctx.session.user.userId,
      },
      select: Return.approvalRequest,
    });
  }),
  getByPetSitterId: adminProcedure
    .input(
      z.object({
        petSitterId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Check if pet sitter exists
      return await ctx.prisma.approvalRequest.findFirst({
        where: {
          petSitterId: input.petSitterId,
        },
        select: Return.approvalRequest,
      });
    }),
  getAll: adminProcedure.query(async ({ ctx, input }) => {
    // Check if pet sitter exists
    return await ctx.prisma.approvalRequest.findMany({
      select: Return.approvalRequest,
    });
  }),
  getPending: adminProcedure.query(async ({ ctx, input }) => {
    // Check if pet sitter exists
    return await ctx.prisma.approvalRequest.findMany({
      where: {
        status: ApprovalRequestStatus.pending,
      },
      select: Return.approvalRequest,
    });
  }),
  getDeclined: adminProcedure.query(async ({ ctx, input }) => {
    // Check if pet sitter exists
    return await ctx.prisma.approvalRequest.findMany({
      where: {
        status: ApprovalRequestStatus.declined,
      },
      select: Return.approvalRequest,
    });
  }),
  getApproved: adminProcedure.query(async ({ ctx, input }) => {
    // Check if pet sitter exists
    return await ctx.prisma.approvalRequest.findMany({
      where: {
        status: ApprovalRequestStatus.approved,
      },
      select: Return.approvalRequest,
    });
  }),
});
