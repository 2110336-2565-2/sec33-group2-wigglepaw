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

const zodPetHotelFields = z.object({
  businessLicenseUri: z.string().url(),
  hotelName: z.string(),
});

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
      return await ctx.prisma.petHotel.create({
        data: {
          petSitter: {
            create: {
              user: {
                create: input.user,
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
    }),
});
