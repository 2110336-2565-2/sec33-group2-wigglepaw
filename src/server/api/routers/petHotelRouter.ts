import {
  userFields,
  freelancePetSitterFields,
  petSitterFields,
  petHotelFields,
} from "./../../../schema/schema";
import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { saltHashPassword } from "../../../pages/api/auth/[...nextauth]";

export const petHotelRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        user: userFields,
        petSitter: petSitterFields,
        petHotel: petHotelFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = input.user;
      const saltHash = saltHashPassword(user.password);
      const salt = saltHash.salt;
      const hash = saltHash.hash;
      user.password = hash;
      await ctx.prisma.petHotel.create({
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
          ...input.petHotel,
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
      return await ctx.prisma.petHotel.create({
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
          businessLicenseUri: "uri" + code,
          hotelName: "hotelName" + code,
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
      const [user, sitter, petHotel] = await ctx.prisma.$transaction([
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
        ctx.prisma.petHotel.findFirst({
          where: {
            userId: input.userId,
          },
        }),
      ]);
      const ans = { ...petHotel, petSitter: { ...sitter, user: user } };
      return petHotel == null ? null : ans;
    }),
  getByUsernameSortby: publicProcedure
    .input(z.object({ username: z.string(), sortby: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("gg:   ", input);

      //PAI JOBS
      const user = await ctx.prisma.user.findFirst({
        where: {
          username: input.username,
        },
      });
      const userId = user?.userId;
      const sitter = await ctx.prisma.petSitter.findMany({
        where: {
          userId: userId,
        },
      });
      const petHotel = await ctx.prisma.petHotel.findMany({
        where: {
          userId: userId,
        },
      });
      const ans = { ...petHotel, petSitter: { ...sitter, user: user } };
      return petHotel == null ? null : ans;
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
      const petHotel = await ctx.prisma.petHotel.findFirst({
        where: {
          userId: userId,
        },
      });
      const ans = { ...petHotel, petSitter: { ...sitter, user: user } };
      return petHotel == null ? null : ans;
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
      const petHotel = await ctx.prisma.petHotel.findFirst({
        where: {
          userId: userId,
        },
      });
      const ans = { ...petHotel, petSitter: { ...sitter, user: user } };
      return petHotel == null ? null : ans;
    }),

  update: publicProcedure
    .input(z.object({ userId: z.string(), data: petHotelFields.partial() }))
    .mutation(async ({ ctx, input }) => {
      const update = await prisma?.petHotel.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
