import { z } from "zod";
import { api } from "../../../utils/api";

import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";

import { messageFields } from "../../../schema/schema";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  createMessage: publicProcedure
    .input(messageFields)
    .mutation(async ({ ctx, input }) => {
      let newchatroomid = "";

      if (input.chatroomId === "") {
        //do not have chatroomid yet, have to initialize a new one
        const newone = await ctx.prisma.chatroom.create({
          data: {
            petOwnerId: input.petOwnerId,
            petSitterId: input.petSitterId,
          },
        });
        newchatroomid = newone.chatroomId;
      } else {
        newchatroomid = input.chatroomId;
      }

      const newmessage = await ctx.prisma.message.create({
        data: {
          senderId: input.senderId,
          chatroomId: newchatroomid,
          data: input.data,
        },
      });
      return newmessage;
    }),

  checkChatroomid: publicProcedure
    .input(z.object({ petSitterid: z.string(), petOwnerid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const found = await ctx.prisma.chatroom.findFirst({
        where: {
          petOwnerId: input.petOwnerid,
          petSitterId: input.petSitterid,
        },
      });
      if (found) {
        return found.chatroomId;
      } else {
        return "";
      }
    }),

  getAllChatroom: publicProcedure
    .input(
      z.object({
        petSitterid: z.string().optional(),
        petOwnerid: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (input.petSitterid) {
        const chatroomlist = await ctx.prisma.chatroom.findMany({
          where: {
            petSitterId: input.petSitterid,
          },
        });
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        chatroomlist.forEach(async (element) => {
          const usernamela = await ctx.prisma.user.findFirst({
            where: {
              userId: element.petOwnerId,
            },
          });

          element.username = usernamela?.username;
        });

        return chatroomlist;
      } else {
        return await ctx.prisma.chatroom.findMany({
          where: {
            petOwnerId: input.petOwnerid,
          },
        });
      }
    }),

  getAllChatMessage: publicProcedure
    .input(z.object({ chatroomid: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.findMany({
        where: {
          chatroomId: input.chatroomid,
        },
      });
    }),
});
