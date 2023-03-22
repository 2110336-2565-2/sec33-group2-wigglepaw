import { BookingStatus } from "@prisma/client";

type userIdType = string;
export abstract class BookingSearchLogic {
  public static byBookingId(bookingId: string): object {
    return { bookingId: bookingId };
  }
  public static byBookingIdList(bookingIdList: string[]): object {
    if (bookingIdList.length == 0) return {};
    return {
      OR: bookingIdList.map((bookingId) => this.byBookingId(bookingId)),
    };
  }
  public static byUserIdListAuto(userIdList: userIdType[]): object {
    if (userIdList.length == 0) return {};
    return {
      OR: userIdList.map((userId) => this.byUserIdAuto(userId)),
    };
  }
  public static byUserIdAuto(userId: userIdType): object {
    return {
      OR: [this.byPetOwnerId(userId), this.byPetSitterId(userId)],
    };
  }
  public static byUserId(userId: userIdType, isPetSitter: boolean): object {
    return isPetSitter ? this.byPetSitterId(userId) : this.byPetOwnerId(userId);
  }
  public static byPetOwnerId(petOwnerId: userIdType): object {
    return { petOwnerId: petOwnerId };
  }
  public static byPetSitterId(petSitterId: userIdType): object {
    return { petSitterId: petSitterId };
  }
  public static byStatus(status: BookingStatus): object {
    return { status: status };
  }
  public static byStatusList(statusList: BookingStatus[]): object {
    if (statusList.length == 0) return {};
    return { OR: statusList.map((status) => this.byStatus(status)) };
  }
  public static byStartDate(startDate: Date): object {
    return {
      // startDate: {
      endDate: {
        gte: startDate,
      },
    };
  }
  public static byEndDate(endDate: Date): object {
    return {
      // endDate: {
      startDate: {
        lte: endDate,
      },
    };
  }

  public static sortBy(sortName: string | undefined): object {
    switch (sortName) {
      default:
      case "startDate":
        return { startDate: "asc" };
      case "createdDate": //mean createdDate and createdAt will return same data
      case "createdAt":
        return { createdAt: "asc" };
    }
  }
}
