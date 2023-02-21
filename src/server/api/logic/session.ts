import { UserProfile, UserSubType, UserType } from "../../../types/user";
export class UserTypeLogic {
  userType: UserType;

  constructor(userType: UserType) {
    this.userType = userType;
  }

  isPetOwner() {
    const isPetOwner: boolean = [UserType.PetOwner].includes(this.userType);
    return isPetOwner;
  }

  isPetSitter() {
    const isPetSitter: boolean = [
      UserType.FreelancePetSitter,
      UserType.PetHotel,
    ].includes(this.userType);
    return isPetSitter;
  }
}
