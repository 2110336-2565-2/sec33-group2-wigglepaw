import { UserProfile, UserSubType, UserType } from "../../../types/user";
export abstract class UserTypeLogic {
  public static isPetOwner(userType: UserType) {
    const isPetOwner: boolean = [UserType.PetOwner].includes(userType);
    return isPetOwner;
  }

  public static isPetSitter(userType: UserType) {
    const isPetSitter: boolean = [
      UserType.FreelancePetSitter,
      UserType.PetHotel,
    ].includes(userType);
    return isPetSitter;
  }
}
