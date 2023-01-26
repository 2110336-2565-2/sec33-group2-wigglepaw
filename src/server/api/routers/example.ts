import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // a public procedure that accept a number and return a fibonacci number
  fibo: publicProcedure
    .input(
      z.object({
        n: z
          .number()
          .max(30, "you're not allow to compute more than 30th order"),
        // Work 1
      })
    )
    .query(({ input }) => {
      const fibo = (n: number): number => {
        if (n <= 1) return 1;
        return fibo(n - 1) + fibo(n - 2);
      };
      return fibo(input.n);
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
