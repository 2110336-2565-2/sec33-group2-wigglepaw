import { postRouter } from "./routers/postRouter";
import { reviewRouter } from "./routers/reviewRouter";
import { seedRouter } from "./routers/seedRouter";
import { petHotelRouter } from "./routers/petHotelRouter";
import { freelancePetSitterRouter } from "./routers/freelancePetSitterRouter";
import { petOwnerRouter } from "./routers/petOwnerRouter";
import { chatRouter } from "./routers/chatRouter";
import { userRouter } from "./routers/userRouter";
import { createTRPCRouter, publicProcedure } from "./trpc";
import { petSitterRouter } from "./routers/petSitterRouter";
import { bookingRouter } from "./routers/bookingRouter";
import { petRouter } from "./routers/petRouter";
import { profilePictureRouter } from "./routers/profilePictureRouter";
import { recommendRouter } from "./routers/recommendRouter";
import { blockRouter } from "./routers/blockRouter";
import { muteRouter } from "./routers/muteRouter";
import { adminRouter } from "./routers/adminRouter";
import { reportTicketRouter } from "./routers/reportTicketRouter";
import { approvalRequestRouter } from "./routers/approvalRequestRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  admin: adminRouter,
  petSitter: petSitterRouter,
  petOwner: petOwnerRouter,
  freelancePetSitter: freelancePetSitterRouter,
  petHotel: petHotelRouter,
  booking: bookingRouter,
  seed: seedRouter,
  chat: chatRouter,
  pet: petRouter,
  review: reviewRouter,
  post: postRouter,
  profilePicture: profilePictureRouter,
  recommend: recommendRouter,
  reportTicket: reportTicketRouter,
  approvalRequest: approvalRequestRouter,
  block: blockRouter,
  mute: muteRouter,
  // Health check route, return 200 OK if server is up
  healthcheck: publicProcedure
    .meta({ description: "Health check route, return 200 OK if server is up" })
    .query(() => true),
});

// export type definition of API
export type AppRouter = typeof appRouter;
