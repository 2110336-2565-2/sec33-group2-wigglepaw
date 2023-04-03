import { Chatroom, PrismaClient } from "@prisma/client";

export abstract class BlockProcedureLogic {
  public static async getBlockFromUserId(
    prisma: PrismaClient,
    byId: string,
    toId: string
  ) {
    return await prisma.blockedUser.findUnique({
      where: {
        id: {
          blockedById: byId,
          blockedUserId: toId,
        },
      },
    });
  }
  public static async isUserBlocked(
    prisma: PrismaClient,
    byId: string,
    toId: string
  ) {
    const blockedUser = await this.getBlockFromUserId(prisma, byId, toId);
    return blockedUser !== null;
  }

  public static async isAnyBlocked(prisma: PrismaClient, ids: Array<string>) {
    for (const byId of ids) {
      for (const toId of ids) {
        if (await this.isUserBlocked(prisma, byId, toId))
          return [byId, toId, await this.isUserBlocked(prisma, byId, toId)];
      }
    }
    return false;
  }

  public static async isChatRoomBlocked(
    prisma: PrismaClient,
    chatroom: Chatroom
  ) {
    return await this.isAnyBlocked(prisma, [
      chatroom.petOwnerId,
      chatroom.petSitterId,
    ]);
  }
}
