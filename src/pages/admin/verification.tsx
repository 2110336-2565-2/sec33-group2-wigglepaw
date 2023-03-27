import { PetSitter } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import DataTable, {
  TableColumn,
  ConditionalStyles,
} from "react-data-table-component";
import { HiCheck } from "react-icons/hi";
import { string } from "zod";
import FixedHeader from "../../components/FixedHeader";
import { UserType } from "../../types/user";
import { api } from "../../utils/api";
import ReactDOMServer from "react-dom/server";

export default function Verification() {
  return (
    <div className="flex h-screen flex-col">
      <FixedHeader />
      <div className="flex flex-grow">
        <div className="flex h-full w-[200px] border-2 max-lg:hidden">
          Please connect sidetab given I am done with my life.
        </div>
        <div className="w-full overflow-scroll sm:px-[20px] sm:py-[10px] lg:px-[40px] lg:py-[20px] xl:px-[80px] xl:py-[40px]">
          <div className="h-full flex-grow">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}

// DATATABLE
interface DataRow {
  userId: string;
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
  // ctx
  const utils = api.useContext();

  // router
  const router = useRouter();

  // query
  const users = api.user.getAllForProfile.useQuery();
  const verifyPetSitters = api.petSitter.verifyMany.useMutation({
    async onSettled() {
      utils.user.getAllForProfile.invalidate();
    },
  });

  // react hooks
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  const data: DataRow[] = users.data
    ? users.data
        .filter(
          (user) =>
            user &&
            (user.userType === UserType.FreelancePetSitter ||
              user.userType === UserType.PetHotel)
        )
        .map((petSitter) => ({
          userId: petSitter.userId,
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
          lastUpdate: new Date(Date.now() - 86400100),
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
        <RecursivePropsProvider
          additionalProps={{ "data-tag": "allowRowEvents" }}
        >
          <div className="flex h-[60px] w-full items-center gap-2">
            <div className="relative min-h-[40px] min-w-[40px] rounded-full border border-black drop-shadow-md">
              <Image
                src={row.imageUri || "/profiledummy.png"}
                alt=""
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex w-[80%] flex-col">
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]">
                {row.fullName || row.hotelName}
              </div>
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] text-wp-blue">
                #{row.username}
              </div>
            </div>
          </div>
        </RecursivePropsProvider>
      ),
      width: "25%",
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) =>
        row.type === UserType.FreelancePetSitter ? "Freelance" : "Hotel",
      cell: (row) => (
        <RecursivePropsProvider
          additionalProps={{ "data-tag": "allowRowEvents" }}
        >
          <div
            className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold ${
              row.type === UserType.FreelancePetSitter
                ? "text-freelance"
                : "text-hotel"
            } `}
          >
            {row.type === UserType.FreelancePetSitter ? "Freelance" : "Hotel"}
          </div>
        </RecursivePropsProvider>
      ),
      width: "12.5%",
      sortable: true,
    },
    {
      name: "Certification URI",
      selector: (row) => row.certificationUri || "",
      cell: (row) => (
        <RecursivePropsProvider
          additionalProps={{ "data-tag": "allowRowEvents" }}
        >
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]">
            <Link href={row.certificationUri || ""} className="link">
              {(row.certificationUri || "none").replace(
                /^(https?:\/\/)?(www\.)?/i,
                ""
              )}
            </Link>
          </div>
        </RecursivePropsProvider>
      ),
      width: "20%",
      sortable: true,
    },
    {
      name: "Last update",
      selector: (row) => row.lastUpdate.toISOString(),
      cell: (row) => (
        <RecursivePropsProvider
          additionalProps={{ "data-tag": "allowRowEvents" }}
        >
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] text-wp-blue">
            {formatTime(row.lastUpdate)}
          </div>
        </RecursivePropsProvider>
      ),
      width: "22.5%",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status ? "Verified" : "Pending"),
      cell: (row) => (
        <RecursivePropsProvider
          additionalProps={{ "data-tag": "allowRowEvents" }}
        >
          <div
            className={`flex h-[28px] w-[100px] items-center justify-center rounded-lg text-[18px] font-semibold text-white drop-shadow-md ${
              row.status ? "bg-good" : "bg-neutral"
            }`}
          >
            {row.status ? "Verified" : "Pending"}
          </div>
        </RecursivePropsProvider>
      ),
      width: "15%",
      sortable: true,
    },
  ];

  const customStyles = {
    // rows: {
    //   style: {
    //     //
    //     "&:hover": {
    //       backgroundColor: "#f0f0f0",
    //     },
    //   },
    // },
    headCells: {
      style: {
        height: "60px",
        fontSize: "20px",
        fontWeight: 600,
      },
    },
    pagination: {
      style: {
        height: "60px",
        fontSize: "18px",
        fontWeight: 600,
      },
    },
    // cells: {
    //   style: {
    //     // fontSize: "18px",
    //   },
    // },
  };

  const conditionalRowStyles = [
    {
      when: (row: DataRow) => !row.status,
      style: {
        cursor: "help",
      },
    },
  ];

  interface handleChangeProps {
    selectedRows: DataRow[];
  }
  const handleChange = ({ selectedRows }: handleChangeProps) => {
    setSelectedRows(selectedRows);
  };

  const rowDisabledCriteria = (row: DataRow) => row.status;

  const onRowClicked = (row: DataRow) => {
    if (!row.status) router.push(`/admin/verification/${row.username}`);
  };

  return (
    <DataTable
      title={
        <h2 className="mb-[20px] text-[40px] font-semibold">
          Pet Sitter Verification
        </h2>
      }
      keyField="username"
      columns={columns}
      data={data}
      customStyles={customStyles}
      conditionalRowStyles={conditionalRowStyles}
      onRowClicked={onRowClicked}
      selectableRows
      onSelectedRowsChange={handleChange}
      selectableRowDisabled={rowDisabledCriteria}
      clearSelectedRows={toggledClearRows}
      contextMessage={{
        singular: "pet sitter",
        plural: "pet sitters",
        message: "selected",
      }}
      contextActions={
        <button
          className="mr-4 rounded-lg bg-wp-blue px-4 py-2 font-semibold text-white hover:bg-wp-light-blue"
          onClick={async () => {
            // alert(JSON.stringify(selectedRows.map((row) => row.userId)));
            await verifyPetSitters.mutateAsync({
              userIds: selectedRows.map((row) => row.userId),
            });
            setToggleClearRows((prev) => !prev);
          }}
        >
          Verify all
        </button>
      }
      // contextComponent={}
      // selectableRowsComponent={}
      progressPending={users.isLoading}
      progressComponent={<>DOG DOG DOG DOG is loading bro...</>}
      striped
      highlightOnHover
      pagination
      responsive
    />
  );
}

// LMAO THANKS TO CHATGPT
// Add this function to add row event propagation to cell components
interface RecursivePropsProviderProps {
  additionalProps: Object;
  children: ReactNode;
}
const RecursivePropsProvider = ({
  additionalProps,
  children,
}: RecursivePropsProviderProps) => {
  function cloneChildren(children: ReactNode): ReactNode {
    return React.Children.map(children, (child: ReactNode) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const childProps = { ...child.props, ...additionalProps };

      if (child.props.children) {
        childProps.children = cloneChildren(child.props.children);
      }

      return React.cloneElement(child as React.ReactElement, childProps);
    });
  }

  return <>{cloneChildren(children)}</>;
};

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
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if (date >= yesterday) {
      return `Yesterday, ${date.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
        hour12: true,
      })}`;
    } else {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: undefined,
        hour12: true,
      });
    }
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
