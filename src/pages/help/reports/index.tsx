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
import { ApprovalRequestStatus, ReportTicketStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../../server/auth";

export default function DatatableIndex() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        <SideTab help />
        <div className="my-5 flex w-full flex-col gap-5">
          <Notification
            code={parseInt(router.query.code as string)}
            notice={router.query.notice as string}
            className="mx-9"
          />
          <div className="overflow-scroll px-6 text-base">
            <ContentDataTable />
          </div>
        </div>
      </div>
    </div>
  );
}

// DATATABLE
interface DataRow {
  ticketId: string;
  userId: string; // reporter
  title: string;
  status: ReportTicketStatus;
  description: string;
  createdAt: string | null;
}

function ContentDataTable() {
  const session = useSession();
  // ctx
  const utils = api.useContext();

  // router
  const router = useRouter();

  // query
  const reportTickets = api.reportTicket.getByUserId.useQuery({
    userId:
      typeof session.data?.user?.userId === "string"
        ? session.data?.user?.userId
        : "",
  });

  // table title
  const Title = (
    <h1 className="text-3xl font-semibold md:text-4xl">My Reports</h1>
  );

  // available data
  // filter only posts that are unacked or acked by this admin
  // extract only some important fields
  console.log("id: ", session.data?.user?.userId);
  const data: DataRow[] = reportTickets.data
    ? reportTickets.data.map((reportTicket) => ({
        ticketId: reportTicket.ticketId,
        userId: reportTicket.reporterId,
        title: reportTicket.title,
        description: reportTicket.description,
        status: reportTicket.status,
        createdAt: formatTime(new Date(reportTicket.createdAt)),
      }))
    : [];

  // columns to show
  const columns: TableColumn<DataRow>[] = [
    {
      name: "CreatedAt",
      selector: (row) => (row.createdAt ? row.createdAt : ""),
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div
            className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold `}
          >
            {row.createdAt}
          </div>
        </RecursivePropsProvider>
      ),
      width: "15%",
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title || "",
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div
            className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold `}
          >
            {row.title}
          </div>
        </RecursivePropsProvider>
      ),
      width: "20%",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.title || "",
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div
            className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-semibold text-gray-500`}
          >
            {row.description}
          </div>
        </RecursivePropsProvider>
      ),
      width: "50%",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "",
      cell: (row) => (
        <RecursivePropsProvider data-tag="allowRowEvents">
          <div
            className={`flex h-[28px] w-[108px] items-center justify-center rounded-lg text-[18px] font-semibold text-white drop-shadow-md ${
              row.status === ReportTicketStatus.acked
                ? "bg-datatable_acked"
                : row.status === ReportTicketStatus.pending
                ? "bg-datatable_pending"
                : row.status === ReportTicketStatus.canceled
                ? "bg-datatable_rejected"
                : "bg-datatable_resolved"
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

  // selectable rows
  interface handleChangeProps {
    selectedRows: DataRow[];
  }
  const handleSelectedRowChange = ({ selectedRows }: handleChangeProps) => {
    setSelectedRows(selectedRows);
  };

  const onRowClicked = async (row: DataRow) => {
    await router.push(`/help/reports/${row.ticketId}`);
  };

  return (
    <DataTable
      keyField="username"
      title={Title}
      data={data}
      columns={columns}
      defaultSortAsc={false}
      customStyles={customStyles}
      onRowClicked={onRowClicked}
      contextMessage={{
        singular: "report",
        plural: "reports",
        message: "selected",
      }}
      progressPending={reportTickets.isLoading}
      progressComponent={<>DOG DOG DOG DOG is loading bro...</>}
      striped
      highlightOnHover
      pagination
      responsive
    />
  );
}

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log("in server side props woiiii");

  if (!session || !session.user) {
    console.log("redirecting wooooooiiii");

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  console.log("normally render pagee no redirect woiii");

  return {
    props: { session }, // prefetched session on the serverside, no loading on the front
  };
};
