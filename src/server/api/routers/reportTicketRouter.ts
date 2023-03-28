import { TRPCError } from "@trpc/server";
import { reportTicketFields, ticketStatus } from "./../../../schema/schema";
import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { ReportTicketStatus } from "@prisma/client";

function throwErr(err) {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "reportTickerRouter fucked up",
    cause: err,
  });
}

export const reportTicketRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        reporterId: z.string().cuid(),
        reportTicket: reportTicketFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.create({
          data: {
            reporterId: input.reporterId,
            status: ticketStatus.Enum.pending,
            ...input.reportTicket,
          },
          include: {
            reporter: true,
            admin: true,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),

  deleteById: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.delete({
          where: {
            ticketId: input.ticketId,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),

  ack: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.update({
          where: {
            ticketId: input.ticketId,
          },
          data: {
            adminId: input.adminId,
            status: ReportTicketStatus.acked,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),

  cancel: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.update({
          where: {
            ticketId: input.ticketId,
          },
          data: {
            adminId: input.adminId,
            status: ReportTicketStatus.canceled,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),

  resolve: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.update({
          where: {
            ticketId: input.ticketId,
          },
          data: {
            adminId: input.adminId,
            status: ReportTicketStatus.resolved,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),
});
