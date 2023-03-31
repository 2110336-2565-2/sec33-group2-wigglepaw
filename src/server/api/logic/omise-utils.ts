import type { IBankAccount, IOmise, Recipients } from "omise";

export async function createRecipients(
  omise: IOmise,
  req: Recipients.IRequest & { bank_account: IBankAccount }
) {
  try {
    const recipient = await omise.recipients.create(req);

    console.log(">>>>>>>>>>>>>>>>>");
    console.log(recipient);
    console.log("<<<<<<<<<<<<<<<<<");
    return recipient;
  } catch (e) {
    console.error("Error creating omise recipient");
    console.error(e);
    throw e;
  }
}
