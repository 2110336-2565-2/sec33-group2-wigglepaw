import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

function searchPetSitterByText(text: string): object{
  const words = text.split(" ")
  return {
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
}

export const petSitterRouter = createTRPCRouter({
  
  searchPetSitter: publicProcedure
  .input(z.object({
    searchText: z.string(),
  }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petSitter.findMany({
        where: searchPetSitterByText(input.searchText)
      });
    }),

});
