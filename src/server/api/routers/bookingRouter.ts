import { TypeOf, z } from "zod";

import { BookingStatus } from "@prisma/client";
import { UserProfile, UserSubType, UserType } from "../../../types/user";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { bookingFields, returnField } from "../../../schema/schema";

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
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const result = await ctx.prisma.booking.findUnique({
        where: {
          bookingId: input.id,
        },
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
    });
    return result;
  }),

  //public procedure that get booking by name
  getByUserId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      if (ctx.session.user == null) return [];
      const userType: UserType = ctx.session.user?.userType ?? null;
      const isPetSitter: boolean = [
        UserType.FreelancePetSitter,
        UserType.PetHotel,
      ].includes(userType);
      const isPetOwner: boolean = [UserType.PetOwner].includes(userType);
      if (!isPetSitter && !isPetOwner) return [];
      const userId = ctx.session.user.id;
      const condition: object[] = isPetSitter
        ? [{ petSitterId: userId }, { petOwnerId: input.id }]
        : [{ petSitterId: input.id }, { petOwnerId: userId }];
      return ctx.prisma.booking.findMany({
        where: {
          AND: condition,
        },
      });
    }),

  // create booking petOwner
  create: protectedProcedure
    .input(bookingFields)
    .mutation(async ({ ctx, input }) => {
      const userType: UserType = ctx.session.user?.userType ?? null;
      const isPetOwner: boolean = [UserType.PetOwner].includes(userType);
      if (!isPetOwner) return USER_TYPE_MISMATCH;
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
        include: {
          pet: true,
        },
      });
    }),

  // accepted booking by petSitter
  accepted: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user == null) return NO_USER_IN_SESSION;
      const userType: UserType = ctx.session.user?.userType ?? null;
      const isPetSitter: boolean = [
        UserType.FreelancePetSitter,
        UserType.PetHotel,
      ].includes(userType);
      if (!isPetSitter) return USER_TYPE_MISMATCH;
      const qualified = await ctx.prisma.booking.findFirstOrThrow({
        where: {
          AND: [
            { petSitterId: ctx.session.user.id },
            { bookingId: input.bookingId },
          ],
        },
        select: {
          bookingId: true,
          status: true,
        },
      });
      if (input.bookingId != qualified.bookingId) return NO_BOOKING_FOUND;
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

  // cancel booking by petSitter or petOwner
  cancel: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user == null) return NO_USER_IN_SESSION;
      const userType: UserType = ctx.session.user?.userType ?? null;
      const isPetSitter: boolean = [
        UserType.FreelancePetSitter,
        UserType.PetHotel,
      ].includes(userType);
      const isPetOwner: boolean = [UserType.PetOwner].includes(userType);
      if (!isPetSitter && !isPetOwner) return USER_TYPE_MISMATCH;
      const userId = ctx.session.user.id;
      const userIdCondition: object = isPetSitter
        ? { petSitterId: userId }
        : { petOwnerId: userId };
      const qualified = await ctx.prisma.booking.findFirstOrThrow({
        where: {
          AND: [userIdCondition, { bookingId: input.bookingId }],
        },
        select: {
          bookingId: true,
          status: true,
        },
      });
      if (input.bookingId != qualified.bookingId) return NO_BOOKING_FOUND;
      if (qualified.status != BookingStatus.requested)
        return BOOKING_STATUS_UNAVAILABLE;
      const status = isPetSitter
        ? BookingStatus.canceledByPetSitter
        : BookingStatus.canceledByPetOwner;
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
});
