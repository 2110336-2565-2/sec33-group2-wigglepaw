// search by first name, last name, hotel name
export function searchPetSitterByText(text: string): object {
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
export function searchPetSitterByPriceMin(searchPriceMin: number): object {
  if (searchPriceMin == null) return {};
  return {
    endPrice: {
      gte: searchPriceMin,
    },
  };
}
// only show if petsitter startPrice is less than input price(Max)
// null startPrice will be exclude if searchPriceMax isn't null
export function searchPetSitterByPriceMax(
  searchPriceMax: number | null
): object {
  if (searchPriceMax == null) return {};
  return {
    startPrice: {
      lte: searchPriceMax,
    },
  };
}
// input as "cat dog bird", uncomplete string input like "ca do ird" won't be able to get expected result
export function searchPetSitterByPetTypes(text: string): object {
  if (text == "") return {};
  const petTypes = text.split(" ");
  return {
    petTypes: {
      hasEvery: petTypes,
    },
  };
}
// search by single name "cat", "dog" etc.
export function searchPetSitterByPetTypesSingle(petType: string): object {
  if (petType == "") return {};
  return {
    petTypes: {
      contains: petType,
    },
  };
}
