import type { FreelancePetSitter, PetHotel, PetSitter } from "@prisma/client";
import type { NextPage } from "next";
import Header from "../components/Header";
import type { AppRouter } from "../server/api/root";
import { api } from "../utils/api";
import type { inferProcedureOutput } from "@trpc/server";
import Image from "next/image";
import type { HTMLAttributes } from "react";
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
import { UserType } from "../types/user";
import Link from "next/link";
import { AiFillCreditCard } from "react-icons/ai";
import { Popover } from "@headlessui/react";

const Transaction: NextPage = () => {
  const transactions = api.booking.myTransaction.useQuery();

  const [selectTransactionId, setSelectTransaction] = useState<string | null>(
    null
  );
  const [hoverTransactionId, setHoverTransaction] = useState<string | null>(
    null
  );

  const displayingTransaction = useMemo(
    () =>
      hoverTransactionId
        ? transactions.data?.find((t) => t.bookingId == hoverTransactionId)
        : transactions.data?.find((t) => t.bookingId == selectTransactionId),
    [selectTransactionId, hoverTransactionId, transactions.data]
  );

  return (
    <div>
      <Header />

      <div className="m-auto w-fit">
        <header className="flex p-2 text-2xl font-bold">
          <span>Transactions</span>
          <CardButton />
        </header>

        <main className="flex flex-wrap justify-center gap-4">
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
                setHoverTransaction={setHoverTransaction}
              />
            )}
          </div>

          <div
            className={
              "transition-all duration-150" +
              (hoverTransactionId ? " opacity-80" : "")
            }
          >
            <TransactionDisplay booking={displayingTransaction} />
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * Calculate the display name of a pet sitter.
 *
 * For freelance pet sitter, "firstName lastName";
 * for pet hotel, it will be "hotelName".
 */
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
  setHoverTransaction: (id: string | null) => void;
}) => {
  const {
    transactions,
    selectTransactionId,
    setSelectTransaction,
    setHoverTransaction,
  } = props;

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
            selected={selectTransactionId === t.bookingId}
            onClick={() => {
              setSelectTransaction(t.bookingId);
              setHoverTransaction(null);
            }}
            onMouseOver={() => {
              if (selectTransactionId !== t.bookingId)
                setHoverTransaction(t.bookingId);
            }}
            onMouseOut={() => setHoverTransaction(null)}
          />
        ))}
      </tbody>
    </table>
  );
};

const TransactionRow = (
  props: {
    booking: Transaction;
    selected: boolean;
    onClick: () => void;
  } & HTMLAttributes<HTMLTableRowElement>
) => {
  const { booking, selected, onClick, className, ...rest } = props;

  const sitter = booking.petSitter;
  const user = sitter.user;

  const displayName = calDisplayName(sitter);

  return (
    <tr
      className={
        `border-b-2  ${selected ? "bg-amber-100" : "hover:bg-amber-50"} ${
          selected ? "" : "cursor-pointer"
        }` + (className ?? "")
      }
      onClick={onClick}
      {...rest}
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

  if (session.user.userType !== UserType.PetOwner) {
    throw new Error("Only pet owner can view this page");
  }

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
            src={session.user.picture ?? "/profiledummy.png"}
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
            <Link
              href={`user/${sitter.user.username}/booking`}
              className="w-full rounded-xl bg-wp-blue p-2 text-center text-lg text-white hover:bg-wp-light-blue"
            >
              <FontAwesomeIcon icon={faArchive} className="px-2" />
              Booking
            </Link>
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

/**
 * Card icon button which display a popover with card info when clicked
 */
const CardButton = () => {
  const { data } = api.petOwner.getMyCardInfo.useQuery();

  const digit = useMemo(() => {
    if (!data?.last_digits) {
      return null;
    }

    // Make card number from last 4 digits
    // it should look like "**** **** **** 1234" when 1234 is the last 4 digits
    const encoder = new TextEncoder();
    const charArr = encoder.encode(data.last_digits.padStart(16 + 3, "*"));
    charArr[4] = 32;
    charArr[9] = 32;
    charArr[14] = 32;
    return new TextDecoder().decode(charArr);
  }, [data?.last_digits]);

  if (!data || !digit) {
    return null;
  }

  return (
    <Popover>
      <Popover.Button className="transition-transform duration-75 hover:scale-110">
        <AiFillCreditCard className="mx-2 inline" size={24} />
      </Popover.Button>
      <Popover.Overlay className="fixed inset-0 bg-black opacity-30" />

      <Popover.Panel className="absolute z-10 w-80">
        <div className="rounded-xl bg-wp-light-blue p-4 font-card font-thin text-white shadow-black">
          <div className="text-md col-span-3">{digit}</div>

          <div className="my-1 flex gap-2 text-sm">
            <span className="flex-1 text-right">
              {data.expiration_month.toString().padStart(2, "0")}/
              {data.expiration_year % 100}
            </span>

            <span className="float-right text-justify">
              {data.financing.toUpperCase()}
            </span>
          </div>

          <div className="flex">
            <span className="flex-1 text-sm">{data.name}</span>

            <div className="float-right inline-block bg-slate-50 px-1 text-xl text-blue-700">
              <span>{data.brand}</span>
            </div>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
};
