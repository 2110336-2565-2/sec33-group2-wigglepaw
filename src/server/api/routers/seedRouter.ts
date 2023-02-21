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

async function updateAvgRating(petSitterId: string) {
  const petSitter = await prisma.petSitter.findFirst({
    where: {
      userId: petSitterId,
    },
    include: {
      review: true,
    },
  });
  const reviews = petSitter?.review;
  if (!reviews) return;

  let sum = 0;
  for (const review of reviews) {
    sum += review.rating;
  }
  const avg = sum / reviews.length;

  const update = await prisma.petSitter.update({
    where: {
      userId: petSitterId,
    },
    data: { avgRating: avg },
  });
  return update;
}

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
              createdAt: new Date(),
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
              createdAt: new Date(),
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
  imageUri: string,
  petTypes: string[]
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
          createdAt: new Date(),
        },
      },

      petTypes: petTypes,
      firstName: firstName,
      lastName: lastName,
    },
    include: {
      user: true,
    },
  });
}

async function makeReview(
  petSitterId: string,
  petOwnerId: string,
  rating: number,
  text: string
) {
  const createReview = await prisma.review.create({
    data: {
      petSitterId: petSitterId,
      petOwnerId: petOwnerId,
      rating: rating,
      text: text,
      createdAt: new Date(),
    },
  });
  const reviewId = createReview.reviewId;

  await prisma.petOwner.update({
    where: {
      userId: petOwnerId,
    },
    data: {
      review: {
        connect: {
          reviewId: reviewId,
        },
      },
    },
  });

  await prisma.petSitter.update({
    where: {
      userId: petSitterId,
    },
    data: {
      review: {
        connect: {
          reviewId: reviewId,
        },
      },
    },
  });

  await updateAvgRating(petSitterId);
  return createReview;
}

async function makePost(
  petSitterId: string,
  text: string,
  pictureUri: string,
  videoUri: string
) {
  const createPost = await prisma.post.create({
    data: {
      petSitterId: petSitterId,
      text: text,
      pictureUri: pictureUri,
      videoUri: videoUri,
      createdAt: new Date(),
    },
  });
  return createPost;
}

function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function getRandomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const firstNames: string[] = [
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
const lastNames: string[] = [
  "Amane",
  "Kiryuu",
  "Sora",
  "Haato",
  "Rosenthal",
  "Sung086",
];
const addresses: string[] = [
  "Home",
  "Bangkok somewhere",
  "USA",
  "OHIO",
  "Chiangmai",
  "Isekai",
  "OtakuRoom",
];
const petTypes: string[] = [
  "Dog",
  "Cat",
  "Goldfish",
  "Panda",
  "Snake",
  "Bat",
  "Lizard",
  "Hamster",
];

const imageUris: string[] = [
  "https://i.ppy.sh/547c489981845883d37a525d50d892d8c3d490e0/68747470733a2f2f692e696d6775722e636f6d2f5430586455414e2e6a7067",
  "https://p4.wallpaperbetter.com/wallpaper/771/366/387/anime-anime-girls-hololive-kiryu-coco-redhead-hd-wallpaper-preview.jpg",
  "https://img-9gag-fun.9cache.com/photo/aZrDB5Q_460s.jpg",
  "https://preview.redd.it/8p4t0a95ax161.jpg?auto=webp&s=9c9db601dfdf217647380cbffe44d7eaf0efa47b",
  "https://gamerbraves.sgp1.cdn.digitaloceanspaces.com/2022/02/Rushia_FI2.jpg",
  "https://hololive.hololivepro.com/wp-content/uploads/2022/06/%E5%8D%9A%E8%A1%A3%E3%81%93%E3%82%88%E3%82%8A_WAO_jk-1.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGYXihhLktMheIVxxgkU3ouhnXf9F9wbxlhQ&usqp=CAU",
  "https://cdn.donmai.us/original/98/83/98834cd37301a94a6a524d94f1ff5a88.jpg",
  "https://static.wikia.nocookie.net/omniversal-battlefield/images/b/bd/Council.jpg/revision/latest?cb=20220420023638",
  "https://picsum.photos/200",
];

const reviewTexts: string[] = [
  "My dog said it was great.",
  "good... I guess?",
  "dog shit",
  "Pretty nice",
  "Skibidi pop pop pop pop ye ye ye ye",
];

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
      if (input.clearReviews) {
        await ctx.prisma.review.deleteMany({});
      }

      const sitters = await prisma.petSitter.findMany();
      const owners = await prisma.petOwner.findMany();

      const sitterIds = new Array<string>(input.numberOfReviews);
      const ownerIds = new Array<string>(input.numberOfReviews);

      for (
        let i = 0;
        i < Math.min(input.numberOfReviews, sitters.length);
        i++
      ) {
        sitterIds[i] = sitters[i]?.userId ?? "";
        ownerIds[i] = owners[i]?.userId ?? "";
      }

      for (let i = 0; i < input.numberOfReviews; i++) {
        const sitterId = getMultipleRandom(sitterIds, 1)[0] ?? "";
        const ownerId = getMultipleRandom(ownerIds, 1)[0] ?? "";
        const rating = getRandomIntFromInterval(1, 5);
        const text = getMultipleRandom(reviewTexts, 1)[0] ?? "";

        await makeReview(sitterId, ownerId, rating, text);
      }
    }),
});
