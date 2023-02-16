import { TRPCError, initTRPC } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
} from "../../../schema/schema";
import {
  type UserSubType,
  UserType,
  UserProfile,
  UserProfileSubType,
} from "../../../types/user";
import type {
  FreelancePetSitter,
  PetHotel,
  PetOwner,
  PetSitter,
  User,
} from "@prisma/client";

export const userRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;

      try {
        return flattenUser(user);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "userRouter fucked up",
          cause: error,
        });
      }
    }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          userId: input.userId,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;

      try {
        return flattenUser(user);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "userRouter fucked up",
          cause: error,
        });
      }
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;

      try {
        return flattenUser(user);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "userRouter fucked up",
          cause: error,
        });
      }
    }),

  getForProfilePage: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
        include: {
          petOwner: true,
          petSitter: {
            include: {
              freelancePetSitter: true,
              petHotel: true,
            },
          },
        },
      });

      if (!user) return null;

      // NEED SOME TRY CATCH EXCEPTION HERE
      try {
        return flattenUserForProfilePage(user);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "userRouter fucked up",
          cause: error,
        });
      }
    }),

  post: publicProcedure.input(userFields).mutation(({ ctx, input }) => {
    return ctx.prisma.user.create({
      data: input,
    });
  }),

  deleteByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          userId: input.userId,
        },
      });
    }),

  deleteByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          username: input.username,
        },
      });
    }),

  deleteByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.delete({
        where: {
          email: input.email,
        },
      });
    }),

  update: publicProcedure
    .input(z.object({ userId: z.string(), data: userFields.partial() }))
    .mutation(async ({ ctx, input }) => {
      const update = ctx.prisma.user.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});

function flattenUser(
  user: User & {
    petOwner: PetOwner | null;
    petSitter:
      | (PetSitter & {
          freelancePetSitter: FreelancePetSitter | null;
          petHotel: PetHotel | null;
        })
      | null;
  }
): User & UserSubType {
  const { petOwner, petSitter, ...userData } = user;

  if (petOwner)
    return { userType: UserType.PetOwner, ...userData, ...petOwner };

  if (petSitter) {
    const { freelancePetSitter, petHotel, ...petSitterData } = petSitter;
    if (freelancePetSitter)
      return {
        userType: UserType.FreelancePetSitter,
        ...userData,
        ...petSitterData,
        ...freelancePetSitter,
      };
    if (petHotel) {
      return {
        userType: UserType.PetHotel,
        ...userData,
        ...petSitterData,
        ...petHotel,
      };
    }
  }

  throw new Error("Cannot determine user type");
}

// I HAVE SOME INSPIRATION
function flattenUserForProfilePage(
  user: User & {
    petOwner: PetOwner | null;
    petSitter:
      | (PetSitter & {
          freelancePetSitter: FreelancePetSitter | null;
          petHotel: PetHotel | null;
        })
      | null;
  }
): UserProfile & UserProfileSubType {
  const { petOwner, petSitter, ...userData } = user;

  if (petOwner) {
    const { password, emailVerified, bankAccount, bankName, ...result } = {
      userType: UserType.PetOwner as UserType.PetOwner, // I HAVE TO PUT THIS, IDK WHY IT HAS BUG
      ...userData,
      ...petOwner,
    };
    return result;
  }

  if (petSitter) {
    const { freelancePetSitter, petHotel, ...petSitterData } = petSitter;
    if (freelancePetSitter) {
      const {
        password,
        emailVerified,
        bankAccount,
        bankName,
        startPrice,
        endPrice,
        ...result
      } = {
        userType: UserType.FreelancePetSitter as UserType.FreelancePetSitter,
        ...userData,
        ...petSitterData,
        ...freelancePetSitter,
      };
      return result;
    }
    if (petHotel) {
      const {
        password,
        emailVerified,
        bankAccount,
        bankName,
        startPrice,
        endPrice,
        ...result
      } = {
        userType: UserType.PetHotel as UserType.PetHotel,
        ...userData,
        ...petSitterData,
        ...petHotel,
      };
      return result;
    }
  }

  throw new Error("Cannot determine user type");
}
