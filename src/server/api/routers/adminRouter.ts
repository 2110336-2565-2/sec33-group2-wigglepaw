import { z } from "zod";

import * as trpc from "../trpc";
import * as schema from "../../../schema/schema";
import { saltHashPassword } from "../../../pages/api/auth/[...nextauth]";
import { TRPCError } from "@trpc/server";

const DEV_ERR = "Wrong developer password. (devPass)";

export const adminRouter = trpc.createTRPCRouter({
  create: trpc.devProcedure
    .input(
      z.object({
        user: schema.userFields,
        devPass: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.devPass || input.devPass != process.env.DEV_SECRET) {
        throw new TRPCError({ code: "FORBIDDEN", message: DEV_ERR });
      }
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
  deleteById: trpc.devProcedure
    .input(
      z.object({
        userId: z.string(),
        devPass: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.devPass || input.devPass != process.env.DEV_SECRET) {
        throw new TRPCError({ code: "FORBIDDEN", message: DEV_ERR });
      }
      return await ctx.prisma.admin.delete({
        where: {
          userId: input.userId,
        },
      });
    }),
});
