import axios from "axios";
import type { IBankAccount, IOmise, Recipients } from "omise";
import { env } from "../../../env/server.mjs";

/**
 * Parameter for creating recipient, the official type is wrong.
 *
 * Many optional field are actually conditional required fields, depending on the country.
 * consult the official document.
 *
 * @see https://www.omise.co/recipients-api#create
 */
interface ICreateBankAccount {
  name: string;
  number: number;
  bank_code?: string;
  branch_code?: string;
  brand?: string;
  type?: "normal" | "current";
}

/**
 * Type surgery, to fix the wrong typing... from a official package
 *
 */
type ActualRecipientsIRequest = Omit<Recipients.IRequest, "back_account"> & {
  bank_account: ICreateBankAccount;
};

export async function createRecipients(
  omise: IOmise,
  req: ActualRecipientsIRequest,
  config: {
    /**
     * In test mode, will automatically verify the recipient.
     * @see https://www.omise.co/recipients-api#verify
     */
    autoVerifyInTest?: boolean;
  }
) {
  try {
    const recipient = await omise.recipients.create(req);

    if (
      config.autoVerifyInTest === true &&
      !recipient.verified &&
      recipient.livemode === false
    ) {
      console.log(
        `[test mode] automatically verifing recipient ${recipient.id}`
      );
      try {
        await axios.patch(
          `https://api.omise.co/recipients/${recipient.id}/verify`,
          null,
          {
            auth: {
              username: env.OMISE_SECRET_KET,
              password: "",
            },
          }
        );
      } catch (e) {
        console.error("Error auto verifying recipient");
        console.error(e);
        throw e;
      }
    }

    return recipient;
  } catch (e) {
    console.error("Error creating omise recipient");
    console.error(e);
    throw e;
  }
}
