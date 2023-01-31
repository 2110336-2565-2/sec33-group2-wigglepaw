/*
  E2E integration test with jest:
  currently fucks up the real database everytime it's run
  run with either vscode jest extension or "npm run test"

  might use PrismaMock or something else to test safely
*/

import { test, expect } from "@jest/globals";
import { AppRouter, appRouter } from "../../root";
import { prisma } from "../../../db";
import { inferProcedureInput } from "@trpc/server";

// this test create a new pet owner and test if we could getById that owner from our API or not
test('create and get owner', async () => {
    const caller = appRouter.createCaller({
        session: null,
        prisma: prisma,
      });
    
      type Input = inferProcedureInput<AppRouter["owner"]["create"]>;

      const randomId = getRandom(1,1000000)
      
      const input: Input = {
        name: `user${randomId}`,
        username: `lnwza${randomId}`,
        email: `${randomId}@xxx.com`,
        password: "12345"
      }
    
      const result = await caller.owner.create(input)
      const getOwnerById = await caller.owner.getById({id: result!.id});
      expect(getOwnerById).toStrictEqual(result)
});

const getRandom = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}