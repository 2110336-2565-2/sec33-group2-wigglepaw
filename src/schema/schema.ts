import { z } from "zod";
import {
  BookingStatus,
  ReportTicketStatus,
  ApprovalRequestStatus,
} from "@prisma/client";

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

export const bookingFields = z.object({
  petSitterId: z.string().cuid(),
  startDate: z.date().default(new Date("1-1-1")),
  endDate: z.date().default(new Date("1-1-1")),
  petIdList: z.array(z.string().cuid()).default([]),
  note: z.string().nullable().default(null),
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

export const bookingStatus = z.enum([
  BookingStatus.requested,
  BookingStatus.accepted,
  BookingStatus.canceled,
  BookingStatus.rejected,
]);

const userId = z.string().cuid();

export const searchBookingField = z.object({
  searchBookingIdList: z.array(z.string().cuid()).default([]),
  searchUserIdList: z.array(userId).default([]),
  searchStatusList: z.array(bookingStatus).default([]),
  searchStartDate: z.date().optional(),
  searchEndDate: z.date().optional(),
  // searchLocation: z.string().default(""),
  searchSortBy: z.string().optional(),
});

// export const returnStatus = z.enum(["ERROR", "SUCCESS"]);
// export const returnField = z.object({
//   status: returnStatus,
//   code: z.string().nullable().default(null),
//   reason: z.string().nullable().default(null),
//   result: z.string().nullable().default(null),
// });

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

export const ticketStatus = z.enum([
  ReportTicketStatus.acked,
  ReportTicketStatus.canceled,
  ReportTicketStatus.pending,
  ReportTicketStatus.resolved,
]);

export const reportTicketFields = z.object({
  title: z.string(),
  description: z.string().optional(),
});

export const approvalStatus = z.enum([
  ApprovalRequestStatus.pending,
  ApprovalRequestStatus.declined,
  ApprovalRequestStatus.approved,
]);

export const approvalRequestFields = z.object({
  notes: z.string().optional(),
});
