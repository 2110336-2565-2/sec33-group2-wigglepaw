/**
 * Client side wrapper for Omise.js, all function will assume that the Omise.js is already loaded and initialized.
 * It's nowhere near exhaustive, it's just enough for our use case.
 * @see https://www.omise.co/omise-js
 *
 * @remarks omise.js is a client-side library that allows you to handle card and payments,
 * but their library is not easy to use with modern typescript.
 */

import type {
  OmiseCreateTokenResponse,
  OmiseTokenParameters,
} from "omise-js-typed/dist/lib/omise";
import type { HttpStatusCode } from "omise-js-typed/dist/lib/utils";

export function createToken(
  type: string,
  tokenParameters: OmiseTokenParameters
) {
  // Adapted from bottom of https://www.omise.co/collecting-card-information
  return new Promise<[HttpStatusCode, OmiseCreateTokenResponse]>(
    (resolve, reject) => {
      window.Omise.createToken(
        type,
        tokenParameters,
        (statusCode, response) => {
          if (
            response.object == "error" ||
            !response.card.security_code_check
          ) {
            reject([statusCode, response]);
          } else {
            resolve([statusCode, response]);
          }
        }
      );
    }
  );
}
