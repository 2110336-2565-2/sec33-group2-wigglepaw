import type { NextApiRequest, NextApiResponse } from "next";
import { createOpenApiNextHandler } from "trpc-openapi";
import { z, ZodVoid } from "zod";

import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";

function nestAccess<T>(obj: T, path: string[]) {
  if (path.length === 0) {
    return obj;
  }
  const [first, ...rest] = path;
  if (first === undefined) {
    return obj;
  }

  const inner = obj[first];
  return nestAccess(inner, rest);
}

/**
 * "input get-safe" schema means that it's safe to use as input in GET requests.
 *
 * A zod schema is "input get-safe" if and only if:
 * 1. It's ZodString, ZodNumber, ZodBoolean, ZodBigInt or ZodDate
 * 2. Or it's ZodObject and all of its properties are statified by 1.
 * Note this imply that nested object schema isn't "input get-safe".
 */
function isInputGETSafe(schema: z.ZodTypeAny): boolean {
  if ("unwrap" in schema) {
    schema = schema.unwrap();
  }

  if (schema instanceof z.ZodObject && typeof schema.shape === "object") {
    return Object.values(schema.shape).every(
      (s) =>
        s instanceof z.ZodString ||
        s instanceof z.ZodNumber ||
        s instanceof z.ZodBoolean ||
        s instanceof z.ZodBigInt ||
        s instanceof z.ZodDate
    );
  }
  return (
    schema instanceof z.ZodString ||
    schema instanceof z.ZodNumber ||
    schema instanceof z.ZodBoolean ||
    schema instanceof z.ZodBigInt ||
    schema instanceof z.ZodDate
  );
}

/**
 * Router adjustments for automatic trpc-open-api.
 * yes, this is a filty hack.
 */
function adaptRouter(router: typeof appRouter) {
  for (const routePath in router._def.procedures) {
    // path here is a string query/mutation like "admin.create"

    // Sample a type from the router.
    type Endpoint = typeof router.openapi;
    type Def = typeof router.openapi._def;

    // Get the endpoint, associated with the path.
    const endpoint: Endpoint = nestAccess(router, routePath.split("."));
    const def: Def = endpoint._def;

    // Input/output filling
    if (def.inputs === undefined || def.inputs.length == 0) {
      def.inputs = [z.void()];
    }
    if (def.output === undefined) {
      def.output = z.any();
    }

    // OpenAPI metadata filling
    if (def.meta?.openapi === undefined) {
      // Determine the HTTP method.
      let method;
      if (def.query) {
        method = isInputGETSafe(def.inputs[0]) ? "GET" : "PATCH";
      } else if (def.mutation) {
        method = "POST";
      }

      const urlPath: `/${string}` = `/${routePath.replaceAll(".", "/")}`;

      def.meta = {
        openapi: {
          method: method ?? "PATCH",
          path: urlPath,
          tags: [routePath.split(".")[0]],
          protect: (def.meta?.secure as boolean | undefined) ?? "true",
        },
        ...def.meta,
      };
    }
  }
}

let adapted = false;
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  // Handle incoming OpenAPI requests.
  // This is for exposing trpc endpoints as REST.

  if (!adapted) {
    adaptRouter(appRouter);
    adapted = true;
  }

  return createOpenApiNextHandler({
    router: appRouter,
    createContext: createTRPCContext,
  })(req, res);
};

export default handler;
