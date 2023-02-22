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
  petTypes: z.array(z.string()),
  firstName: z.string(),
  lastName: z.string(),
});

export const petFields = z.object({
  petType: z.string(),
  name: z.string().optional(),
  sex: z.enum(["Male", "Female"]).optional(),
  breed: z.string().optional(),
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
  searchName: z.string().default(""),
  searchRating: z.number().nullable().default(null),
  searchPriceMin: z.number().nullable().default(null),
  searchPriceMax: z.number().nullable().default(null),
  searchLocation: z.string().default(""),
  searchPetType: z.string().default(""),
  searchStartSchedule: z.string().default(""),
  searchEndSchedule: z.string().default(""),
  searchIncludePetSitterType: z.string().default(""),
  searchSortBy: z.string().default(""),
});

export const reviewFields = z.object({
  rating: z.number().gte(1).lte(5),
  text: z.string().optional(),
});

export const postFields = z.object({
  text: z.string(),
  pictureUri: z.array(z.string()),
  videoUri: z.string().optional(),
});

export const sessionRequestFields = z.object({
  text: z.string().optional(),
});
