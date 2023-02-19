import { z } from "zod";
import { api } from "../../../utils/api";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { petFields } from "../../../schema/schema";
import { prisma } from "../../db";

async function updatePetTypes(petOwnerId: string) {
  const petOwner = await prisma.petOwner.findFirst({
    where: {
      userId: petOwnerId,
    },
    include: {
      pet: true, // Return all fields
    },
  });
  if (!petOwner) return "petOwnerId doens't exist";

  const pets = petOwner?.pet;
  if (!pets) return "Internal server error SHIT";

  const petTypes = new Set<string>();
  for (const pet of pets) {
    petTypes.add(pet.petType);
  }

  const update = await prisma.petOwner.update({
    where: {
      userId: petOwnerId,
    },
    data: {
      petTypes: Array.from(petTypes.values()),
    },
  });

  return;
}

export const petRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        petOwnerId: z.string().cuid(),
        pet: petFields,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const createPet = await ctx.prisma.pet.create({
        data: {
          ...input.pet,
          petOwnerId: input.petOwnerId,
        },
      });

      const petId = createPet.petId;

      const connectOwner = await ctx.prisma.petOwner.update({
        where: {
          userId: input.petOwnerId,
        },
        data: {
          pet: {
            connect: {
              petId: petId,
            },
          },
        },
      });
      await updatePetTypes(input.petOwnerId);
      return;
    }),

  // delete: publicProcedure
  //   .input(
  //     z.object({
  //       petOwnerId: z.string().cuid(),
  //       pet: petFields,
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {

  //   }),
});
