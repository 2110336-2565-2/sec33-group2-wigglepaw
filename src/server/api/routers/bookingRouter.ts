import { TypeOf, z } from "zod";

import { BookingStatus } from "@prisma/client";
import { UserProfile, UserSubType, UserType } from "../../../types/user";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { bookingFields, searchBookingField } from "../../../schema/schema";
import { Return } from "../../../schema/returnSchema";
import { UserTypeLogic } from "../logic/session";
import { BookingSearchLogic } from "../logic/search/booking";

const NO_USER_IN_SESSION = {
  status: "ERROR",
  reason: "this session does not have user",
};
const USER_TYPE_MISMATCH = {
  status: "ERROR",
  reason: "this user type can not perform this operation",
};
const NO_BOOKING_FOUND = {
  status: "ERROR",
  reason: "no booking that matched booking Id and your user Id found",
};
const BOOKING_STATUS_UNAVAILABLE = {
  status: "ERROR",
  reason:
    "booking status can not be changed ( it may already be either canceled or accepted )",
};
function getSuccessResponse(result: string): object {
  return { status: "SUCCESS", result: result };
}

export const bookingRouter = createTRPCRouter({
  //public procedure that get booking by ID
  getById: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const result = await ctx.prisma.booking.findFirst({
        where: {
          AND: [
            BookingSearchLogic.byUserIdAuto(userId),
            BookingSearchLogic.byBookingId(input.bookingId),
          ],
        },
        select: Return.booking,
      });
      return result;
    }),

  //public procedure that get booking by logged in user ID
  getMyBooking: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    const result = ctx.prisma.booking.findMany({
      where: BookingSearchLogic.byUserIdAuto(userId),
      select: Return.booking,
    });
    return result;
  }),

  // request booking petOwner
  request: protectedProcedure
    .input(bookingFields)
    .mutation(async ({ ctx, input }) => {
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetOwner(userType)) return USER_TYPE_MISMATCH;
      const petOwnerId = ctx.session.user.id;
      const uniquePetIdList = [...new Set(input.petIdList)];

      return await ctx.prisma.booking.create({
        data: {
          petOwnerId: petOwnerId,
          petSitterId: input.petSitterId,
          startDate: input.startDate,
          endDate: input.endDate,
          note: input.note,
          numberOfPets: uniquePetIdList.length,
          status: BookingStatus.requested,
          pet: {
            connect: uniquePetIdList.map((petId) => ({ petId: petId })),
          },
        },
        select: Return.booking,
      });
    }),

  // accept booking by petSitter
  accept: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user == null) return NO_USER_IN_SESSION;
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetSitter(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await ctx.prisma.booking.findFirst({
        where: {
          AND: [
            BookingSearchLogic.byUserIdAuto(userId),
            BookingSearchLogic.byBookingId(input.bookingId),
          ],
        },
      });
      if (qualified == null || input.bookingId != qualified.bookingId)
        return NO_BOOKING_FOUND;
      if (qualified.status != BookingStatus.requested)
        return BOOKING_STATUS_UNAVAILABLE;
      const update = await ctx.prisma.booking.update({
        where: {
          bookingId: input.bookingId,
        },
        data: {
          status: BookingStatus.accepted,
        },
      });
      return getSuccessResponse(update.status);
    }),

  // cancel booking by petOwner
  cancel: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user == null) return NO_USER_IN_SESSION;
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetOwner(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await ctx.prisma.booking.findFirst({
        where: {
          AND: [
            BookingSearchLogic.byUserIdAuto(userId),
            BookingSearchLogic.byBookingId(input.bookingId),
          ],
        },
      });
      if (qualified == null || input.bookingId != qualified.bookingId)
        return NO_BOOKING_FOUND;
      if (qualified.status != BookingStatus.requested)
        return BOOKING_STATUS_UNAVAILABLE;
      const status = BookingStatus.canceled;
      const update = await ctx.prisma.booking.update({
        where: {
          bookingId: input.bookingId,
        },
        data: {
          status: status,
        },
      });
      return getSuccessResponse(update.status);
    }),

  // reject booking by petSitter
  reject: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user == null) return NO_USER_IN_SESSION;
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetSitter(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await ctx.prisma.booking.findFirst({
        where: {
          AND: [
            BookingSearchLogic.byUserIdAuto(userId),
            BookingSearchLogic.byBookingId(input.bookingId),
          ],
        },
      });
      if (qualified == null || input.bookingId != qualified.bookingId)
        return NO_BOOKING_FOUND;
      if (qualified.status != BookingStatus.requested)
        return BOOKING_STATUS_UNAVAILABLE;
      const status = BookingStatus.rejected;
      const update = await ctx.prisma.booking.update({
        where: {
          bookingId: input.bookingId,
        },
        data: {
          status: status,
        },
      });
      return getSuccessResponse(update.status);
    }),

  // search booking by petSitter
  search: protectedProcedure
    .input(searchBookingField)
    .query(async ({ ctx, input }) => {
      if (ctx.session.user == null) return [];
      const userType: UserType = ctx.session.user?.userType ?? null;
      const userId = ctx.session.user.id;
      const bookings = await ctx.prisma.booking.findMany({
        where: {
          AND: [
            BookingSearchLogic.byUserIdAuto(userId),
            BookingSearchLogic.byBookingIdList(input.searchBookingIdList),
            BookingSearchLogic.byUserIdListAuto(input.searchUserIdList),
            BookingSearchLogic.byStatusList(input.searchStatusList),
            input.searchStartDate
              ? BookingSearchLogic.byStartDate(input.searchStartDate)
              : {},
            input.searchEndDate
              ? BookingSearchLogic.byEndDate(input.searchEndDate)
              : {},
          ],
        },
        orderBy: [BookingSearchLogic.sortBy(input.searchSortBy)],
        select: Return.booking,
      });
      return bookings;
    }),
});
