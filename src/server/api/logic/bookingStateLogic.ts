import type { Booking } from "@prisma/client";

enum BookingState {
  Upcoming = "Upcoming",
  Ongoing = "Ongoing",
  Finished = "Finished",
}

type BookingWithState = Booking & { state: BookingState };

export abstract class BookingStateLogic {
  public static getState(
    this: void,
    startDate: Date,
    endDate: Date,
    now?: Date
  ): BookingState {
    now = now ?? new Date();
    let state = BookingState.Ongoing;
    if (endDate < now) state = BookingState.Finished;
    if (now < startDate) state = BookingState.Upcoming;
    return state;
  }
  public static makeState(this: void, booking: Booking): BookingWithState {
    const state = BookingStateLogic.getState(
      booking.startDate,
      booking.endDate
    );
    const bookingWithState: BookingWithState = { ...booking, state: state };
    return bookingWithState;
  }
}
