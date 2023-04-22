import { TypeOf, z } from "zod";

import {
  Booking,
  BookingStatus,
  PrismaClient,
  User,
  Prisma,
} from "@prisma/client";
import { UserProfile, UserSubType, UserType } from "../../../types/user";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  bookingFields,
  searchBookingField,
  returnField,
} from "../../../schema/schema";
import { Return } from "../../../schema/returnSchema";
import { UserTypeLogic } from "../logic/session";
import { BookingSearchLogic } from "../logic/search/bookingSearchLogic";
import { BookingStateLogic, BookingState } from "../logic/bookingStateLogic";
import { chargeAndTransfer } from "../logic/payment";
import { TRPCError } from "@trpc/server";

type returnFieldType = z.TypeOf<typeof returnField>;

const USER_TYPE_MISMATCH: returnFieldType = {
  status: "ERROR",
  reason: "this user type can not perform this operation",
};
const NO_BOOKING_FOUND: returnFieldType = {
  status: "ERROR",
  reason: "no booking that matched booking Id and your user Id found",
};
const BOOKING_STATUS_UNAVAILABLE: returnFieldType = {
  status: "ERROR",
  reason:
    "booking status can not be changed ( it may already be either canceled or accepted )",
};
const END_DATE_BEFORE_START_DATE: returnFieldType = {
  status: "ERROR",
  reason: "Start Date should be before End Date.",
};
const START_DATE_BEFORE_NOW: returnFieldType = {
  status: "ERROR",
  reason: "Start Date should be after current time.",
};
const PAYMENT_FAILED: returnFieldType = {
  status: "ERROR",
  reason: "Payment failed",
};

function getSuccessResponse(result: string): returnFieldType {
  return { status: "SUCCESS", result: result };
}

async function findBookingById(
  prisma: PrismaClient,
  userId: string,
  bookingId: string
) {
  const booking = await prisma.booking.findFirst({
    where: {
      AND: [
        BookingSearchLogic.byUserIdAuto(userId),
        BookingSearchLogic.byBookingId(bookingId),
      ],
    },
  });
  return booking === null ? null : BookingStateLogic.makeState(booking);
}

async function searchBooking(
  prisma: PrismaClient,
  args: Prisma.BookingFindManyArgs
) {
  // return prisma.booking.findMany(args);
  const bookings: Booking[] = await prisma.booking.findMany(args);
  return bookings.map(BookingStateLogic.makeState);
}

export const bookingRouter = createTRPCRouter({
  //public procedure that get booking by ID
  getById: protectedProcedure
    .input(z.object({ bookingId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const result = await findBookingById(ctx.prisma, userId, input.bookingId);
      return result;
    }),

  //public procedure that get booking by logged in user ID
  getMyBooking: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    const result = searchBooking(ctx.prisma, {
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

      if (input.startDate < new Date()) {
        return START_DATE_BEFORE_NOW;
      }
      if (input.endDate <= input.startDate) {
        return END_DATE_BEFORE_START_DATE;
      }

      return await ctx.prisma.booking.create({
        data: {
          petOwnerId: petOwnerId,
          petSitterId: input.petSitterId,
          totalPrice: input.totalPrice,
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
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetSitter(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await findBookingById(
        ctx.prisma,
        userId,
        input.bookingId
      );
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
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetOwner(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await findBookingById(
        ctx.prisma,
        userId,
        input.bookingId
      );
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
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetSitter(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await findBookingById(
        ctx.prisma,
        userId,
        input.bookingId
      );
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

  // pay booking by petOwner
  pay: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userType: UserType = ctx.session.user?.userType ?? null;
      if (!UserTypeLogic.isPetOwner(userType)) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const qualified = await findBookingById(
        ctx.prisma,
        userId,
        input.bookingId
      );
      if (qualified == null || input.bookingId != qualified.bookingId)
        return NO_BOOKING_FOUND;
      if (qualified.status != BookingStatus.accepted)
        return BOOKING_STATUS_UNAVAILABLE;
      const status = BookingStatus.paid;

      // Retrive customer, recipient, price of booking
      const {
        petOwner: { customerId },
        petSitter: { recipientId },
        totalPrice,
      } = await ctx.prisma.booking.findUniqueOrThrow({
        where: {
          bookingId: input.bookingId,
        },
        select: {
          totalPrice: true,
          petOwner: {
            select: {
              customerId: true,
            },
          },
          petSitter: {
            select: {
              recipientId: true,
            },
          },
        },
      });

      // Transfer money from customer to recipient
      try {
        const satang = Math.round(100 * totalPrice);
        await chargeAndTransfer(
          ctx.omise,
          satang,
          customerId,
          recipientId,
          input.bookingId
        );
      } catch (error) {
        console.error("Failed payment", error);
        throw error;
      }

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
      const userId = ctx.session.user.id;
      const args = {
        where: {
          AND: [
            BookingSearchLogic.byUserIdAuto(userId),
            BookingSearchLogic.byBookingIdList(input.searchBookingIdList),
            BookingSearchLogic.byUserIdListAuto(input.searchUserIdList),
            BookingSearchLogic.byStatusList(input.searchStatusList),
            input.searchStartDate
              ? BookingSearchLogic.byStartDate(
                  input.searchStartDate.from,
                  input.searchStartDate.to
                )
              : {},
            input.searchEndDate
              ? BookingSearchLogic.byEndDate(
                  input.searchEndDate.from,
                  input.searchEndDate.to
                )
              : {},
          ],
        },
        orderBy: [BookingSearchLogic.sortBy(input.searchSortBy)],
        select: Return.booking,
      };
      return await searchBooking(ctx.prisma, args);
    }),

  // Search my transaction
  myTransaction: protectedProcedure.query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const { petOwner } = await ctx.prisma.user.findUniqueOrThrow({
      where: {
        userId: userId,
      },
      select: {
        petOwner: {
          select: {
            customerId: true,
          },
        },
      },
    });

    if (!petOwner) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not a pet owner, so you can't view transactions.",
      });
    }

    return await ctx.prisma.booking.findMany({
      where: {
        status: BookingStatus.paid,
      },
      include: {
        petSitter: {
          include: {
            user: {
              select: {
                username: true,
                imageUri: true,
              },
            },
            freelancePetSitter: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            petHotel: true,
          },
        },
      },
    });
  }),
});
