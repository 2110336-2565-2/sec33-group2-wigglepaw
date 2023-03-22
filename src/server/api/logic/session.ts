import { UserProfile, UserSubType, UserType } from "../../../types/user";
export abstract class UserTypeLogic {
  public static isPetOwner(userType: UserType): boolean {
    const isPetOwner: boolean = [UserType.PetOwner].includes(userType);
    return isPetOwner;
  }

  public static isPetSitter(userType: UserType): boolean {
    const isPetSitter: boolean = [
      UserType.FreelancePetSitter,
      UserType.PetHotel,
    ].includes(userType);
    return isPetSitter;
  }
}
