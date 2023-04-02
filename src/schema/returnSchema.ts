abstract class InnerReturn {
  public static user: object = {
    userId: true,
    username: true,
    email: true,
    phoneNumber: true,
    address: true,
    imageUri: true,
  };
  public static petOwner: object = {
    userId: true,
    petTypes: true,
    firstName: true,
    lastName: true,
    review: true,
  };
  public static freelancePetSitter: object = {
    userId: true,
    firstName: true,
    lastName: true,
  };
  public static petHotel: object = {
    userId: true,
    businessLicenseUri: true,
    hotelName: true,
  };
  public static petSitter: object = {
    userId: true,
    petTypes: true,
    verifyStatus: true,
    certificationUri: true,
    startPrice: true,
    endPrice: true,
    avgRating: true,
  };
  public static pet: object = {
    petId: true,
    petOwnerId: true,
    petType: true,
    name: true,
    sex: true,
    breed: true,
    weight: true,
  };
  public static booking: object = {
    bookingId: true,
    petOwnerId: true,
    petSitterId: true,
    startDate: true,
    endDate: true,
    numberOfPets: true,
    status: true,
    note: true,
  };
}
export abstract class Return {
  public static user: object = {
    ...InnerReturn.user,
  };
  public static petOwner: object = {
    ...InnerReturn.petOwner,
    user: { select: InnerReturn.user },
  };
  public static petSitter: object = {
    ...InnerReturn.petSitter,
    petHotel: { select: InnerReturn.petHotel },
    freelancePetSitter: { select: InnerReturn.freelancePetSitter },
    user: { select: InnerReturn.user },
  };
  public static pet: object = {
    ...InnerReturn.pet,
  };
  public static booking: object = {
    ...InnerReturn.booking,
    pet: { select: InnerReturn.pet },
    petOwner: { select: this.petOwner },
    petSitter: { select: this.petSitter },
  };
  public static userWithType: object = {
    ...this.user,
    petOwner: { select: this.petOwner },
    petSitter: { select: this.petSitter },
  };
}
