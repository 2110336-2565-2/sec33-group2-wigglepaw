import { createInnerTRPCContext } from "../src/server/api/trpc";
import { appRouter } from "../src/server/api/root";
import { beforeEach, describe, expect, test } from "vitest";
import { type DeepMockProxy, mockDeep, mockReset } from "vitest-mock-extended";
import { type PrismaClient } from "@prisma/client";

const prisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();
beforeEach(() => {
  mockReset(prisma);
});

describe("example", () => {
  test("fibo", async () => {
    const ctx = createInnerTRPCContext({
      session: null,
      prisma,
    });
    const caller = appRouter.createCaller(ctx);

    expect(await caller.example.fibo({ n: 10 })).toBe(89);
  });

  test("healthcheck", async () => {
    const ctx = createInnerTRPCContext({
      session: null,
      prisma,
    });
    const caller = appRouter.createCaller(ctx);

    expect(await caller.healthcheck()).toBe(true);
  });

  describe("secret message", () => {
    test("signed in", async () => {
      const ctx = createInnerTRPCContext({
        session: {
          user: {
            id: "1",
            username: "test",
          },
          expires: new Date().toISOString(),
        },
        prisma,
      });
      const caller = appRouter.createCaller(ctx);

      expect(await caller.example.getSecretMessage()).toBe(
        "you can now see this secret message!"
      );
    });

    test("not signed in", async () => {
      const ctx = createInnerTRPCContext({
        session: null,
        prisma,
      });
      const caller = appRouter.createCaller(ctx);

      await expect(caller.example.getSecretMessage()).rejects.toThrow(
        "UNAUTHORIZED"
      );
    });
  });
});
