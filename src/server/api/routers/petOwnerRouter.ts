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

    //protected procedure that let the petOwner change his firstname-lastname given {firstname,lastname}
   /* changePetOwnerFirstName: protectedProcedure
    .input(
        z.object({
            firstname: z.string(),
            lastname: z.string()
        })
    )
    .mutation(({ ctx, input }) => {
        return ctx.prisma.owner.update({
            where:{
                userId:
            },
            data:{
                firstname: input.firstname
            }
        })
    }
    
    )*/

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