import type { NextApiRequest, NextApiResponse } from "next";
import { createOpenApiNextHandler } from "trpc-openapi";

import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Handle incoming OpenAPI requests.
  // This is for exposing trpc endpoints as REST.
  return createOpenApiNextHandler({
    router: appRouter,
    createContext: createTRPCContext,
  })(req, res);
};

export default handler;
