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
  PrismaClient,
  User,
  Prisma,
  ApprovalRequest,
  Admin,
} from "@prisma/client";
import postPic from "../logic/s3Op/postPic";
import profilePic from "../logic/s3Op/profilePic";
import type { S3Client } from "@aws-sdk/client-s3";
import type { IOmise } from "omise";

export const userRouter = createTRPCRouter({
  getByUsername: publicProcedure
    .meta({
      description: "Get user by username",
      openapi: {
        method: "GET",
        path: "/user/getByUsername",
        tags: ["user"],
      },
    })
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
  getImagebyId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.user.findUnique({
        where: { userId: input.userId },
        select: { imageUri: true },
      });
      return result ? result["imageUri"] : null;
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
              ApprovalRequest: true,
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
          message: "user router fucked up",
          cause: error,
        });
      }
    }),

  getAllForProfile: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      include: {
        petOwner: true,
        petSitter: {
          include: {
            freelancePetSitter: true,
            petHotel: true,
            ApprovalRequest: true,
          },
        },
        Admin: true,
      },
    });

    return users
      .filter((user) => user)
      .map((user) => {
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
      });
  }),

  deleteByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await deleteByUser(ctx.s3, ctx.prisma, ctx.omise, {
        userId: input.userId,
      });
    }),

  deleteByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await deleteByUser(ctx.s3, ctx.prisma, ctx.omise, {
        username: input.username,
      });
    }),

  deleteByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await deleteByUser(ctx.s3, ctx.prisma, ctx.omise, {
        email: input.email,
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
  getMyImageUri: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session?.user == null) return null;
    const userId = ctx.session.user.id;
    const result = await ctx.prisma.user.findUnique({
      where: { userId: userId },
      select: { imageUri: true },
    });
    return result ? result["imageUri"] : null;
  }),
});

export async function deleteByUser(
  s3: S3Client,
  prisma: PrismaClient,
  omise: IOmise,
  where: Prisma.UserWhereUniqueInput
) {
  // Delete user in db
  const user = await prisma.user.delete({
    where,
    include: {
      petSitter: {
        select: {
          recipientId: true,
          post: {
            select: { postId: true },
          },
        },
      },
      petOwner: {
        select: {
          customerId: true,
        },
      },
    },
  });

  const { petSitter, petOwner, ...userData } = user;

  // Run clean up tasks concurrently
  await Promise.allSettled([
    // Delete user's profile pic
    profilePic.delete(s3, userData.userId),
    // If the deleted user is a pet sitter, delete all their post images.
    (async () => {
      if (petSitter) {
        await Promise.allSettled(
          petSitter.post.map(({ postId }) => postPic.deleteOfPost(s3, postId))
        );
      }
    })(),
    // If the deleted user is a pet owner, delete the Omise's customer
    (async () => {
      if (petOwner) {
        await omise.customers.destroy(petOwner.customerId);
      }
    })(),
    // If the deleted user is a pet sitter, delete the Omise's recipient
    (async () => {
      if (petSitter) {
        await omise.recipients.destroy(petSitter.recipientId);
      }
    })(),
  ]);

  return userData as User;
}

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
          ApprovalRequest: ApprovalRequest[];
        })
      | null;
    Admin: Admin | null;
  }
): UserProfile & UserProfileSubType {
  const { petOwner, petSitter, Admin, ...userData } = user;

  if (Admin) {
    const { password, emailVerified, customerId, ...result } = {
      userType: UserType.Admin,
      ...userData,
    };
    return result;
  }

  if (petOwner) {
    const { password, emailVerified, customerId, ...result } = {
      userType: UserType.PetOwner as UserType.PetOwner, // I HAVE TO PUT THIS, IDK WHY IT HAS BUG
      ...userData,
      ...petOwner,
    };
    return result;
  }

  if (petSitter) {
    const { freelancePetSitter, petHotel, ApprovalRequest, ...petSitterData } =
      petSitter;
    if (freelancePetSitter) {
      const {
        password,
        emailVerified,
        recipientId,
        startPrice,
        endPrice,
        ...result
      } = {
        userType: UserType.FreelancePetSitter as UserType.FreelancePetSitter,
        ...userData,
        ...petSitterData,
        ...freelancePetSitter,
        ApprovalRequest,
      };
      return result;
    }
    if (petHotel) {
      const {
        password,
        emailVerified,
        recipientId,
        startPrice,
        endPrice,
        ...result
      } = {
        userType: UserType.PetHotel as UserType.PetHotel,
        ...userData,
        ...petSitterData,
        ...petHotel,
        ApprovalRequest,
      };
      return result;
    }
  }

  throw new Error("Cannot determine user type");
}
