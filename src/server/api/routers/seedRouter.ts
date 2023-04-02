import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "../../db";
import {
  firstNames,
  lastNames,
  addresses,
  imageUris,
  petTypes,
  reviewTexts,
  postPictures,
  postTexts,
  postTitles,
  notes,
} from "../../../seed/pool";
import {
  createRandomPets,
  getAllOwnerId,
  getAllPetIds,
  getAllSitterId,
  getMultipleRandom,
  getRandomIntFromInterval,
  getRandomFloatFromInterval,
  getRandomStartEndDate,
  updateOwnerPetTypes,
} from "../../../seed/util";
import {
  makeBooking,
  makeFree,
  makeHotel,
  makeOwner,
  makePost,
  makeReview,
  updateAvgRating,
} from "../../../seed/db";
import Rand, { PRNG } from "rand-seed";
import { resetRand } from "../../../seed/util";
import { TRPCError } from "@trpc/server";

export const seedRouter = createTRPCRouter({
  seedUsers: publicProcedure
    .input(
      z.object({
        clearUsers: z.boolean(),
        numberOfUsers: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.clearUsers) {
        await ctx.prisma.user.deleteMany({});
      }
      resetRand();
      for (let i = 0; i < input.numberOfUsers; i++) {
        const firstName = getMultipleRandom(firstNames, 1)[0] ?? "";
        const lastName = getMultipleRandom(lastNames, 1)[0] ?? "";
        const hotelName = firstName + " " + lastName + " Hotel";
        const address = getMultipleRandom(addresses, 1)[0] ?? "";
        const phoneNumber = "1234569780";
        const petType = getMultipleRandom(
          petTypes,
          getRandomIntFromInterval(1, 3)
        );
        const startPrice = getRandomIntFromInterval(100, 300);
        const endPrice = startPrice + getRandomIntFromInterval(100, 3000);
        const imageUri = getMultipleRandom(imageUris, 1)[0] ?? "";

        switch (getRandomIntFromInterval(1, 3)) {
          case 1: {
            const code =
              "Owner" + getRandomIntFromInterval(100, 999).toString();
            try {
              await makeOwner(
                code,
                firstName,
                lastName,
                phoneNumber,
                address,
                imageUri,
                petType
              );
            } catch (e) {
              console.error("Failed to make owner: ", e);
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                cause: e,
                message: "Failed to make owner",
              });
            }
            break;
          }
          case 2: {
            const code = "Free" + getRandomIntFromInterval(100, 999).toString();
            try {
              await makeFree(
                code,
                firstName,
                lastName,
                phoneNumber,
                address,
                petType,
                startPrice,
                endPrice,
                imageUri
              );
            } catch (e) {
              console.error("Failed to make free: ", e);
              throw e;
            }
            break;
          }
          default: {
            const code =
              "Hotel" + getRandomIntFromInterval(100, 999).toString();
            try {
              await makeHotel(
                code,
                hotelName,
                phoneNumber,
                address,
                petType,
                startPrice,
                endPrice,
                imageUri
              );
            } catch (e) {
              console.error("Failed to make hotel: ", e);
              throw e;
            }
            break;
          }
        }
      }
      return "Seeded Users";
    }),

  seedPets: publicProcedure
    .input(
      z.object({
        clearPets: z.boolean(),
        numberOfPets: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.clearPets) {
        await ctx.prisma.pet.deleteMany({});
      }

      const N = input.numberOfPets;
      const ownerIds = await getAllOwnerId();

      resetRand();
      for (let i = 0; i < N; i++) {
        const ownerId = getMultipleRandom(ownerIds, 1)[0] ?? "";
        //const numPets = getRandomIntFromInterval(1, 4);
        await createRandomPets(1, ownerId);
      }
      return "Seeded Pets";
    }),

  seedReviews: publicProcedure
    .input(
      z.object({
        clearReviews: z.boolean(),
        numberOfReviews: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sitters = await prisma.petSitter.findMany();

      if (input.clearReviews) {
        await ctx.prisma.review.deleteMany({});
        for (const sitter of sitters) {
          await updateAvgRating(sitter.userId);
        }
      }

      const N = input.numberOfReviews;
      const sitterIds = await getAllSitterId();
      const ownerIds = await getAllOwnerId();

      resetRand();
      for (let i = 0; i < N; i++) {
        const sitterId = getMultipleRandom(sitterIds, 1)[0] ?? "";
        const ownerId = getMultipleRandom(ownerIds, 1)[0] ?? "";
        const rating = getRandomIntFromInterval(1, 5);
        const text = getMultipleRandom(reviewTexts, 1)[0] ?? "";

        await makeReview(sitterId, ownerId, rating, text);
      }
      return "Seeded Reviews";
    }),

  seedPosts: publicProcedure
    .input(
      z.object({
        clearPosts: z.boolean(),
        numberOfPosts: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.clearPosts) {
        await ctx.prisma.post.deleteMany({});
      }

      const N = input.numberOfPosts;
      const sitterIds = await getAllSitterId();

      resetRand();
      for (let i = 0; i < N; i++) {
        const sitterId = getMultipleRandom(sitterIds, 1)[0] ?? "";
        const title = getMultipleRandom(postTitles, 1)[0] ?? "";
        const text = getMultipleRandom(postTexts, 1)[0] ?? "";
        const pics = getRandomIntFromInterval(0, 4);
        const pictureUri = getMultipleRandom(postPictures, pics) ?? [];

        await makePost(sitterId, title, text, pictureUri, "vdoUri");
      }
      return "Seeded Posts";
    }),

  seedBookings: publicProcedure
    .input(
      z.object({
        clearBookings: z.boolean(),
        numberOfBookings: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.clearBookings) {
        await ctx.prisma.booking.deleteMany({});
      }

      const N = input.numberOfBookings;
      const sitterIds = await getAllSitterId();
      const ownerIds = await getAllOwnerId();

      resetRand();
      for (let i = 0; i < N; i++) {
        const ownerId = getMultipleRandom(ownerIds, 1)[0] ?? "";
        const sitterId = getMultipleRandom(sitterIds, 1)[0] ?? "";
        const dates = getRandomStartEndDate();
        const totalPrice = getRandomFloatFromInterval(500, 10000);
        const startDate = dates["startDate"];
        const endDate = dates["endDate"];
        const note = getMultipleRandom(notes, 1)[0] ?? "";
        const allPetIds = await getAllPetIds(ownerId);
        const numPets = getRandomIntFromInterval(1, allPetIds.length);
        const petIds = getMultipleRandom(allPetIds, numPets);

        await makeBooking(
          ownerId,
          sitterId,
          totalPrice,
          startDate,
          endDate,
          note,
          petIds
        );
      }
      return "Seeded Bookings";
    }),
});
