import { z } from "zod";

export const userFields = z.object({
  //userId: z.string().cuid().optional(),
  //   petOwner: petOwnerFields.optional(),
  //   petSitter: petSitterFields.optional(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  imageUri: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  // accounts: Account
});

export const petSitterFields = z.object({
  // user: userFields,
  petTypes: z.array(z.string()),
  verifyStatus: z.boolean(),
  certificationUri: z.string().optional(),
  startPrice: z.number().optional(),
  endPrice: z.number().optional(),
});

export const petOwnerFields = z.object({
  // user: userFields,
  firstName: z.string(),
  lastName: z.string(),
});

export const petHotelFields = z.object({
  // petSitter: petSitterFields,
  businessLicenseUri: z.string().optional(),
  hotelName: z.string(),
});

export const freelancePetSitterFields = z.object({
  //petSitter: petSitterFields,
  firstName: z.string(),
  lastName: z.string(),
});

export const searchField = z.object({
  searchName: z.string().optional(),
  searchRating: z.number().optional(),
  searchPriceMin: z.number().optional(),
  searchPriceMax: z.number().optional(),
  searchLocation: z.string().optional(),
  searchPetTypes: z.array(z.string()).optional(),
  searchStartSchedule: z.string().optional(),
  searchEndSchedule: z.string().optional(),
  searchIncludePetSitterType: z.string().optional(),
  searhcIncludePetHotel: z.boolean().default(true),
  searhcIncludeFreelancePetSitter: z.boolean().default(true),
  searchSortBy: z.string().default(""),
});
