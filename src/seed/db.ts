import { prisma } from "../server/db";

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

export async function makeOwner(
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

export async function makeReview(
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

export async function makePost(
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
