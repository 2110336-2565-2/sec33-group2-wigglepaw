import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { userFields, petOwnerFields} from "../../../schema/schema";


export const petOwnerRouter = createTRPCRouter({
    //public procedure that get petOwner by ID
    getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petOwner.findUnique({
        where: {
          userId: input.id,
        },
      });
    }),
    
    //public procedure that get petOwner by name
    getByFirstName: publicProcedure
    .input(z.object({ firstname: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petOwner.findMany({
        where: {
          firstName: input.firstname,
        },
        include:{
          user: true
        }
      });
    }),

    //public procedure that get petOwner by email
    getByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.petOwner.findFirst({
        where: {
          user: {email:input.email}
        },
      });
    }),

    //update petOwner
    update: publicProcedure
    .input(
      z.object({ 
        userId: z.string(), 
        data: petOwnerFields 
      })
    )
    .mutation(async ({ ctx, input }) => {
      const update = await ctx.prisma.petOwner.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),

    //public procedure that create petOwner
    create: publicProcedure
    .input(
      z.object({
        user: userFields,
        petOwner: petOwnerFields
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.petOwner.create({
        data: {
              user: {
                create: input.user,
              },
              ...input.petOwner,
            },
            include: {
              user: true,
            },
      });
    }),
});