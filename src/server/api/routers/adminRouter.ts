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
import { saltHashPassword } from "../../../pages/api/auth/[...nextauth]";

export const adminRouter = createTRPCRouter({
  create: publicProcedure
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
});
