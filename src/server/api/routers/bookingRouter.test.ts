import { TRPCError } from "@trpc/server";
import { test, expect } from "vitest";
import { appRouter } from "../root";
import { createInnerTRPCContext } from "../trpc";

test("Not login", async () => {
  const ctx = createInnerTRPCContext({ session: null });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.booking.myTransaction()).rejects.toEqual(
    new TRPCError({
      code: "UNAUTHORIZED",
    })
  );
});

test("Not user", async () => {
  const ctx = createInnerTRPCContext({ session: { user: { id: "123" } } });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.booking.myTransaction()).rejects.toBeInstanceOf(
    TRPCError
  );
});

test("Not petOwner", async () => {
  // Assume user clg0w8fbe0008i0oj915tp0vi exist and isn't a petOwner
  const ctx = createInnerTRPCContext({
    session: { user: { id: "clg0w8fbe0008i0oj915tp0vi" } },
  });
  const caller = appRouter.createCaller(ctx);

  await expect(caller.booking.myTransaction()).rejects.toHaveProperty(
    "code",
    "UNAUTHORIZED"
  );
});

test("PetOwner with booking", async () => {
  // Assume user clg0w8h95000mi0ojui9ugnqp exist and is a petOwner
  // not a best way to test..
  const ctx = createInnerTRPCContext({
    session: { user: { id: "clg0w8g1t000ci0ojfm932qeb" } },
  });
  const caller = appRouter.createCaller(ctx);

  // Assert the return is array
  await expect(caller.booking.myTransaction()).resolves.toBeInstanceOf(Array);
});

export {};
