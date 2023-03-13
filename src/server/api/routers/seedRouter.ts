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
} from "../../../seed/pool";
import {
  getAllOwnerId,
  getAllSitterId,
  getMultipleRandom,
  getRandomIntFromInterval,
  getRandomStartEndDate,
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
            await makeOwner(
              code,
              firstName,
              lastName,
              phoneNumber,
              address,
              imageUri,
              petType
            );
            break;
          }
          case 2: {
            const code = "Free" + getRandomIntFromInterval(100, 999).toString();
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
            break;
          }
          default: {
            const code =
              "Hotel" + getRandomIntFromInterval(100, 999).toString();
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
            break;
          }
        }
      }
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

      resetRand();
      for (let i = 0; i < N; i++) {
        const ownerId = getMultipleRandom(ownerIds, 1)[0] ?? "";
        const sitterId = getMultipleRandom(sitterIds, 1)[0] ?? "";
        const dates = getRandomStartEndDate();
        const startDate = dates["startDate"];
        const endDate = dates["endDate"];
        const title = getMultipleRandom(postTitles, 1)[0] ?? "";
        const text = getMultipleRandom(postTexts, 1)[0] ?? "";
        const pics = getRandomIntFromInterval(0, 4);
        const pictureUri = getMultipleRandom(postPictures, pics) ?? [];

        await makeBooking(sitterId, title, text, pictureUri, "vdoUri");
      }
    }),
});
