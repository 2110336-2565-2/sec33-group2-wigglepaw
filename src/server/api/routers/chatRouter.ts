/* eslint-disable @typescript-eslint/no-misused-promises */
import { z } from "zod";
import { api } from "../../../utils/api";

import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";

import { messageFields } from "../../../schema/schema";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { ChatRoomProcedureLogic } from "../logic/procedure/chatProcedureLogic";

import { BlockProcedureLogic } from "../logic/procedure/blockProcedureLogic";

export const chatRouter = createTRPCRouter({
  createMessage: publicProcedure
    .input(messageFields)
    .mutation(async ({ ctx, input }) => {
      const chatroom = await ChatRoomProcedureLogic.getById(
        ctx.prisma,
        input.chatroomId
      );
      if (
        chatroom === null ||
        (await BlockProcedureLogic.isChatRoomBlocked(ctx.prisma, chatroom))
      )
        return null;
      const newmessage = await ctx.prisma.message.create({
        data: {
          senderId: input.senderId,
          chatroomId: input.chatroomId,
          data: input.data,
        },
      });
      return newmessage;
    }),

  checkChatroomid: publicProcedure
    .input(z.object({ petSitterid: z.string(), petOwnerid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.petSitterid && input.petOwnerid) {
        const found = await ctx.prisma.chatroom.findFirst({
          where: {
            OR: [
              {
                user1Id: input.petOwnerid,
                user2Id: input.petSitterid,
              },
              {
                user1Id: input.petSitterid,
                user2Id: input.petOwnerid,
              },
            ],
          },
        });
        if (found) {
          return found.chatroomId;
        } else {
          const newone = await ctx.prisma.chatroom.create({
            data: {
              user1Id: input.petOwnerid,
              user2Id: input.petSitterid,
            },
          });
          return newone.chatroomId;
        }
      } else {
        return "";
      }
    }),

  getAllChatroom: publicProcedure
    .input(
      z.object({
        finderid: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let Result = [];
      const chatroomlist = await ctx.prisma.chatroom.findMany({
        where: {
          OR: [
            {
              user2Id: input.finderid,
            },
            {
              user1Id: input.finderid,
            },
          ],
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const promises = chatroomlist.map(async (element) => {
        let whoU = true;
        let usernamela;
        if (input.finderid === element.user1Id) {
          usernamela = await ctx.prisma.user.findFirst({
            where: {
              userId: element.user2Id,
            },
          });
        } else {
          whoU = false;
          usernamela = await ctx.prisma.user.findFirst({
            where: {
              userId: element.user1Id,
            },
          });
        }
        let firstmsg;
        const firstmsg1 = await ctx.prisma.message.findMany({
          where: {
            chatroomId: element.chatroomId,
          },
          orderBy: {
            messageId: "desc",
          },
          take: 1,
        });

        const unread = await ctx.prisma.message.findMany({
          where: {
            chatroomId: element.chatroomId,
            senderId: whoU ? element.user2Id : element.user1Id,
            read: false,
          },
        });

        if (firstmsg1) {
          firstmsg = firstmsg1;
        } else {
          firstmsg = [{ data: "" }];
        }

        const smallresult = {
          chatroomId: element.chatroomId,
          petSitterId: element.user1Id,
          petOwnerId: element.user2Id,
          firstmsg: firstmsg[0],
          username: usernamela?.username,
          imageuri:
            usernamela?.imageUri === null
              ? "/dogpaw1.png"
              : usernamela?.imageUri,
          unread: unread.length,
        };
        return smallresult;
      });

      const results = await Promise.all(promises);
      return results;
    }),

  getAllChatMessage: publicProcedure
    .input(z.object({ chatroomid: z.string(), otheruser: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.message.updateMany({
        where: {
          chatroomId: input.chatroomid,
          senderId: input.otheruser,
          read: false,
        },
        data: {
          read: true,
        },
      });

      const allinfo = await ctx.prisma.message.findMany({
        where: {
          chatroomId: input.chatroomid,
        },
        select: {
          data: true,
          sender: true,
          createdAt: true,
          read: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return allinfo;
    }),

  // updateRead: publicProcedure
  // .input(z.object({chatroomid:z.string(),messsageid:z.string()}))
  // .mutation(async ({ctx,input})=>{
  //   await ctx.prisma.message.update({
  //     where:{
  //       messageId:input.messsageid,
  //       chatroomId:input.chatroomid,
  //       read: false
  //     },
  //     data:{
  //       read:true
  //     }
  //   })
  // })
});
