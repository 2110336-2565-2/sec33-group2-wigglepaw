import { z } from "zod";
import { api } from "../../../utils/api";
import { Server } from "socket.io";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({});
