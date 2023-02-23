import {
  userFields,
  freelancePetSitterFields,
  petSitterFields,
} from "./../../../schema/schema";
import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { saltHashPassword } from "../../../pages/api/auth/[...nextauth]";

export const freelancePetSitterRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        user: userFields,
        petSitter: petSitterFields,
        freelancePetSitter: freelancePetSitterFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = input.user;
      const saltHash = saltHashPassword(user.password);
      const salt = saltHash.salt;
      const hash = saltHash.hash;
      user.password = hash;
      await ctx.prisma.freelancePetSitter.create({
        data: {
          petSitter: {
            create: {
              user: {
                create: {
                  ...input.user,
                  salt: salt,
                },
              },
              ...input.petSitter,
            },
          },
          ...input.freelancePetSitter,
        },
        include: {
          petSitter: {
            include: {
              user: true,
            },
          },
        },
      });
      return;
    }),

  createDummy: publicProcedure
    .input(
      z.object({
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const code = input.code;
      const saltHash = saltHashPassword("password");
      const salt = saltHash.salt;
      const hash = saltHash.hash;
      return await ctx.prisma.freelancePetSitter.create({
        data: {
          petSitter: {
            create: {
              user: {
                create: {
                  username: "username" + code,
                  email: "email" + code + "@gmail.com",
                  password: hash,
                  salt: salt,
                },
              },
              verifyStatus: true,
              certificationUri: "uri" + code,
            },
          },
          firstName: "firstname" + code,
          lastName: "lastname" + code,
        },
        include: {
          petSitter: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [user, sitter, freelancer] = await ctx.prisma.$transaction([
        ctx.prisma.user.findFirst({
          where: {
            userId: input.userId,
          },
        }),
        ctx.prisma.petSitter.findFirst({
          where: {
            userId: input.userId,
          },
        }),
        ctx.prisma.freelancePetSitter.findFirst({
          where: {
            userId: input.userId,
          },
        }),
      ]);
      const ans = { ...freelancer, petSitter: { ...sitter, user: user } };
      return freelancer == null ? null : ans;
    }),

  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });
      const userId = user?.userId;
      const sitter = await ctx.prisma.petSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const freelancer = await ctx.prisma.freelancePetSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const ans = { ...freelancer, petSitter: { ...sitter, user: user } };
      return freelancer == null ? null : ans;
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: input.email,
        },
      });
      const userId = user?.userId;
      const sitter = await ctx.prisma.petSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const freelancer = await ctx.prisma.freelancePetSitter.findFirst({
        where: {
          userId: userId,
        },
      });
      const ans = { ...freelancer, petSitter: { ...sitter, user: user } };
      return freelancer == null ? null : ans;
    }),

  update: publicProcedure
    .input(
      z.object({ userId: z.string(), data: freelancePetSitterFields.partial() })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await prisma?.freelancePetSitter.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
