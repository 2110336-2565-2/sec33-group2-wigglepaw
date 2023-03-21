import { BookingStatus } from "@prisma/client";

type userIdType = string;
function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export abstract class petSitterSearchLogic {
  // search by first name, last name, hotel name
  public static petSitterName(text: string): object {
    const words = text.split(" ");
    return {
      AND: [
        ...words.map((word) => ({
          OR: [
            {
              freelancePetSitter: {
                firstName: { contains: word, mode: "insensitive" },
              },
            },
            {
              freelancePetSitter: {
                lastName: { contains: word, mode: "insensitive" },
              },
            },
            {
              petHotel: { hotelName: { contains: word, mode: "insensitive" } },
            },
          ],
        })),
      ],
    };
  }
  // only show if petsitter endPrice is greater than input price(Min)
  // null endPrice will be exclude if searchPriceMin isn't null
  public static priceMin(searchPriceMin: number): object {
    return {
      endPrice: {
        gte: searchPriceMin,
      },
    };
  }
  // only show if petsitter startPrice is less than input price(Max)
  // null startPrice will be exclude if searchPriceMax isn't null
  public static priceMax(searchPriceMax: number): object {
    return {
      startPrice: {
        lte: searchPriceMax,
      },
    };
  }
  // input as "cat dog bird", uncomplete string input like "ca do ird" won't be able to get expected result
  public static petTypes(petTypes: string[]): object {
    const conditions = petTypes.map((petType) => {
      const petTypeLowerCase = petType.toLowerCase();
      const petTypeLowerCaseWithFirstUpperCase =
        capitalizeFirstLetter(petTypeLowerCase);
      return {
        OR: [
          {
            petTypes: { has: petTypeLowerCase },
          },
          {
            petTypes: { has: petTypeLowerCaseWithFirstUpperCase },
          },
        ],
      };
    });
    return {
      AND: conditions,
    };
  }
  // search by single name "cat", "dog" etc.
  public static singlePetType(petType: string): object {
    return {
      petTypes: {
        has: petType,
      },
    };
  }
  // search by verify status
  public static verifyStatus(verifyStatus: boolean): object {
    return { verifyStatus: verifyStatus };
  }
  // search by pet sitter type
  public static petSitterTypes(text: string): object {
    const petSitterTypes = text.split(" ");
    return this.petSitterType(
      petSitterTypes.includes("hotel"),
      petSitterTypes.includes("freelance")
    );
  }

  // search by pet sitter type
  public static petSitterType(
    includePetHotel: boolean,
    includeFreelancePetSitter: boolean
  ): object {
    if (includePetHotel == false && includeFreelancePetSitter == false)
      return {};
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

  public static sortBy(sortName: string): object {
    switch (sortName) {
      default:
        console.log(`sortName ${sortName} not support for sorting`);
      case "avgRating":
      case "rating":
        return { avgRating: "desc" };
      case "reviewCount":
        return { reviewCount: "desc" };
      case "price":
      case "startPrice":
        return {
          startPrice: "asc",
        };
      case "endPrice":
        return {
          endPrice: "asc",
        };
      case "name":
      case "username":
        return {
          user: { username: "asc" },
        };
    }
  }
}
