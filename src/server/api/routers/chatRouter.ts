import { z } from "zod";
import { api } from "../../../utils/api";
import { Server } from "socket.io";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  init: publicProcedure.input().query(async ({ ctx, input }) => {
    const io = new Server(3000, {
      /* options */
    });

    io.on("connection", (socket) => {
      // ...
      console.log("connected!");
    });
  }),
});
