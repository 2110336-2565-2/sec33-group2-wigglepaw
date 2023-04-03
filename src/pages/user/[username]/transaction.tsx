import { Booking, PetSitter } from "@prisma/client";
import { NextPage } from "next";
import Header from "../../../components/Header";
import { AppRouter } from "../../../server/api/root";
import { api } from "../../../utils/api";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";

const Transaction: NextPage = () => {
  //   const transactionQuery = api.omise.getMyTransactions.useQuery();
  //   const transactions = transactionQuery.data?.data;

  const transactions = api.booking.myTransaction.useQuery();

  return (
    <div>
      <Header />

      <div className="m-auto w-fit">
        <h1 className="p-2 text-2xl font-bold">Transactions</h1>

        {transactions.data?.length === 0 ? (
          <span className="italic text-gray-500">
            No Transaction... Go pay now
          </span>
        ) : (
          <table className="text-md">
            <thead className="border-b-4">
              <tr>
                <th className="p-2 text-left">Booking</th>
                <th className="p-2 text-left">Pet Sitter</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>

            <tbody>
              {transactions.data?.map((t) => (
                <TransactionRow key={t.bookingId} booking={t} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const TransactionRow = (props: {
  booking: inferProcedureOutput<AppRouter["booking"]["myTransaction"]>[number];
}) => {
  const booking = props.booking;
  const sitter = booking.petSitter;
  const user = sitter.user;

  let displayName;
  if (sitter.freelancePetSitter) {
    const freelance = sitter.freelancePetSitter;
    displayName = freelance.firstName + " " + freelance.lastName;
  } else if (sitter.petHotel) {
    const hotel = sitter.petHotel;
    displayName = hotel.hotelName;
  }

  const avatar = (
    <Image
      width={64}
      height={64}
      className="h-12 w-12 rounded-full object-cover"
      src={user.imageUri ?? "/profiledummy.png"}
      alt="Profile"
    />
  );

  return (
    <tr className="border-b-2 hover:bg-amber-100">
      <td className="p-2">
        <div className="flex flex-col">
          <span>
            {booking.endDate.getDay()}/{booking.endDate.getMonth() + 1}/
            {booking.endDate.getFullYear()}
          </span>
          <span className="text-xs text-gray-500">
            {booking.endDate.toTimeString().slice(0, 8)}
          </span>
        </div>
      </td>
      <td className="flex flex-wrap items-center gap-2 p-2">
        {avatar}
        <div className="flex flex-col">
          <span>{displayName}</span>
          <span className="text-xs text-gray-500">#{user.username}</span>
        </div>
      </td>
      <td className="p-2 text-red-500">-฿{booking.totalPrice.toFixed()}</td>
      <td className="max-w-xs p-2 text-xs text-gray-500">{booking.note}</td>
    </tr>
  );
};

export default Transaction;
