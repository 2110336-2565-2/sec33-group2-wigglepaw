import { api } from "./../src/utils/api";
import { prisma } from "../src/server/db";

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

function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function getRandomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function main() {
  // EDIT HERE **********************************************

  await prisma.user.deleteMany({});
  const dataCount = 5;

  // EDIT HERE **********************************************
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
  for (let i = 0; i < dataCount; i++) {
    const firstName = getMultipleRandom(firstNames, 1)[0] ?? "";
    const lastName = getMultipleRandom(lastNames, 1)[0] ?? "";
    const hotelName = firstName + " " + lastName + " Hotel";
    const address = getMultipleRandom(addresses, 1)[0] ?? "";
    const phoneNumber = "1234569780";
    const petType = getMultipleRandom(petTypes, getRandomIntFromInterval(1, 3));
    const startPrice = getRandomIntFromInterval(100, 300);
    const endPrice = startPrice + getRandomIntFromInterval(100, 3000);
    const imageUri = "https://picsum.photos/200";

    await new Promise((r) => setTimeout(r, 1000));

    switch (getRandomIntFromInterval(1, 3)) {
      case 1: {
        const code = "Owner" + getRandomIntFromInterval(100, 999).toString();
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
        const code = "Hotel" + getRandomIntFromInterval(100, 999).toString();
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
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
