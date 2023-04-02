import type { Booking } from "@prisma/client";

export enum BookingState {
  upcoming = "upcoming",
  ongoing = "ongoing",
  finished = "finished",
}

export type BookingWithState = Booking & { state: BookingState };

export abstract class BookingStateLogic {
  public static getState(
    this: void,
    startDate: Date,
    endDate: Date,
    now?: Date
  ): BookingState {
    now = now ?? new Date();
    let state = BookingState.ongoing;
    if (endDate < now) state = BookingState.finished;
    if (now < startDate) state = BookingState.upcoming;
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
