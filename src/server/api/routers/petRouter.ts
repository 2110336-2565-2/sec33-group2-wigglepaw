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
  getMyPetList: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    const result = ctx.prisma.pet.findMany({
      where: { petOwnerId: userId },
    });
    return result;
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pet.findUnique({
        where: {
          petId: input.id,
        },
        include: {
          petOwner: true,
        },
      });
    }),

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
          createdAt: new Date(),
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
      return createPet;
    }),

  delete: publicProcedure
    .input(
      z.object({
        petId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const pet = await ctx.prisma.pet.findFirst({
        where: {
          petId: input.petId,
        },
      });
      if (!pet) return "ERROR";
      const del = await ctx.prisma.pet.delete({
        where: {
          petId: input.petId,
        },
      });
      await updatePetTypes(pet.petOwnerId);
      return del;
    }),

  update: publicProcedure
    .input(
      z.object({
        petId: z.string(),
        data: petFields.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.pet.update({
        where: {
          petId: input.petId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
