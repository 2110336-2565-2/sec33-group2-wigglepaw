import { Chatroom, PrismaClient } from "@prisma/client";

export abstract class BlockProcedureLogic {
  public static async isUserBlocked(
    prisma: PrismaClient,
    byId: string,
    toId: string
  ) {
    const blockedUser = await prisma.blockedUser.findUnique({
      where: {
        id: {
          blockedById: byId,
          blockedUserId: toId,
        },
      },
    });
    return blockedUser !== null;
  }

  public static isAnyBlocked(
    prisma: PrismaClient,
    ids: Array<string>
  ): boolean {
    return ids.some((byId) =>
      ids.some((toId) => this.isUserBlocked(prisma, byId, toId))
    );
  }

  public static isChatRoomBlocked(
    prisma: PrismaClient,
    chatroom: Chatroom
  ): boolean {
    return this.isAnyBlocked(prisma, [
      chatroom.petOwnerId,
      chatroom.petSitterId,
    ]);
  }
}
