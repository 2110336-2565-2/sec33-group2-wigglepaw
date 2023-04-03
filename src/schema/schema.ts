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
  // accounts: Account
});

export const bankAccountCreateSchema = z.object({
  bankNo: z.number(),
  bankName: z.string(),
  bankCode: z.string(),
});

export const petSitterFields = z.object({
  // user: userFields,
  petTypes: z.array(z.string()),
  verifyStatus: z.boolean(),
  certificationUri: z.string().optional(),
  startPrice: z.number().optional(),
  endPrice: z.number().optional(),
  recipientId: z.string(),
  // location: z.string().default("Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110")
  // location might be duplicated with userFields.address
});

export const petOwnerFields = z.object({
  // user: userFields,
  petTypes: z.array(z.string()),
  firstName: z.string(),
  lastName: z.string(),
  customerId: z.string(),
});

export const petFields = z.object({
  petType: z.string(),
  name: z.string().optional(),
  sex: z.enum(["Male", "Female"]).optional(),
  breed: z.string().optional(),
  weight: z.number().gte(0).optional(),
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
  totalPrice: z.number().gt(0),
  startDate: z.date(),
  endDate: z.date(),
  petIdList: z.array(z.string().cuid()),
  note: z.string().nullable().default(null),
});

export const searchPetSitterField = z.object({
  searchName: z.string().optional(),
  searchRating: z.number().optional(),
  searchPriceMin: z.number().optional(),
  searchPriceMax: z.number().optional(),
  searchLocation: z.string().optional(),
  searchPetTypes: z.array(z.string()).optional(),
  searchVerifyStatus: z.boolean().optional(),
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

const date_from_to = z.object({
  from: z.date().nullable(),
  to: z.date().nullable(),
});

export const searchBookingField = z.object({
  searchBookingIdList: z.array(z.string().cuid()).default([]),
  searchUserIdList: z.array(userId).default([]),
  searchStatusList: z.array(bookingStatus).default([]),
  searchStartDate: date_from_to.optional(),
  searchEndDate: date_from_to.optional(),
  // searchLocation: z.string().default(""),
  searchSortBy: z.string().optional(),
});

export const returnStatus = z.enum(["ERROR", "SUCCESS"]);
export const returnField = z.object({
  status: returnStatus,
  code: z.string().optional(),
  reason: z.string().optional(),
  result: z.string().optional(),
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

export const messageFields = z.object({
  senderId: z.string(),
  chatroomId: z.string().optional().default(""),
  data: z.string(),
  petSitterId: z.string().optional().default(""),
  petOwnerId: z.string().optional().default(""),
});
export const ticketStatus = z.enum([
  ReportTicketStatus.acked,
  ReportTicketStatus.canceled,
  ReportTicketStatus.pending,
  ReportTicketStatus.resolved,
]);

export const reportTicketFields = z.object({
  title: z.string(),
  description: z.string().optional().default(""),
});

export const approvalStatus = z.enum([
  ApprovalRequestStatus.pending,
  ApprovalRequestStatus.declined,
  ApprovalRequestStatus.approved,
]);

export const approvalRequestFields = z.object({
  notes: z.string().optional(),
});
