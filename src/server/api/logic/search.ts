// search by first name, last name, hotel name
export function searchByName(text: string): object {
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
          { petHotel: { hotelName: { contains: word, mode: "insensitive" } } },
        ],
      })),
    ],
  };
}
// only show if petsitter endPrice is greater than input price(Min)
// null endPrice will be exclude if searchPriceMin isn't null
export function searchByPriceMin(searchPriceMin: number): object {
  return {
    endPrice: {
      gte: searchPriceMin,
    },
  };
}
// only show if petsitter startPrice is less than input price(Max)
// null startPrice will be exclude if searchPriceMax isn't null
export function searchByPriceMax(searchPriceMax: number): object {
  return {
    startPrice: {
      lte: searchPriceMax,
    },
  };
}
function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
// input as "cat dog bird", uncomplete string input like "ca do ird" won't be able to get expected result
export function searchByPetTypes(petTypes: string[]): object {
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
export function searchBySinglePetType(petType: string): object {
  return {
    petTypes: {
      has: petType,
    },
  };
}
// search by pet sitter type
export function searchByPetSitterTypes(text: string): object {
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
  if (includePetHotel == false && includeFreelancePetSitter == false) return {};
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
}
