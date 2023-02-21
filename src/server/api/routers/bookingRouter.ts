import { TypeOf, z } from "zod";

import { BookingStatus } from "@prisma/client";
import { UserProfile, UserSubType, UserType } from "../../../types/user";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  bookingFields,
  searchBookingField,
  returnReadBookingFields,
} from "../../../schema/schema";
import { UserTypeLogic } from "../logic/session";
import { BookingSearchLogic } from "../logic/search";

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
      const result = await ctx.prisma.booking.findUnique({
        where: {
          bookingId: input.bookingId,
        },
        select: returnReadBookingFields,
      });
      if (result == null) return null;
      if (![result.petSitterId, result.petOwnerId].includes(userId))
        return null;
      else return result;
    }),

  //public procedure that get booking by logged in user ID
  getMyBooking: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    const result = ctx.prisma.booking.findMany({
      where: {
        OR: [{ petSitterId: userId }, { petOwnerId: userId }],
      },
      select: returnReadBookingFields,
    });
    return result;
  }),

  //public procedure that get booking by name
  getByUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user == null) return [];
      const userType: UserType = ctx.session.user?.userType ?? null;
      const userTypeLogic = new UserTypeLogic(userType);
      if (!userTypeLogic.isPetSitter() && !userTypeLogic.isPetOwner())
        return [];
      const userId = ctx.session.user.id;
      const condition: object[] = userTypeLogic.isPetSitter()
        ? [{ petSitterId: userId }, { petOwnerId: input.userId }]
        : [{ petSitterId: input.userId }, { petOwnerId: userId }];
      return ctx.prisma.booking.findMany({
        where: {
          AND: condition,
        },
        select: returnReadBookingFields,
      });
    }),

  // request booking petOwner
  request: protectedProcedure
    .input(bookingFields)
    .mutation(async ({ ctx, input }) => {
      const userType: UserType = ctx.session.user?.userType ?? null;
      const userTypeLogic = new UserTypeLogic(userType);
      if (!userTypeLogic.isPetOwner()) return USER_TYPE_MISMATCH;
      const petOwnerId = ctx.session.user.id;

      return await ctx.prisma.booking.create({
        data: {
          petOwnerId: petOwnerId,
          petSitterId: input.petSitterId,
          startDate: input.startDate,
          endDate: input.endDate,
          note: input.note,
          numberOfPets: input.petIdList.length,
          status: BookingStatus.requested,
          pet: {
            connect: input.petIdList.map((petId) => ({ petId: petId })),
          },
        },
        select: returnReadBookingFields,
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
      const userTypeLogic = new UserTypeLogic(userType);
      if (!userTypeLogic.isPetSitter()) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const userIdCondition: object = { petSitterId: userId };
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
      const userTypeLogic = new UserTypeLogic(userType);
      if (!userTypeLogic.isPetOwner()) return USER_TYPE_MISMATCH;
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
      const userTypeLogic = new UserTypeLogic(userType);
      if (!userTypeLogic.isPetSitter()) return USER_TYPE_MISMATCH;
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
      const userTypeLogic = new UserTypeLogic(userType);
      if (!userTypeLogic.isPetSitter() && !userTypeLogic.isPetOwner())
        return [];
      const userId = ctx.session.user.id;
      const isPetSitter = userTypeLogic.isPetSitter();
      return await ctx.prisma.booking.findMany({
        where: {
          AND: [
            // input.searchBookingId?BookingSearchLogic.byBookingId(input.searchBookingId):{},
            BookingSearchLogic.byUserId(userId, isPetSitter),
            input.searchBookingIdList
              ? BookingSearchLogic.byBookingIdList(input.searchBookingIdList)
              : {},
            input.searchStatusList
              ? BookingSearchLogic.byStatusList(input.searchStatusList)
              : {},
            input.searchStartDate
              ? BookingSearchLogic.byStartDate(input.searchStartDate)
              : {},
            input.searchUserId
              ? BookingSearchLogic.byUserId(input.searchUserId, !isPetSitter)
              : {},
          ],
        },
        orderBy: [
          input.searchSortBy
            ? BookingSearchLogic.sortBy(input.searchSortBy)
            : {},
        ],
        select: returnReadBookingFields,
      });
    }),
});
