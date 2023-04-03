import { translateRect } from "@fullcalendar/common";
import axios from "axios";
import type { IOmise } from "omise";
import { env } from "../../../env/server.mjs";

export async function chargeAndTransfer(
  omise: IOmise,
  amount: number,
  customerId: string,
  recipientId: string,
  bookingId?: string
) {
  // Validate customer and recipient exist
  const customer = await omise.customers.retrieve(customerId);
  if (customer == null) throw new Error("Customer not found");
  const recipient = await omise.recipients.retrieve(recipientId);
  if (recipient == null) throw new Error("Recipient not found");

  // Do charge and transfer
  const charges = await omise.charges.create({
    amount,
    currency: "thb",
    capture: true,
    customer: customerId,
    description: "Charge for booking payment",
    metadata: {
      recipient: recipientId,
      bookingId: bookingId,
    },
  });
  const transfer = await omise.transfers.create({
    amount: charges.amount,
    recipient: recipientId,
    metadata: {
      description: "Recieve for Booking payment",
      customerId: customerId,
      bookingId: bookingId,
    },
  });

  // auto paid in testing mode
  if (!transfer.livemode) {
    await axios.post(
      `https://api.omise.co/transfers/${transfer.id}/mark_as_sent`,
      null,
      {
        auth: {
          username: env.OMISE_SECRET_KET,
          password: "",
        },
      }
    );

    await axios.post(
      `https://api.omise.co/transfers/${transfer.id}/mark_as_paid`,
      null,
      {
        auth: {
          username: env.OMISE_SECRET_KET,
          password: "",
        },
      }
    );
  }

  return {
    charges: charges,
    transfer: transfer,
  };
}
