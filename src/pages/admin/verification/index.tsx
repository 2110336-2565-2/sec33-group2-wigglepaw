import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Header from "../../../components/Header";
import { UserType } from "../../../types/user";
import { api } from "../../../utils/api";
import Notification from "../../../components/Admin/Notification";
import SideTab from "../../../components/SideTab";
import { ApprovalRequestStatus } from "@prisma/client";

export default function Verification() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <SideTab admin />
        <div className="my-5 flex w-full flex-col gap-5">
          <Notification
            code={parseInt(router.query.code as string)}
            notice={router.query.notice as string}
            className="mx-9"
          />
          <div className="overflow-scroll px-6 text-base">
            <PetSitterVerifyTable />
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
  type: "Freelance" | "Hotel";
  certificationUri: string | null;
  lastUpdate: string | null;
  lastUpdateTime: number;
  status: "Pending" | "Declined" | "Approved";
}

function PetSitterVerifyTable() {
  // ctx
  const utils = api.useContext();

  // router
  const router = useRouter();

  // query
  const approvalRequests = api.approvalRequest.getAll.useQuery();
  const verifyPetSitters = api.petSitter.verifyMany.useMutation({
    async onSettled() {
      utils.user.getAllForProfile.invalidate();
    },
  });

  // react hooks
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  // table title
  const Title = (
    <h1 className="text-3xl font-semibold md:text-4xl">
      Pet Sitter Verification
    </h1>
  );

  // available data
  const data: DataRow[] = approvalRequests.data
    ? approvalRequests.data.map((approvalRequest: any) => {
        const petSitter = approvalRequest.petSitter;
        const lastUpdate = new Date(approvalRequest.latestStatusUpdateAt);
        return {
          userId: petSitter.user.userId as string,
          username: petSitter.user.username as string,
          imageUri: petSitter.user.imageUri as string,
          fullName: petSitter.freelancePetSitter
            ? `${petSitter.freelancePetSitter.firstName} ${petSitter.freelancePetSitter.lastName}`
            : null,
          hotelName: petSitter.petHotel ? petSitter.petHotel.hotelName : null,
          type: petSitter.freelancePetSitter ? "Freelance" : "Hotel",
          certificationUri:
            petSitter.freelancePetSitter || petSitter.petHotel
              ? petSitter.certificationUri
              : null,
          lastUpdate: formatTime(lastUpdate),
          lastUpdateTime: lastUpdate.getTime(),
          status:
            approvalRequest.status === ApprovalRequestStatus.approved
              ? "Approved"
              : approvalRequest.status === ApprovalRequestStatus.declined
              ? "Declined"
              : "Pending",
        };
      })
    : [];

  // filter data
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredData = data.filter((row: DataRow) =>
    // row.fullName &&
    // row.fullName.toLowerCase().includes(filterText.toLowerCase())
    filterText
      .toLowerCase()
      .split(/\s+/)
      .every(
        (word) =>
          row.fullName?.toLowerCase().includes(word) ||
          row.hotelName?.toLowerCase().includes(word) ||
          row.username?.toLowerCase().includes(word) ||
          row.type.toLowerCase().includes(word) ||
          row.certificationUri?.toLowerCase().includes(word) ||
          row.lastUpdate?.toLowerCase().includes(word) ||
          row.status?.toLowerCase().includes(word)
      )
  );

  // filter component (subheader)
  const SubHeaderComponent = (
    <div className="relative mt-2 flex items-center">
      <label className="mr-2">Filter</label>
      <input
        className="peer w-[200px] rounded-md border-2 p-1.5 px-2 text-[16px] text-[#434D54] focus:border-[#80bdff] focus:shadow-[0_0_0_0.2rem_rgba(0,123,255,.25)] focus:outline-none"
        value={filterText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilterText(e.target.value)
        }
      />
      <div className="absolute right-[2px] z-10 hidden h-[80%] bg-white pr-1 hover:flex hover:items-center first:hover:flex first:hover:items-center peer-hover:flex peer-hover:items-center">
        <button
          className="rounded-md text-[#434D54] hover:bg-[#434D54]/[.4] hover:text-white"
          onClick={() => setFilterText("")}
        >
          <svg
            viewBox="0 0 512 512"
            fill="currentColor"
            height="18px"
            width="18px"
          >
            <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z" />
          </svg>
        </button>
      </div>
    </div>
  );

  // columns to show
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Pet Sitter",
      selector: (row) =>
        row.type === "Freelance" ? row.fullName || "" : row.hotelName || "",
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
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
      selector: (row) => row.type,
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div
            className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold ${
              row.type === "Freelance" ? "text-freelance" : "text-hotel"
            } `}
          >
            {row.type === "Freelance" ? "Freelance" : "Hotel"}
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
        <div
          data-tag="allowRowEvents"
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]"
        >
          <Link href={row.certificationUri || ""} className="link">
            {(row.certificationUri || "none").replace(
              /^(https?:\/\/)?(www\.)?/i,
              ""
            )}
          </Link>
        </div>
      ),
      width: "20%",
      sortable: true,
    },
    {
      name: "Last update",
      selector: (row) => row.lastUpdateTime,
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] text-wp-blue">
            {row.lastUpdate}
          </div>
        </RecursivePropsProvider>
      ),
      width: "22.5%",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "",
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div
            className={`flex h-[28px] w-[108px] items-center justify-center rounded-lg text-[18px] font-semibold text-white drop-shadow-md ${
              row.status === "Approved"
                ? "bg-good"
                : row.status === "Declined"
                ? "bg-bad"
                : "bg-neutral"
            }`}
          >
            {row.status}
          </div>
        </RecursivePropsProvider>
      ),
      width: "15%",
      sortable: true,
    },
  ];

  // styles
  const customStyles = {
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
  };

  // conditional styles
  const conditionalRowStyles = [
    {
      when: (row: DataRow) => row.status === "Pending",
      style: {
        cursor: "help",
      },
    },
  ];

  // selectable rows
  interface handleChangeProps {
    selectedRows: DataRow[];
  }
  const handleSelectedRowChange = ({ selectedRows }: handleChangeProps) => {
    setSelectedRows(selectedRows);
  };

  const rowDisabledCriteria = (row: DataRow) => row.status !== "Pending";

  const onRowClicked = (row: DataRow) => {
    if (row.status === "Pending")
      router.push(`/admin/verification/${row.username}`);
  };

  // manage selected rows
  const ContextActions = (
    <button
      className="mr-2 rounded-lg px-4 py-2 font-semibold text-wp-blue hover:bg-white/[0.5]"
      onClick={async () => {
        // alert(JSON.stringify(selectedRows.map((row) => row.userId)));
        await verifyPetSitters.mutateAsync({
          userIds: selectedRows.map((row) => row.userId),
        });
        setToggleClearRows((prev) => !prev);
      }}
    >
      Verify
    </button>
  );

  return (
    <DataTable
      keyField="username"
      title={Title}
      data={filteredData}
      subHeader
      subHeaderComponent={SubHeaderComponent}
      columns={columns}
      customStyles={customStyles}
      conditionalRowStyles={conditionalRowStyles}
      onRowClicked={onRowClicked}
      selectableRows
      onSelectedRowsChange={handleSelectedRowChange}
      selectableRowDisabled={rowDisabledCriteria}
      clearSelectedRows={toggledClearRows}
      contextMessage={{
        singular: "pet sitter",
        plural: "pet sitters",
        message: "selected",
      }}
      contextActions={ContextActions}
      // contextComponent={}
      // selectableRowsComponent={}
      progressPending={approvalRequests.isLoading}
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
interface RecursivePropsProviderProps
  extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
}
const RecursivePropsProvider = ({
  children,
  ...props
}: RecursivePropsProviderProps) => {
  function cloneChildren(children: ReactNode): ReactNode {
    return React.Children.map(children, (child: ReactNode) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      const childProps = { ...child.props, ...props };

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
