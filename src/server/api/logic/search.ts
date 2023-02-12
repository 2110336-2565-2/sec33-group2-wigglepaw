// search by first name, last name, hotel name
export function searchByName(words: string[]): object {
  if (words === undefined || words.length == 0) return {};
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
// searchByPetTypes isn't used
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
