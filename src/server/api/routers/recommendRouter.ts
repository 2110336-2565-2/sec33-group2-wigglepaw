import { TypeOf, z } from "zod";

import { BookingStatus } from "@prisma/client";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { Return } from "../../../schema/returnSchema";
import { BookingSearchLogic } from "../logic/search/booking";

export const recommendRouter = createTRPCRouter({
  // recommend by recent booking
  recommend: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(69),
      })
    )
    .query(async ({ ctx, input }) => {
      let petSitterIdList: string[] = [];
      if (ctx.session.user != null) {
        const userId = ctx.session.user.id;
        const bookings = await ctx.prisma.booking.findMany({
          where: {
            AND: [
              BookingSearchLogic.byUserIdAuto(userId),
              BookingSearchLogic.byStatusList([BookingStatus.accepted]),
            ],
          },
          orderBy: { endDate: "desc" },
          select: { petSitterId: true },
        });
        const bookingPetSitterIdList = bookings.map(
          (booking) => booking.petSitterId
        );
        petSitterIdList = petSitterIdList.concat(bookingPetSitterIdList);
      }
      const petSitterIdListUniqueLength = [...new Set(petSitterIdList)].length;
      if (petSitterIdListUniqueLength < input.limit) {
        const petSitters = await ctx.prisma.petSitter.findMany({
          orderBy: { avgRating: "desc" },
          select: { userId: true },
        });
        const morePetSitterIdList = petSitters.map(
          (petSitter) => petSitter.userId
        );
        petSitterIdList = petSitterIdList.concat(morePetSitterIdList);
      }
      petSitterIdList = [...new Set(petSitterIdList)];
      petSitterIdList = petSitterIdList.slice(0, input.limit);

      return await ctx.prisma.petSitter.findMany({
        where: {
          OR: petSitterIdList.map((petSitterId) => ({ userId: petSitterId })),
        },
        select: Return.petSitter,
      });
    }),
});
