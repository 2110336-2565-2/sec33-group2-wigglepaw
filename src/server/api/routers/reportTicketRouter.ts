import { TRPCError } from "@trpc/server";
import { reportTicketFields, ticketStatus } from "./../../../schema/schema";
import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { ReportTicketStatus } from "@prisma/client";
import reportTicketPic from "../logic/s3Op/reportTicketPic";

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
  // using postRouter as a template to upload picture
  // กราบ 1 กราบ 2 กราบ 3 dkomplex ท่านผู้เจริญ
  create: publicProcedure
    .input(
      z.object({
        reporterId: z.string().cuid(),
        reportTicket: reportTicketFields.omit({ image: true }),
        pictureCount: z.number().min(0).max(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // create temporary report ticket with no picture
      // so that we have a reportTicket-id to create URLs for S3
      const createReportTicket = await ctx.prisma.reportTicket.create({
        data: {
          reporterId: input.reporterId,
          status: ticketStatus.Enum.pending,
          ...input.reportTicket,
          pictureUri: undefined, // set as undefined for now, will be later updated once we get urls from s3 provider
        },
        include: {
          reporter: true,
          admin: true,
        },
      });

      // setup for URL generation
      const ticketId = createReportTicket.ticketId;
      const imageIdx = Array.from({ length: input.pictureCount }, (_, i) => i);
      // 1.create presigned URLS for frontend to upload to
      const uploadUrls: string[] = await Promise.all(
        imageIdx.map((i) =>
          reportTicketPic.signedUploadUrl(ctx.s3, ticketId, i)
        )
      );

      // 2.create publicURLs for frontend to view the images
      // and update the model with this value
      const pictureUri = imageIdx.map((i) =>
        reportTicketPic.publicUrl(ticketId, i)
      );
      await ctx.prisma.reportTicket.update({
        where: {
          ticketId,
        },
        data: {
          pictureUri,
        },
      });

      // make a 5-min time bomb, to check if front end uploaded successfully, otherwise delete the report
      const uploadCheckTask = async () => {
        const allUploaded = await Promise.all(
          imageIdx.map((i) =>
            reportTicketPic.checkUploaded(ctx.s3, ticketId, i)
          )
        );

        if (!allUploaded) {
          console.error(`Not uplaoded, deleting report ${ticketId}`);
          await ctx.prisma.reportTicket.delete({
            where: {
              ticketId,
            },
          });
        }
      };
      // start the bomb
      setTimeout(() => {
        uploadCheckTask().then().catch(console.error);
      }, 5 * 60 * 1000);

      // return the reportTicket (in case), and the uploadUrls to which frontend will axios.put
      return {
        reportTicket: createReportTicket,
        uploadUrls,
      };
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
  getByTicketId: publicProcedure
    .input(
      z.object({
        ticketId: z.string().cuid(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const reportTicket = await ctx.prisma.reportTicket.findUnique({
          where: {
            ticketId: input.ticketId,
          },
        });

        const reporter = await ctx.prisma.user.findUnique({
          where: {
            userId: reportTicket?.reporterId,
          },
          select: {
            username: true,
          },
        });

        return { ...reportTicket, username: reporter?.username };
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
