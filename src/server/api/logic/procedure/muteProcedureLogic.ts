import { PrismaClient } from "@prisma/client";

export abstract class MuteProcedureLogic {
  public static async isUserMuted(
    prisma: PrismaClient,
    byId: string,
    toId: string
  ) {
    const mutedUser = await prisma.mutedUser.findUnique({
      where: {
        id: {
          mutedById: byId,
          mutedUserId: toId,
        },
      },
    });
    return mutedUser !== null;
  }
}
