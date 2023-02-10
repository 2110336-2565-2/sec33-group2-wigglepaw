import {
  type PetOwner,
  type PetSitter,
  type FreelancePetSitter,
  type PetHotel,
} from "@prisma/client";

/**
 * Used in {@link UserSubType} to identify the type of user.
 */
export const enum UserType {
  PetOwner = "PetOwner",
  FreelancePetSitter = "FreelancePetSitter",
  PetHotel = "PetHotel",
}

/**
 * Information about the user that is specific to the type of user.
 * The type of user is identified by {@link UserType} with field `usertype`.
 *
 * This is a discriminated union type.
 * @see {@link https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions|Discriminated Unions}
 */
export type UserSubType =
  | ({
      userType: UserType.PetOwner;
    } & PetOwner)
  | ({
      userType: UserType.FreelancePetSitter;
    } & PetSitter &
      FreelancePetSitter)
  | ({
      userType: UserType.PetHotel;
    } & PetSitter &
      PetHotel);
