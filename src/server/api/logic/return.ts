enum BookingState {
  Upcoming = "Upcoming",
  Ongoing = "Ongoing",
  Finished = "Finished",
}
export abstract class BookingReturnLogic {
  public static makeState(booking: object): object {
    const now = new Date();
    const startDate: Date = booking["startDate"];
    const endDate: Date = booking["endDate"];
    let state = BookingState.Ongoing;
    if (endDate < now) state = BookingState.Finished;
    if (now < startDate) state = BookingState.Upcoming;
    booking["state"] = state;
    return booking;
  }
}
