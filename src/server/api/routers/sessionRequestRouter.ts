import { TRPCError, initTRPC } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
} from "../../../schema/schema";
import {
  type UserSubType,
  UserType,
  UserProfile,
  UserProfileSubType,
} from "../../../types/user";
import type {
  FreelancePetSitter,
  PetHotel,
  PetOwner,
  PetSitter,
  User,
} from "@prisma/client";

export const sessionRequestRouter = createTRPCRouter({});
