import { TRPCError } from "@trpc/server";
import { test, expect } from "vitest";
import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";
import {
  USER_TYPE_MISMATCH,
  START_DATE_BEFORE_NOW,
  END_DATE_BEFORE_START_DATE,
} from "./bookingRouter";
import { rejects } from "assert";

const dayToMs = 1000 * 60 * 60 * 24;

/*

Must seed at least 10 users and 10 pets from seedRouter
*/

// clgxpy7i9000cu52cn9ixcc6g is a pet sitter from seed (invoker)
// clgxpy80o000gu52cw3y3y25g is another pet sitter
test("Not Pet Owner", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "clgxpy7i9000cu52cn9ixcc6g", userType: "PetSitter" },
    },
  });
  const caller = appRouter.createCaller(ctx);

  const fields = {
    petSitterId: "clgxpy80o000gu52cw3y3y25g",
    totalPrice: 696,
    startDate: new Date(Date.now() + dayToMs * 7),
    endDate: new Date(Date.now() + dayToMs * 14),
    petIdList: [],
  };

  expect(await caller.booking.request(fields)).toEqual(USER_TYPE_MISMATCH);
});

// clgxpyawk000yu52cl9c4j0pe is a pet owner from seed (invoker)
// clgxpygbm001uu52ct30xg4f6 is their pet
// clgxpy80o000gu52cw3y3y25g is another pet sitter
test("Start time before current time", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "clgxpyawk000yu52cl9c4j0pe", userType: "PetOwner" },
    },
  });
  const caller = appRouter.createCaller(ctx);

  const fields = {
    petSitterId: "clgxpy80o000gu52cw3y3y25g",
    totalPrice: 696,
    startDate: new Date(Date.now() - dayToMs * 7),
    endDate: new Date(Date.now() + dayToMs * 14),
    petIdList: ["clgxpygbm001uu52ct30xg4f6"],
  };

  await expect(caller.booking.request(fields)).rejects.toBeInstanceOf(
    TRPCError
  );
});

// clgxpyawk000yu52cl9c4j0pe is a pet owner from seed (invoker)
// clgxpygbm001uu52ct30xg4f6 is their pet
// clgxpy80o000gu52cw3y3y25g is another pet sitter
test("End time before start time", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "clgxpyawk000yu52cl9c4j0pe", userType: "PetOwner" },
    },
  });
  const caller = appRouter.createCaller(ctx);

  const fields = {
    petSitterId: "clgxpy80o000gu52cw3y3y25g",
    totalPrice: 696,
    startDate: new Date(Date.now() + dayToMs * 7),
    endDate: new Date(Date.now() + dayToMs * 5),
    petIdList: ["clgxpygbm001uu52ct30xg4f6"],
  };

  expect(await caller.booking.request(fields)).toEqual(
    END_DATE_BEFORE_START_DATE
  );
});

// clgxpyawk000yu52cl9c4j0pe is a pet owner from seed (invoker)
// clgxpygbm001uu52ct30xg4f6 is their pet
// clgxpy80o000gu52cw3y3y25g is another pet sitter
test("Valid", async () => {
  const ctx = createInnerTRPCContext({
    session: {
      user: { id: "clgxpyawk000yu52cl9c4j0pe", userType: "PetOwner" },
    },
  });
  const caller = appRouter.createCaller(ctx);

  const fields = {
    petSitterId: "clgxpy80o000gu52cw3y3y25g",
    totalPrice: 696,
    startDate: new Date(Date.now() + dayToMs * 7),
    endDate: new Date(Date.now() + dayToMs * 14),
    petIdList: ["clgxpygbm001uu52ct30xg4f6"],
  };

  const res = await caller.booking.request(fields);
  expect(res).toBeInstanceOf(Object);
  expect(res).not.toEqual({});
});

export {};
