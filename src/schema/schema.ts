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
  // location: z.string().default("Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110")
  // location might be duplicated with userFields.address
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
  searchName: z.string().optional(),
  searchRating: z.number().optional(),
  searchPriceMin: z.number().optional(),
  searchPriceMax: z.number().optional(),
  searchLocation: z.string().optional(),
  searchPetTypes: z.array(z.string()).optional(),
  searchStartSchedule: z.string().optional(),
  searchEndSchedule: z.string().optional(),
  searchIncludePetSitterType: z.string().optional(),
  searchIncludePetHotel: z.boolean().default(true),
  searchIncludeFreelancePetSitter: z.boolean().default(true),
  searchSortBy: z.string().default(""),
  limit: z.number(),
  cursor: z.string().nullish(),
  skip: z.number().optional(),
  userId: z.string().optional(),
});

export const reviewFields = z.object({
  rating: z.number().gte(1).lte(5),
  text: z.string().optional(),
});

export const postFields = z.object({
  title: z.string(),
  text: z.string().optional(),
  pictureUri: z.array(z.string()),
  videoUri: z.string().optional(),
});

export const sessionRequestFields = z.object({
  text: z.string().optional(),
});
