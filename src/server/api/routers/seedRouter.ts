import { initTRPC } from "@trpc/server";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "../../../env/server.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  freelancePetSitterFields,
  petSitterFields,
  userFields,
} from "../../../schema/schema";
import { Prisma } from "@prisma/client";
import { prisma } from "../../db";

async function makeFree(
  code: string,
  firstname: string,
  lastname: string,
  phone: string,
  address: string,
  petTypes: string[],
  startPrice: number,
  endPrice: number,
  imageUri: string
) {
  return await prisma.freelancePetSitter.create({
    data: {
      petSitter: {
        create: {
          user: {
            create: {
              username: "u" + code,
              email: "email" + code + "@gmail.com",
              password: "p" + code,
              address: address,
              phoneNumber: phone,
              imageUri: imageUri,
            },
          },
          verifyStatus: true,
          certificationUri: "uri" + code,
          petTypes: petTypes,
          startPrice: startPrice,
          endPrice: endPrice,
        },
      },
      firstName: firstname,
      lastName: lastname,
    },
    include: {
      petSitter: {
        include: {
          user: true,
        },
      },
    },
  });
}

async function makeHotel(
  code: string,
  hotelName: string,
  phone: string,
  address: string,
  petTypes: string[],
  startPrice: number,
  endPrice: number,
  imageUri: string
) {
  return await prisma.petHotel.create({
    data: {
      petSitter: {
        create: {
          user: {
            create: {
              username: "u" + code,
              email: "email" + code + "@gmail.com",
              password: "p" + code,
              address: address,
              phoneNumber: phone,
              imageUri: imageUri,
            },
          },
          verifyStatus: true,
          certificationUri: "uri" + code,
          petTypes: petTypes,
          startPrice: startPrice,
          endPrice: endPrice,
        },
      },
      hotelName: hotelName,
    },
    include: {
      petSitter: {
        include: {
          user: true,
        },
      },
    },
  });
}

async function makeOwner(
  code: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  imageUri: string
) {
  return await prisma.petOwner.create({
    data: {
      user: {
        create: {
          username: "u" + code,
          email: "email" + code + "@gmail.com",
          password: "p" + code,
          address: address,
          phoneNumber: phone,
          imageUri: imageUri,
        },
      },
      firstName: firstName,
      lastName: lastName,
    },
    include: {
      user: true,
    },
  });
}

// UTILITY
function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// UTILITY

// INFO
var firstNames: string[] = [
  "Tokino",
  "Kanata",
  "Watame",
  "Roboco",
  "Suisei",
  "Azki",
  "Aki",
  "Akai",
  "Matsuri",
  "Mei",
];
var lastNames: string[] = [
  "Amane",
  "Kiryuu",
  "Sora",
  "Haato",
  "Rosenthal",
  "Sung086",
];
var addresses: string[] = [
  "Home",
  "Bangkok somewhere",
  "USA",
  "OHIO",
  "Chiangmai",
  "Isekai",
  "OtakuRoom",
];
var petTypes: string[] = [
  "Dog",
  "Cat",
  "Goldfish",
  "Panda",
  "Snake",
  "Bat",
  "Lizard",
  "Hamster",
];
// INFO

export const seedRouter = createTRPCRouter({
  seed1: publicProcedure
    .input(
      z.object({
        clearDatabase: z.boolean(),
        numberOfUsers: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.clearDatabase) {
        await prisma.user.deleteMany({});
      }
      for (var i = 0; i < input.numberOfUsers; i++) {
        var firstName = getMultipleRandom(firstNames, 1)[0] ?? "";
        var lastName = getMultipleRandom(lastNames, 1)[0] ?? "";
        var hotelName = firstName + " " + lastName + " Hotel";
        var address = getMultipleRandom(addresses, 1)[0] ?? "";
        var phoneNumber = "1234569780";
        var petType = getMultipleRandom(petTypes, randomIntFromInterval(1, 3));
        var startPrice = randomIntFromInterval(100, 300);
        var endPrice = startPrice + randomIntFromInterval(100, 3000);
        var imageUri = "https://picsum.photos/200";
        switch (randomIntFromInterval(1, 3)) {
          case 1: {
            var code = "Owner" + randomIntFromInterval(100, 999);
            makeOwner(
              code,
              firstName,
              lastName,
              phoneNumber,
              address,
              imageUri
            );
            break;
          }
          case 2: {
            var code = "Free" + randomIntFromInterval(100, 999);
            makeFree(
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
            var code = "Hotel" + randomIntFromInterval(100, 999);
            makeHotel(
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
      return;
    }),
});
