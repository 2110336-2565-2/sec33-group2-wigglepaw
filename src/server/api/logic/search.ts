// import { bookingStatus } from "../../../schema/schema";
import { BookingStatus } from "@prisma/client";

// function makeOptional() {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//       if (args.every(arg=> arg==null)) {
//         return {}
//       } else {
//         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
//         return originalMethod.apply(this, args);
//       }
//     };
//     return descriptor;
//   };
// }

export abstract class BookingSearchLogic {
  public static byBookingId(bookingId: string): object {
    return { bookingId: bookingId };
  }
  public static byBookingIdList(bookingIdList: string[]): object {
    return {
      OR: bookingIdList.map((bookingId) => this.byBookingId(bookingId)),
    };
  }
  public static byUserIdAuto(userId: string): object {
    return {
      OR: [this.byPetOwnerId(userId), this.byPetSitterId(userId)],
    };
  }
  public static byUserId(userId: string, isPetSitter: boolean): object {
    return isPetSitter ? this.byPetSitterId(userId) : this.byPetOwnerId(userId);
  }
  public static byPetOwnerId(petOwnerId: string): object {
    return { petOwnerId: petOwnerId };
  }
  public static byPetSitterId(petSitterId: string): object {
    return { petSitterId: petSitterId };
  }
  public static byStatus(status: BookingStatus): object {
    return { status: status };
  }
  public static byStatusList(statusList: BookingStatus[]): object {
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
      case "date":
        return { startDate: "asc" };
      default:
        return { startDate: "asc" };
    }
  }
}

// search by first name, last name, hotel name
export function searchByName(text: string): object {
  if (text == "") return {};
  const words = text.split(" ");
  return {
    AND: [
      ...words.map((word) => ({
        OR: [
          { freelancePetSitter: { firstName: { contains: word } } },
          { freelancePetSitter: { lastName: { contains: word } } },
          { petHotel: { hotelName: { contains: word } } },
        ],
      })),
    ],
  };
}
// only show if petsitter endPrice is greater than input price(Min)
// null endPrice will be exclude if searchPriceMin isn't null
export function searchByPriceMin(searchPriceMin: number | null): object {
  if (searchPriceMin == null) return {};
  return {
    endPrice: {
      gte: searchPriceMin,
    },
  };
}
// only show if petsitter startPrice is less than input price(Max)
// null startPrice will be exclude if searchPriceMax isn't null
export function searchByPriceMax(searchPriceMax: number | null): object {
  if (searchPriceMax == null) return {};
  return {
    startPrice: {
      lte: searchPriceMax,
    },
  };
}
// input as "cat dog bird", uncomplete string input like "ca do ird" won't be able to get expected result
export function searchByPetTypes(text: string): object {
  if (text == "") return {};
  const petTypes = text.split(" ");
  return {
    petTypes: {
      hasEvery: petTypes,
    },
  };
}
// search by single name "cat", "dog" etc.
export function searchBySinglePetType(petType: string): object {
  if (petType == "") return {};
  return {
    petTypes: {
      has: petType,
    },
  };
}
// search by pet sitter type
export function searchByPetSitterTypes(text: string): object {
  if (text == "") return {};
  const petSitterTypes = text.split(" ");
  return searchByPetSitterType(
    petSitterTypes.includes("hotel"),
    petSitterTypes.includes("freelance")
  );
  const result: object[] = [];
  if (petSitterTypes.includes("hotel"))
    result.push({
      NOT: {
        petHotel: null,
      },
    });
  if (petSitterTypes.includes("freelance"))
    result.push({
      NOT: {
        freelancePetSitter: null,
      },
    });
  return {
    OR: result,
  };
}

// search by pet sitter type
export function searchByPetSitterType(
  includePetHotel: boolean,
  includeFreelancePetSitter: boolean
): object {
  const result: object[] = [];
  if (includePetHotel)
    result.push({
      NOT: {
        petHotel: null,
      },
    });
  if (includeFreelancePetSitter)
    result.push({
      NOT: {
        freelancePetSitter: null,
      },
    });
  return {
    OR: result,
  };
}

export function searchOrderBy(sortName: string): object {
  switch (sortName) {
    case "name": {
      return {
        user: { username: "asc" },
      };
    }
    case "username": {
      return {
        user: { username: "asc" },
      };
    }
    case "price": {
      return {
        startPrice: "asc",
      };
    }
    case "startPrice": {
      return {
        startPrice: "asc",
      };
    }
    case "endPrice": {
      return {
        endPrice: "asc",
      };
    }
    default: {
      console.log(`sortName ${sortName} not support for sorting`);
      return { startPrice: "asc" };
    }
  }
  return {};
}
