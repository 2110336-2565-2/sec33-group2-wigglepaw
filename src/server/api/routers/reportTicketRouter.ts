import { reportTicketFields, ticketStatus } from "./../../../schema/schema";
import { prisma } from "./../../db";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  userFields,
  petOwnerFields,
  petFields,
  reviewFields,
} from "../../../schema/schema";
import {
  makeFree,
  makeHotel,
  makeOwner,
  makePost,
  makeReview,
  updateAvgRating,
} from "../../../seed/db";

export const reportTicketRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        reporterId: z.string().cuid(),
        reportTicket: reportTicketFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
});
