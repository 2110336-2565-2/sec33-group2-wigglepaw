abstract class InnerReturn {
  public static userFields: object = {
    userId: true,
    username: true,
    email: true,
    phoneNumber: true,
    address: true,
    imageUri: true,
  };
  public static petOwnerFields: object = {
    userId: true,
    petTypes: true,
    firstName: true,
    lastName: true,
    review: true,
  };
  public static freelancePetSitterFields: object = {
    userId: true,
    firstName: true,
    lastName: true,
  };
  public static petHotelFields: object = {
    userId: true,
    businessLicenseUri: true,
    hotelName: true,
  };
  public static petSitterFields: object = {
    userId: true,
    petTypes: true,
    verifyStatus: true,
    certificationUri: true,
    startPrice: true,
    endPrice: true,
    avgRating: true,
  };
  public static petFields: object = {
    petId: true,
    petOwnerId: true,
    petType: true,
    name: true,
    sex: true,
    breed: true,
  };
  public static bookingFields: object = {
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
  public static userFields: object = {
    ...InnerReturn.userFields,
  };
  public static petOwnerFields: object = {
    ...InnerReturn.petOwnerFields,
  };
  public static petSitterFields: object = {
    ...InnerReturn.petSitterFields,
    petHotel: { select: InnerReturn.petHotelFields },
    freelancePetSitter: { select: InnerReturn.freelancePetSitterFields },
  };
  public static petFields: object = {
    ...InnerReturn.petFields,
  };
  public static bookingFields: object = {
    ...InnerReturn.bookingFields,
    pet: { select: InnerReturn.petFields },
    petOwner: { select: InnerReturn.petOwnerFields },
    petSitter: { select: InnerReturn.petSitterFields },
  };
}
