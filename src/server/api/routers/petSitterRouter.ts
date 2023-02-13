import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
} from "../../../schema/schema";

const zodUserFields = z.object({
  verifyStatus: z.boolean(),
  certificationUri: z.string().url(),
});

export const petSitterRouter = createTRPCRouter({
  update: publicProcedure
    .input(z.object({ userId: z.string(), data: petSitterFields }))
    .mutation(async ({ ctx, input }) => {
      const update = await prisma?.petSitter.update({
        where: {
          userId: input.userId,
        },
        data: { ...input.data },
      });
      return update;
    }),
});
