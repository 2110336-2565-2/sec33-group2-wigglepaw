import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const petSitterRouter = createTRPCRouter({
  
  searchPetSitter: publicProcedure
  .input(z.object({
    searchText: z.string(),
  }))
    .query(({ ctx, input }) => {
      const words = input.searchText.split(" ")
      return ctx.prisma.petSitter.findMany({
        where: {
          AND: [
            ...words.map(word => ({
          OR: [
            { freelancePetSitter: { firstName: { contains: word } } },
            { freelancePetSitter: { lastName: { contains: word } } },
            { freelancePetSitter: { lastName: { contains: word } } },
            { petHotel: { hotelName: { contains: word } } },
          ]
        }))
      ]
        }
      });
    }),

});
