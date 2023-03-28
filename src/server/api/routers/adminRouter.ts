import { z } from "zod";

import * as trpc from "../trpc";
import * as schema from "../../../schema/schema";
import { saltHashPassword } from "../../../pages/api/auth/[...nextauth]";

export const adminRouter = trpc.createTRPCRouter({
  create: trpc.publicProcedure
    .input(
      z.object({
        user: schema.userFields,
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
  deleteById: trpc.publicProcedure
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
