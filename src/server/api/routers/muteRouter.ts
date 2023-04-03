import { TypeOf, z } from "zod";

import { BookingStatus } from "@prisma/client";
import { UserProfile, UserSubType, UserType } from "../../../types/user";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { userIdObject } from "../../../schema/schema";
import { Return } from "../../../schema/returnSchema";
import type { User, BlockedUser } from "@prisma/client";
import { MuteProcedureLogic } from "../logic/procedure/muteProcedureLogic";

function getUser(blockedUserObject: BlockedUser & { blockedUser: User }): User {
  return blockedUserObject["blockedUser"];
}

export const muteRouter = createTRPCRouter({
  isUserMuted: protectedProcedure
    .input(userIdObject)
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await MuteProcedureLogic.isUserMuted(
        ctx.prisma,
        userId,
        input.userId
      );
    }),

  //get list of mute
  getMyMute: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    const mutedUsers = ctx.prisma.mutedUser.findMany({
      where: {
        mutedById: userId,
      },
      select: { mutedUser: { select: Return.userWithType } },
    });
    return mutedUsers;
  }),

  // mute s/o
  mute: protectedProcedure
    .input(userIdObject)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.mutedUser.create({
        data: {
          mutedById: userId,
          mutedUserId: input.userId,
        },
      });
    }),

  // unmute s/o
  unMute: protectedProcedure
    .input(userIdObject)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.prisma.mutedUser.delete({
        where: {
          id: {
            mutedById: userId,
            mutedUserId: input.userId,
          },
        },
      });
    }),
});
