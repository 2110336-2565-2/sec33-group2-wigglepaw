import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { userFields, petOwnerFields, petFields } from "../../../schema/schema";

export const postRouter = createTRPCRouter({});
