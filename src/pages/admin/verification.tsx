import { PetSitter } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import DataTable, {
  TableColumn,
  ConditionalStyles,
} from "react-data-table-component";
import FixedHeader from "../../components/FixedHeader";
import { UserType, UserProfile, UserProfileSubType } from "../../types/user";
import { api } from "../../utils/api";

export default function Verification() {
  return (
    <div className="flex h-screen flex-col">
      <FixedHeader />
      <div className="flex flex-grow">
        <div className="flex h-full w-[200px] border-2">
          Please connect sidetab given I am done with my life.
        </div>
        <div className="w-full border-red-500 px-[80px] py-[40px]">
          <div className="flex h-full w-full flex-col gap-[20px]">
            <h2 className="text-[40px] font-semibold">
              Pet Sitter Verification
            </h2>
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}

// DATATABLE
interface DataRow {
  username: string;
  imageUri: string | null | undefined;
  fullName: string | null;
  hotelName: string | null;
  type: UserType;
  certificationUri: string | null;
  lastUpdate: Date;
  status: boolean;
}

function Table() {
  const users = api.user.getAllForProfile.useQuery();

  const data: DataRow[] = users.data
    ? users.data
        .filter(
          (user) =>
            user &&
            (user.userType === UserType.FreelancePetSitter ||
              user.userType === UserType.PetHotel)
        )
        .map((petSitter) => ({
          username: petSitter.username,
          imageUri: petSitter.imageUri,
          fullName:
            petSitter.userType === UserType.FreelancePetSitter
              ? `${petSitter.firstName} ${petSitter.lastName}`
              : null,
          hotelName:
            petSitter.userType === UserType.PetHotel
              ? petSitter.hotelName
              : null,
          type: petSitter.userType,
          certificationUri:
            petSitter.userType === UserType.FreelancePetSitter ||
            petSitter.userType === UserType.PetHotel
              ? petSitter.certificationUri
              : null,
          lastUpdate: new Date(Date.now() - 4269969),
          status:
            (petSitter.userType === UserType.FreelancePetSitter ||
              petSitter.userType === UserType.PetHotel) &&
            petSitter.verifyStatus,
        }))
    : [];

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Pet Sitter",
      selector: (row) =>
        row.type === UserType.FreelancePetSitter
          ? row.fullName || ""
          : row.hotelName || "",
      cell: (row) => (
        <div className="flex h-[60px] items-center gap-2">
          <div className="relative h-[40px] w-[40px] rounded-full border border-black drop-shadow-md">
            <Image
              src={row.imageUri || "/profiledummy.png"}
              alt=""
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex w-[150px] flex-col">
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]">
              {row.fullName || row.hotelName}
            </div>
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-wp-blue">
              #{row.username}
            </div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) =>
        row.type === UserType.FreelancePetSitter ? "Freelance" : "Hotel",
      cell: (row) =>
        row.type === UserType.FreelancePetSitter ? (
          <div className="text-[18px] font-semibold text-freelance">
            Freelance
          </div>
        ) : (
          <div className="text-[18px] font-semibold text-hotel">Hotel</div>
        ),
      sortable: true,
    },
    {
      name: "Certification URI",
      selector: (row) => row.certificationUri || "",
      cell: (row) => (
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]">
          <Link href={row.certificationUri || ""} className="link">
            {(row.certificationUri || "none").replace(
              /^(https?:\/\/)?(www\.)?/i,
              ""
            )}
          </Link>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Last update",
      selector: (row) => row.lastUpdate.toISOString(),
      cell: (row) => (
        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]">
          {formatTime(row.lastUpdate)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Verified" : "Pending"),
      cell: (row) => (
        <div
          className={`flex h-[28px] w-[100px] items-center justify-center rounded-md text-[18px] font-semibold text-white drop-shadow-md ${
            row.status ? "bg-good" : "bg-neutral"
          }`}
        >
          {row.status ? "Verified" : "Pending"}
        </div>
      ),
      sortable: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        // height: "60px", // override the row height
      },
    },
    headCells: {
      style: {
        height: "60px",
        fontSize: "20px",
        fontWeight: 600,
      },
    },
    cells: {
      style: {
        // fontSize: "18px",
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      customStyles={customStyles}
      pagination
    />
  );
}

// import { useState, MouseEvent } from "react";
// import DataTable, {
//   TableColumn,
//   ConditionalStyles,
// } from "react-data-table-component";

// export default function Table() {
//   return <TableComponent />;
// }

// interface DataRow {
//   id: number;
//   title: string;
//   year: string;
// }

// function TableComponent() {
//   //
//   const [selectedRow, setSelectedRow] = useState<number | null>(null);

//   const columns: TableColumn<DataRow>[] = [
//     {
//       name: "Title",
//       selector: (row) => row.id,
//       cell: (row) => <span data-tag="allowRowEvents">Click me {row.id}</span>,
//     },
//     {
//       name: "Director",
//       selector: (row) => row.title,
//     },
//     {
//       name: "Year",
//       selector: (row) => row.year,
//     },
//   ];

//   const data = [
//     {
//       id: 1,
//       title: "Beetlejuice",
//       year: "1988",
//     },
//     {
//       id: 2,
//       title: "Ghostbusters",
//       year: "1984",
//     },
//   ];

//   const onRowClicked = (
//     row: DataRow,
//     e: MouseEvent<Element, globalThis.MouseEvent>
//   ) => {
//     setSelectedRow(row.id);
//   };

//   const conditionalRowStyles = [
//     {
//       when: (row: DataRow) => row.id === selectedRow,
//       style: {
//         backgroundColor: "green",
//         color: "white",
//         "&:hover": {
//           cursor: "pointer",
//         },
//       },
//     },
//   ];

//   return (
//     <>
//       <DataTable
//         columns={columns}
//         data={data}
//         onRowClicked={onRowClicked}
//         conditionalRowStyles={conditionalRowStyles}
//       />
//       <p>{selectedRow}</p>
//     </>
//   );
// }

function formatTime(date: Date) {
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;

  // elapsed
  const ms = Date.now() - date.getTime();

  if (ms < ONE_MINUTE) {
    return "now";
  } else if (ms < ONE_HOUR) {
    const minutes = Math.floor(ms / ONE_MINUTE);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  } else if (ms < ONE_DAY) {
    const hours = Math.floor(ms / ONE_HOUR);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  } else {
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

function truncateString(str: string, maxLength: number) {
  if (str.length > maxLength) {
    return str.substring(0, maxLength - 3) + "...";
  } else {
    return str;
  }
}

// WORST CASE SCENARIO WHEN TAILWIND DOES NOT LOAD STYLES
function TailwindBugFix() {
  return (
    <div>
      <div className="bg-good"></div>
      <div className="bg-neutral"></div>
      <div className="bg-bad"></div>
    </div>
  );
}
