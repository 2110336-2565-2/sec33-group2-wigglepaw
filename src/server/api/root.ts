import { petOwnerRouter } from "./routers/petOwner";
import { userRouter } from "./routers/userRouter";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { exampleRouter } from "./routers/example";
import { petRouter } from "./routers/petRouter";
import { touchyTestRouter } from "./routers/touchyTest";
import { petSitterRouter } from "./routers/petSitterRouter";
import { paiRouter } from "./routers/paiRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  pet: petRouter,
  touchy: touchyTestRouter,
  user: userRouter,
  petSitter: petSitterRouter,
  petOwner: petOwnerRouter,
  paiii: paiRouter,
  // Health check route, return 200 OK if server is up
  healthcheck: publicProcedure.query(() => true),
});

// export type definition of API
export type AppRouter = typeof appRouter;
