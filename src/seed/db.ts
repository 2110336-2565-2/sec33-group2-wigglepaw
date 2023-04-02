import { BookingStatus, ReviewStatus } from "@prisma/client";
import { saltHashPassword } from "../pages/api/auth/[...nextauth]";
import { prisma } from "../server/db";
import {
  createRandomPets,
  getRandomBookingStatus,
  getRandomDatetime,
} from "./util";
import { Return } from "../schema/returnSchema";

export async function updateAvgRating(petSitterId: string) {
  const petSitter = await prisma.petSitter.findFirst({
    where: {
      userId: petSitterId,
    },
    include: {
      review: true,
    },
  });

  const reviews = petSitter?.review;
  const reviewCount = petSitter?.review.length;

  if (!reviews || !reviewCount) {
    const update = await prisma.petSitter.update({
      where: {
        userId: petSitterId,
      },
      data: { avgRating: null, reviewCount: 0 },
    });
    return update;
  }
  let sum = 0;
  for (const review of reviews) {
    sum += review.rating;
  }
  const avg = Math.round((sum / reviews.length) * 100) / 100;

  const update = await prisma.petSitter.update({
    where: {
      userId: petSitterId,
    },
    data: { avgRating: avg, reviewCount: reviewCount },
  });
  return update;
}

export async function makeFree(
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
  const saltHash = saltHashPassword("p" + code);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  return await prisma.freelancePetSitter.create({
    data: {
      petSitter: {
        create: {
          user: {
            create: {
              username: "u" + code,
              email: "e" + code + "@gmail.com",
              password: hash,
              address: address,
              phoneNumber: phone,
              imageUri: imageUri,
              salt: salt,
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

export async function makeHotel(
  code: string,
  hotelName: string,
  phone: string,
  address: string,
  petTypes: string[],
  startPrice: number,
  endPrice: number,
  imageUri: string
) {
  const saltHash = saltHashPassword("p" + code);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  return await prisma.petHotel.create({
    data: {
      petSitter: {
        create: {
          user: {
            create: {
              username: "u" + code,
              email: "e" + code + "@gmail.com",
              password: hash,
              salt: salt,
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

export async function makeOwner(
  code: string,
  firstName: string,
  lastName: string,
  phone: string,
  address: string,
  imageUri: string,
  petTypes: string[]
) {
  const saltHash = saltHashPassword("p" + code);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const owner = await prisma.petOwner.create({
    data: {
      user: {
        create: {
          username: "u" + code,
          email: "e" + code + "@gmail.com",
          password: hash,
          salt: salt,
          address: address,
          phoneNumber: phone,
          imageUri: imageUri,
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
  const ownerId = owner.userId;
  await createRandomPets(1, ownerId);
  return;
}

export async function makeReview(
  petSitterId: string,
  petOwnerId: string,
  status: ReviewStatus,
  rating: number,
  text: string
) {
  const createReview = await prisma.review.create({
    data: {
      petSitterId: petSitterId,
      petOwnerId: petOwnerId,
      status: status,
      rating: rating,
      text: text,
      createdAt: getRandomDatetime(),
    },
  });

  await updateAvgRating(petSitterId);

  return createReview;
}

export async function makePost(
  petSitterId: string,
  title: string,
  text: string,
  pictureUri: string[],
  videoUri: string
) {
  const createPost = await prisma.post.create({
    data: {
      petSitterId: petSitterId,
      title: title,
      text: text,
      pictureUri: pictureUri,
      videoUri: videoUri,
      createdAt: getRandomDatetime(),
    },
  });
  return createPost;
}

export async function makeBooking(
  petOwnerId: string,
  petSitterId: string,
  totalPrice: number,
  startDate: Date,
  endDate: Date,
  note: string,
  petIdList: string[]
) {
  const createBooking = await prisma.booking.create({
    data: {
      petOwnerId: petOwnerId,
      petSitterId: petSitterId,
      totalPrice: totalPrice,
      startDate: startDate,
      endDate: endDate,
      note: note,
      numberOfPets: petIdList.length,
      status: getRandomBookingStatus(),
      pet: {
        connect: petIdList.map((petId) => ({ petId: petId })),
      },
    },
    select: Return.booking,
  });
  return createBooking;
}
