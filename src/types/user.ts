import {
  type PetOwner,
  type PetSitter,
  type FreelancePetSitter,
  type PetHotel,
  type Admin,
  ApprovalRequest,
} from "@prisma/client";

/**
 * Used in {@link UserSubType} to identify the type of user.
 */
export const enum UserType {
  PetOwner = "PetOwner",
  FreelancePetSitter = "FreelancePetSitter",
  PetHotel = "PetHotel",
  Admin = "Admin",
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
      PetHotel)
  | ({
      userType: UserType.Admin;
    } & Admin);

/**
 * I try to filter some unnecessary fields when displaying user profile.
 * I do this to get rid of errors in profile components.
 * Feel free to edit this. I know it's not a good practice.
 */
export type UserProfile = {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  imageUri: string | null;
  createdAt: Date;
};

export type UserProfileSubType =
  | ({
      userType: UserType.PetOwner;
    } & PetOwnerProfileType)
  | ({
      userType: UserType.FreelancePetSitter;
    } & PetSitterProfileType &
      FreelancePetSitterProfileType)
  | ({
      userType: UserType.PetHotel;
    } & PetSitterProfileType &
      PetHotelProfileType);

export type PetOwnerProfileType = {
  firstName: string;
  lastName: string;
};

export type PetSitterProfileType = {
  petTypes: string[];
  verifyStatus: boolean;
  certificationUri: string | null;
  startPrice: number | null;
  endPrice: number | null;
  ApprovalRequest: ApprovalRequest[];
};

export type FreelancePetSitterProfileType = {
  firstName: string;
  lastName: string;
};

export type PetHotelProfileType = {
  businessLicenseUri: string | null;
  hotelName: string;
};
