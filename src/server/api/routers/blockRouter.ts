import { TypeOf, z } from "zod";

import { BookingStatus } from "@prisma/client";
import { UserProfile, UserSubType, UserType } from "../../../types/user";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { userIdObject } from "../../../schema/schema";
import { Return } from "../../../schema/returnSchema";
import type { User, BlockedUser } from "@prisma/client";
import { BlockProcedureLogic } from "../logic/procedure/blockProcedureLogic";

export const blockRouter = createTRPCRouter({
  isUserBlocked: protectedProcedure
    .input(userIdObject)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await BlockProcedureLogic.isUserBlocked(
        ctx.prisma,
        userId,
        input.userId
      );
    }),

  //get list of block
  getMyBlock: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    const blockedUsers = ctx.prisma.blockedUser.findMany({
      where: {
        blockedById: userId,
      },
      select: { blockedUser: { select: Return.userWithType } },
    });
    return blockedUsers;
  }),

  // block s/o
  block: protectedProcedure
    .input(userIdObject)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.blockedUser.create({
        data: {
          blockedById: userId,
          blockedUserId: input.userId,
        },
      });
    }),

  // unblock s/o
  unblock: protectedProcedure
    .input(userIdObject)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.blockedUser.delete({
        where: {
          id: {
            blockedById: userId,
            blockedUserId: input.userId,
          },
        },
      });
    }),
});
