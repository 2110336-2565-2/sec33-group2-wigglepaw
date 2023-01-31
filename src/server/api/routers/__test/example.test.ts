/*
  sample E2E test with jest:
  currently fucks up the database everytime it's run
*/

import { test, expect } from "@jest/globals";
import { AppRouter, appRouter } from "../../root";
import { prisma } from "../../../db";
import { inferProcedureInput } from "@trpc/server";

test("hello test", async () => {
  const caller = appRouter.createCaller({
    session: null,
    prisma: prisma,
  });

  type Input = inferProcedureInput<AppRouter["example"]["hello"]>;

  const input: Input = {
    text: "test",
  };

  const result = await caller.example.hello(input);

  expect(result).toStrictEqual({ greeting: "Hello test" });
});
