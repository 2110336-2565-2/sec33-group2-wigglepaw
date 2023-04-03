import { PetSitter, ReviewStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactNode, useState } from "react";
import DataTable, {
  TableColumn,
  ConditionalStyles,
} from "react-data-table-component";
import { HiCheck, HiMenuAlt1 } from "react-icons/hi";
import { string } from "zod";
import FixedHeader from "../../../components/Header";
import { UserType } from "../../../types/user";
import { api } from "../../../utils/api";
import ReactDOMServer from "react-dom/server";
import Notification from "../../../components/Admin/Notification";
import { title } from "process";
import AdminSideTab from "../../../components/AdminSideTab";
export default function Verification() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col">
      <FixedHeader />
      <div className="flex flex-grow">
        <div className="flex h-full w-[200px] border-2 max-lg:hidden">
          <AdminSideTab />
        </div>
        <div className="flex w-full flex-col gap-5 overflow-scroll sm:px-[20px] sm:py-[10px] lg:px-[40px] lg:py-[20px] xl:px-[80px] xl:py-[40px]">
          <Notification
            code={parseInt(router.query.code as string)}
            notice={router.query.notice as string}
            className="mx-4"
          />
          <div className="h-full flex-grow text-[18px]">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}
// DATATABLE
interface DataRow {
  petOwnerId: string; //PetOwner
  petOwnerUsername: string;
  petOwnerImageUri: string | null | undefined;
  petOwnerFullName: string | null;
  rating: number;
  review: string | null;
  reviewId: string;
  reviewDate: Date;
  lastUpdate: string | null;
  lastUpdateTime: number;
  status: ReviewStatus;
}

function Table() {
  // ctx
  const utils = api.useContext();

  // router
  const router = useRouter();

  // query
  const review = api.review.getAllReport.useQuery();
  //const users = api.user.getAllForProfile.useQuery();
  /*const verifyPetSitters = api.petSitter.verifyMany.useMutation({
    async onSettled() {
      utils.user.getAllForProfile.invalidate();
    },
  });*/

  // react hooks
  const [selectedRows, setSelectedRows] = useState<DataRow[]>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);

  // table title
  const Title = (
    <h1 className="text-[40px] font-semibold">Pet Sitter Verification</h1>
  );

  // available data
  const data: DataRow[] = review.data
    ? review.data.map((review) => ({
        petOwnerId: review.petOwnerId,
        petOwnerUsername: review.petOwner.user.username,
        petOwnerImageUri: review.petOwner.user.imageUri,
        petOwnerFullName: `${review.petOwner.firstName} ${review.petOwner.lastName}`,
        rating: review.rating,
        review: review.text,
        reviewId: review.reviewId,
        reviewDate: review.createdAt,
        lastUpdate: formatTime(new Date(Date.now() - 86400100)), // dummy
        lastUpdateTime: Date.now() - 86400100, // dummy
        status: review.status,
      }))
    : [];

  // filter data
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  // filter component (subheader)
  const SubHeaderComponent = (
    <div className="relative mt-[10px] flex items-center">
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
      name: "Pet Owner",
      selector: (row) => row.petOwnerFullName || "",
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div className="flex h-[60px] w-full items-center gap-2">
            <div className="relative min-h-[40px] min-w-[40px] rounded-full border border-black drop-shadow-md">
              <Image
                src={row.petOwnerImageUri || "/profiledummy.png"}
                alt=""
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex w-[80%] flex-col">
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]">
                {row.petOwnerFullName}
              </div>
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] text-wp-blue">
                #{row.petOwnerUsername}
              </div>
            </div>
          </div>
        </RecursivePropsProvider>
      ),
      width: "25%",
      sortable: true,
    },
    {
      name: "Rating",
      selector: (row) => row.rating,
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold">
            {row.rating}
          </div>
        </RecursivePropsProvider>
      ),
      width: "12.5%",
      sortable: true,
    },
    {
      name: "Review",
      selector: (row) => row.review || "",
      cell: (row) => (
        <div
          data-tag="allowRowEvents"
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px]"
        >
          <div>{row.review}</div>
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
            className={`flex h-[28px] w-[100px] items-center justify-center rounded-lg text-[18px] font-semibold text-white drop-shadow-md ${
              row.status === ReviewStatus.resolved ? "bg-good" : "bg-neutral"
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
      when: (row: DataRow) => row.status === ReviewStatus.pending,
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

  const rowDisabledCriteria = (row: DataRow) =>
    row.status === ReviewStatus.resolved;

  const onRowClicked = (row: DataRow) => {
    if (row.status === ReviewStatus.pending)
      router.push(`/admin/verification/${row.reviewId}`);
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
      data={data}
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
      progressPending={review.isLoading}
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
