import type { OmiseTokenParameters } from "omise-js-typed/dist/lib/omise.js";
import { env } from "../env/client.mjs";

export async function createTokenPromise(
  type: "card",
  tokenParams: OmiseTokenParameters
) {
  if (!window.Omise) {
    throw new Error(`
Omise is not included, please add this snippet to your page:
<Script type="text/javascript" src="https://cdn.omise.co/omise.js" />
`);
  }

  window.Omise.setPublicKey(env.NEXT_PUBLIC_OMISE_PUBLISHABLE_KEY);

  return await new Promise((resolve, reject) => {
    window.Omise.createToken(
      "card",
      tokenParams,
      function (statusCode, response) {
        if (statusCode === 200) {
          resolve(response.id);
        } else {
          reject(response);
        }
      }
    );
  });
}
