import { TRPCError } from "@trpc/server";
import { reportTicketFields, ticketStatus } from "./../../../schema/schema";
import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { ReportTicketStatus } from "@prisma/client";

function throwErr(err: unknown) {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "reportTickerRouter fucked up",
    cause: err,
  });
}

function stateErr(from: string, to: string) {
  const message = `Changing status from '${from}' to '${to}' is not allowed.`;

  return {
    success: false,
    message: message,
  };
}

function differentAdminErr() {
  return {
    success: false,
    message: "This ticket is already assigned to another admin.",
  };
}

export const reportTicketRouter = createTRPCRouter({
  // Create
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
  getAll: publicProcedure.mutation(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.reportTicket.findMany();
    } catch (err) {
      throwErr(err);
    }
  }),
  getPending: publicProcedure.mutation(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.reportTicket.findMany({
        where: {
          status: ReportTicketStatus.pending,
        },
      });
    } catch (err) {
      throwErr(err);
    }
  }),
  getCanceled: publicProcedure.mutation(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.reportTicket.findMany({
        where: {
          status: ReportTicketStatus.canceled,
        },
      });
    } catch (err) {
      throwErr(err);
    }
  }),
  getResolved: publicProcedure.mutation(async ({ ctx, input }) => {
    try {
      return await ctx.prisma.reportTicket.findMany({
        where: {
          status: ReportTicketStatus.resolved,
        },
      });
    } catch (err) {
      throwErr(err);
    }
  }),

  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.findMany({
          where: {
            reporterId: input.userId,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),
  getByAdminId: publicProcedure
    .input(
      z.object({
        adminId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.reportTicket.findMany({
          where: {
            adminId: input.adminId,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),
  // Delete by Id
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

  // Acknowledge
  ack: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        adminId: z.string().cuid(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get current status
      const ticket = await ctx.prisma.reportTicket.findUnique({
        where: { ticketId: input.ticketId },
        select: { status: true },
      });
      // no ticket in system
      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found in database",
        });
      }
      // check state machine
      // only accept pending to ack
      if (ticket.status.toString() != "pending") {
        return stateErr(ticket.status.toString(), "acked");
      }

      try {
        return await ctx.prisma.reportTicket.update({
          where: {
            ticketId: input.ticketId,
          },
          data: {
            adminId: input.adminId,
            status: ReportTicketStatus.acked,
            notes: input.notes,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),

  // Cancel
  cancel: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        adminId: z.string().cuid(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // get current status
      const ticket = await ctx.prisma.reportTicket.findUnique({
        where: { ticketId: input.ticketId },
        select: {
          status: true,
          admin: {
            include: {
              user: true,
            },
          },
        },
      });
      // no ticket in system
      if (!ticket) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ticket not found in database",
        });
      }
      // check state machine
      const badStatus = ["canceled", "resolved"];
      if (badStatus.includes(ticket.status.toString())) {
        return stateErr(ticket.status.toString(), "canceled");
      }
      const ticketAdmin = ticket.admin?.user;
      // Different admins --> unauthorized
      if (ticketAdmin?.userId && ticketAdmin?.userId != input.adminId) {
        return differentAdminErr();
      }
      try {
        return await ctx.prisma.reportTicket.update({
          where: {
            ticketId: input.ticketId,
          },
          data: {
            adminId: input.adminId,
            status: ReportTicketStatus.canceled,
            notes: input.notes,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),

  // Resolve
  resolve: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
        adminId: z.string().cuid(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // get current status
        const ticket = await ctx.prisma.reportTicket.findUnique({
          where: { ticketId: input.ticketId },
          select: {
            status: true,
            admin: {
              include: {
                user: true,
              },
            },
          },
        });
        // no ticket in system
        if (!ticket) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Ticket not found in database",
          });
        }
        // check state machine
        const badStatus = ["canceled", "resolved"];
        if (badStatus.includes(ticket.status.toString())) {
          return stateErr(ticket.status.toString(), "resolved");
        }
        const ticketAdmin = ticket.admin?.user;
        // Different admins --> unauthorized
        if (ticketAdmin?.userId && ticketAdmin?.userId != input.adminId) {
          return differentAdminErr();
        }
        return await ctx.prisma.reportTicket.update({
          where: {
            ticketId: input.ticketId,
          },
          data: {
            adminId: input.adminId,
            status: ReportTicketStatus.resolved,
            notes: input.notes,
          },
        });
      } catch (err) {
        throwErr(err);
      }
    }),
});
