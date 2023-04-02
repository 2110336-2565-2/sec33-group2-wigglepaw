import { prisma } from "./../server/db";
import { BookingStatus } from "@prisma/client";
import Rand, { PRNG } from "rand-seed";
import { petBreeds, petNames, petTypes, sexes } from "./pool";

let rand = new Rand("6969");

export function resetRand() {
  rand = new Rand("6969");
}

export function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - rand.next());

  return shuffled.slice(0, num);
}

export function getRandomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(rand.next() * (max - min + 1) + min);
}
export function getRandomFloatFromInterval(min: number, max: number) {
  // min and max included
  return rand.next() * (max - min + 1) + min;
}

export function getRandomDatetime() {
  const dayToMs = 1000 * 60 * 60 * 24;
  const monthToMs = 30 * dayToMs;
  const now = new Date();
  const start = new Date(now.getTime() - 3 * monthToMs);
  const end = new Date(now.getTime() - 1 * dayToMs);
  return new Date(
    start.getTime() + rand.next() * (end.getTime() - start.getTime())
  );
}

export function getRandomStartEndDate() {
  const dayToMs = 1000 * 60 * 60 * 24;
  const monthToMs = 30 * dayToMs;
  const now = new Date();
  const start = new Date(now.getTime() - 3 * monthToMs);
  const days = getRandomIntFromInterval(1, 14);
  const end = new Date(start.getTime() + rand.next() * dayToMs * days);
  return { startDate: start, endDate: end };
}

export function getRandomBookingStatus() {
  // request accepted canceled rejected
  //   15       70       5        10
  const x = rand.next() * 100;
  if (x <= 5) return BookingStatus.canceled;
  else if (x <= 15) return BookingStatus.rejected;
  else if (x <= 30) return BookingStatus.requested;
  else return BookingStatus.accepted;
}

export async function getAllSitterId() {
  const sitters = await prisma.petSitter.findMany();

  const sitterIds = new Array<string>(sitters.length);

  for (let i = 0; i < sitters.length; i++) {
    sitterIds[i] = sitters[i]?.userId ?? "";
  }
  return sitterIds;
}

export async function getAllOwnerId() {
  const owners = await prisma.petOwner.findMany();

  const ownerIds = new Array<string>(owners.length);

  for (let i = 0; i < owners.length; i++) {
    ownerIds[i] = owners[i]?.userId ?? "";
  }
  return ownerIds;
}

export async function getAllPetIds(petOwnerId: string) {
  const owner = await prisma.petOwner.findFirst({
    where: {
      userId: petOwnerId,
    },
    include: {
      pet: true,
    },
  });

  const pets = owner?.pet ?? [];
  const petIds = new Array<string>(pets.length);

  for (let i = 0; i < pets.length; i++) {
    petIds[i] = pets[i]?.petId ?? "";
  }
  return petIds;
}

export async function updateOwnerPetTypes(ownerId: string) {
  const owner = await prisma.petOwner.findFirst({
    where: {
      userId: ownerId,
    },
    include: {
      user: true,
      pet: true,
    },
  });
  const pets = owner?.pet ?? [];
  const petSet = new Set<string>();
  for (const pet of pets) {
    petSet.add(pet.petType);
  }
  const petArray = Array.from(petSet);
  await prisma.petOwner.update({
    where: {
      userId: ownerId,
    },
    data: {
      petTypes: petArray,
    },
  });
  return "Updated owner's pet types successfully.";
}

export async function createRandomPets(
  numberOfPets: number,
  petOwnerId: string
) {
  for (let i = 0; i < numberOfPets; i++) {
    const petType = getMultipleRandom(petTypes, 1)[0] ?? "";
    const createPet = await prisma.pet.create({
      data: {
        petOwnerId: petOwnerId,
        petType: petType,
        name: getMultipleRandom(petNames, 1)[0] ?? "",
        sex: getMultipleRandom(sexes, 1)[0] ?? "",
        breed: getMultipleRandom(petBreeds[petType] ?? ["breed"], 1)[0] ?? "",
        weight: getRandomIntFromInterval(1, 100) / 10,
        createdAt: new Date(),
      },
    });
  }
  await updateOwnerPetTypes(petOwnerId);
  return;
}
