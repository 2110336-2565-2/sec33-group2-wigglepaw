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
  public static admin: object = {
    userId: true,
  };
  public static approvalRequest: object = {
    requestId: true,
    petSitterId: true,
    status: true,
    adminId: true,
    notes: true,
    createdAt: true,
    latestStatusUpdateAt: true,
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
    user: { select: InnerReturn.user },
    petHotel: { select: InnerReturn.petHotel },
    freelancePetSitter: { select: InnerReturn.freelancePetSitter },
  };
  public static pet: object = {
    ...InnerReturn.pet,
  };
  public static booking: object = {
    ...InnerReturn.booking,
    pet: { select: InnerReturn.pet },
    petOwner: { select: InnerReturn.petOwner },
    petSitter: { select: this.petSitter },
  };
  public static admin: object = {
    ...InnerReturn.admin,
    user: { select: InnerReturn.user },
  };
  public static approvalRequest: object = {
    ...InnerReturn.approvalRequest,
    petSitter: { select: this.petSitter },
    latestStatusUpdateby: { select: this.admin },
  };
}
