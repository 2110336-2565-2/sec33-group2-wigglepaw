import Omise from "omise";
import type { IOmise } from "omise";
import { env } from "../env/server.mjs";

declare global {
  // eslint-disable-next-line no-var
  var omise: IOmise | undefined;
}

export const omise =
  global.omise ||
  Omise({
    publicKey: process.env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY,
    secretKey: process.env.OMISE_SECRET_KET,
  });

// if (env.NODE_ENV !== "production") {
global.omise = omise;
// }
