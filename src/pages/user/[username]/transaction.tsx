import {
  Booking,
  FreelancePetSitter,
  PetHotel,
  PetSitter,
} from "@prisma/client";
import { NextPage } from "next";
import Header from "../../../components/Header";
import { AppRouter } from "../../../server/api/root";
import { api } from "../../../utils/api";
import { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faArrowDown,
  faCircle,
  faArchive,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { toPng } from "html-to-image";

const Transaction: NextPage = () => {
  const transactions = api.booking.myTransaction.useQuery();

  const [selectTransactionId, setSelectTransaction] = useState<string | null>(
    null
  );

  const selectedTransaction = useMemo(
    () => transactions.data?.find((t) => t.bookingId == selectTransactionId),
    [selectTransactionId, transactions.data]
  );

  return (
    <div>
      <Header />

      <div className="m-auto w-fit">
        <h1 className="p-2 text-2xl font-bold">Transactions</h1>

        <main className="flex gap-4">
          <div>
            {transactions.data?.length === 0 ? (
              <span className="italic text-gray-500">
                No Transaction... Go pay now
              </span>
            ) : (
              <TransactionTable
                transactions={transactions.data ?? []}
                selectTransactionId={selectTransactionId}
                setSelectTransaction={setSelectTransaction}
              />
            )}
          </div>

          <div>
            <TransactionDisplay booking={selectedTransaction} />
          </div>
        </main>
      </div>
    </div>
  );
};

function calDisplayName(
  sitter: PetSitter & {
    freelancePetSitter: Pick<
      FreelancePetSitter,
      "firstName" | "lastName"
    > | null;
    petHotel: Pick<PetHotel, "hotelName"> | null;
  }
) {
  let displayName;
  if (sitter.freelancePetSitter) {
    const freelance = sitter.freelancePetSitter;
    displayName = freelance.firstName + " " + freelance.lastName;
  } else if (sitter.petHotel) {
    const hotel = sitter.petHotel;
    displayName = hotel.hotelName;
  } else {
    displayName = "Unknown Sitter Type";
  }
  return displayName;
}

type Transaction = inferProcedureOutput<
  AppRouter["booking"]["myTransaction"]
>[number];

const TransactionTable = (props: {
  transactions: Transaction[];
  selectTransactionId: string | null;
  setSelectTransaction: (id: string) => void;
}) => {
  const { transactions, selectTransactionId, setSelectTransaction } = props;

  useEffect(() => {
    const firstTransaction = transactions[0];
    if (firstTransaction && !selectTransactionId) {
      setSelectTransaction(firstTransaction.bookingId);
    }
  }, [transactions, selectTransactionId, setSelectTransaction]);

  return (
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
        {props.transactions.map((t) => (
          <TransactionRow
            key={t.bookingId}
            booking={t}
            selected={props.selectTransactionId === t.bookingId}
            onClick={() => props.setSelectTransaction(t.bookingId)}
          />
        ))}
      </tbody>
    </table>
  );
};

const TransactionRow = (props: {
  booking: Transaction;
  selected: boolean;
  onClick: () => void;
}) => {
  const booking = props.booking;
  const sitter = booking.petSitter;
  const user = sitter.user;

  const displayName = calDisplayName(sitter);

  return (
    <tr
      className={`border-b-2  ${
        props.selected ? "bg-amber-100" : "hover:bg-amber-50"
      }`}
      onClick={() => props.onClick()}
    >
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
        <Image
          width={64}
          height={64}
          className="h-12 w-12 rounded-full object-cover"
          src={user.imageUri ?? "/profiledummy.png"}
          alt="Profile"
        />
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

const TransactionDisplay = (props: {
  booking?: inferProcedureOutput<AppRouter["booking"]["myTransaction"]>[number];
}) => {
  const { data: session } = useSession();
  const [printMode, setPrintMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (!session || !session.user) {
    return null;
  }

  const booking = props.booking;
  if (!booking) {
    return <div className="bg-slate-200">Select the booking</div>;
  }
  const sitter = booking.petSitter;
  const user = sitter.user;

  const ownerDisplayName = `${session?.user.firstName} ${session?.user.lastName}`;
  const sitterDisplayName = calDisplayName(sitter);
  const date = booking.endDate.toLocaleDateString();
  const time = `${(booking.endDate.getHours() % 12)
    .toString()
    .padStart(2, "0")}:${booking.endDate
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${booking.endDate.getHours() > 12 ? "PM" : "AM"}`;

  const transactionId = booking.bookingId;
  async function download() {
    if (!ref.current) {
      alert("Cannot download");
      return;
    }

    // Set print mode, to hide unnecessary elements
    setPrintMode(true);

    // Wait for the print mode to be applied (this way's unreliable, I know i know)
    await new Promise((resolve) => setTimeout(resolve, 25));

    // Convert transaction to image, and download it
    const png = await toPng(ref.current);
    const link = document.createElement("a");
    link.download = `transaction-${transactionId}.png`;
    link.href = png;
    link.click();

    // Reset print mode
    setPrintMode(false);
  }

  return (
    <div
      className="h-fit w-fit bg-cover bg-center"
      style={{
        backgroundImage: "url(/dog-bg.jpg)",
      }}
      ref={ref}
    >
      <div className="flex w-96 flex-col backdrop-blur-[8px] backdrop-brightness-100">
        <section className="mt-12 text-center">
          <FontAwesomeIcon
            icon={faCheckCircle}
            size="5x"
            color="#3FBD61"
            className="absolute translate-x-6 translate-y-6"
          />
          <FontAwesomeIcon
            icon={faCircle}
            size="8x"
            color="#3FBD61"
            className="opacity-20"
          />
        </section>

        <section className="m-4">
          <h2 className="text-center text-xl font-extrabold">
            Payment Success
          </h2>
          <h3 className="font-gray  text-center text-gray-600">
            Hope your pet enjoys the stay!
          </h3>
        </section>

        <section
          className="mx-auto my-4 grid justify-items-stretch gap-2"
          style={{
            gridTemplateColumns: "repeat(2, auto)",
          }}
        >
          <Image
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover"
            src={session.user.imageUri ?? "/profiledummy.png"}
            alt="Profile"
          />
          <div className="flex flex-col">
            <span>{ownerDisplayName}</span>
            <span className="text-xs text-gray-600">#{user.username}</span>
          </div>

          <FontAwesomeIcon icon={faArrowDown} size="2x" />
          <br />

          <Image
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover"
            src={user.imageUri ?? "/profiledummy.png"}
            alt="Profile"
          />
          <div className="flex flex-col">
            <span>{sitterDisplayName}</span>
            <span className="text-xs text-gray-600">#{user.username}</span>
          </div>
        </section>

        <section className="mx-auto mb-6 mt-4 grid grid-cols-2 items-baseline gap-x-12 gap-y-1">
          <span className="text-lg font-light text-gray-700">Date</span>
          <span className="text-right text-lg">{date}</span>
          <span className="text-lg font-light text-gray-700">Time</span>
          <span className="text-right text-lg">{time}</span>
          <span className="text-lg font-light text-gray-700">Amount</span>
          <span className="text-right text-2xl">
            ฿<b className="font-semibold">{booking.totalPrice.toFixed(2)}</b>
          </span>
        </section>

        {!printMode && (
          <section className="flex gap-4 px-6 py-6">
            <button className="w-full rounded-xl bg-wp-blue p-2 text-lg text-white hover:bg-wp-light-blue">
              <FontAwesomeIcon icon={faArchive} className="px-2" />
              Booking
            </button>
            <button
              className="w-full rounded-xl bg-wp-blue p-2 text-lg text-white hover:bg-wp-light-blue"
              onClick={() => download()}
            >
              <FontAwesomeIcon icon={faDownload} className="px-2" />
              Download
            </button>
          </section>
        )}
      </div>
    </div>
  );
};
export default Transaction;
