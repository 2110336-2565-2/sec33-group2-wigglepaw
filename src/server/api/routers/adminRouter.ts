import { prisma } from "./../../db";
import { z } from "zod";

import * as trpc from "../trpc";
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
import { saltHashPassword } from "../../../pages/api/auth/[...nextauth]";

export const adminRouter = trpc.createTRPCRouter({
  create: trpc.publicProcedure
    .input(
      z.object({
        user: userFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = input.user;
      const saltHash = saltHashPassword(user.password);
      const salt = saltHash.salt;
      const hash = saltHash.hash;
      user.password = hash;
      return await ctx.prisma.admin.create({
        data: {
          user: {
            create: {
              ...input.user,
              salt: salt,
            },
          },
        },

        include: {
          user: true,
        },
      });
    }),
  delete: trpc.publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.admin.delete({
        where: {
          userId: input.userId,
        },
      });
    }),
});
