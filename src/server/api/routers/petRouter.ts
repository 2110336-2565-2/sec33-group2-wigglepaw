import { PetKind } from "@prisma/client";
import { z } from "zod";
import { api } from "../../../utils/api";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const petRouter = createTRPCRouter({
  // public procedure that fetch all owner
  getAllOwner: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.owner.findMany();
  }),

  // A public procedure that fetch all pets
  getAllPet: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.pet.findMany({
      include: {
        owner: true,
      },
    });
  }),

  // public procdure that fetch a pet by id
  getPetById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pet.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  // public procedure that fetch a pet by name
  getPetByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.pet.findMany({
        where: {
          name: input.name,
        },
      });
    }),

  // public procedure that add new pet, given {name: string, kind: PetKind}
  addPet: publicProcedure
    .input(
      z.object({
        name: z.string(),
        kind: z.nativeEnum(PetKind),
        ownerId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.pet.create({
        data: {
          name: input.name,
          kind: input.kind,
          owner: {
            connectOrCreate: {
              where: { id: input.ownerId },
              create: {
                id: input.ownerId,
                name: `Name ${input.ownerId}`,
                email: `Email ${input.ownerId}`,
              },
            },
          },
        },
      });
    }),
});
