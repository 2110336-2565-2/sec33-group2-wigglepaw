import { PrismaClient } from "@prisma/client";

export abstract class ChatRoomProcedureLogic {
  public static async getById(prisma: PrismaClient, id: string) {
    return await prisma.chatroom.findUnique({
      where: {
        chatroomId: id,
      },
    });
  }
}
