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
  const session = useSession();
  const router = useRouter();

  if (session.data?.user?.userType !== UserType.Admin)
    return <Error statusCode={404} />;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow">
        <SideTab admin />
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
  reporterUsername: string;
  reporterFullname: string;
  imageUri: string | null | undefined;
  title: string;
  status: ReportTicketStatus;
}

function ContentDataTable() {
  const session = useSession();
  // ctx
  const utils = api.useContext();

  // router
  const router = useRouter();

  // query
  // TODO: extract
  const reportTickets = api.reportTicket.getAll.useQuery();

  // table title
  const Title = (
    <h1 className="text-3xl font-semibold md:text-4xl">User Reports</h1>
  );

  // available data
  // filter only posts that are unacked or acked by this admin
  // extract only some important fields
  console.log("id: ", session.data?.user?.userId);
  const data: DataRow[] = reportTickets.data
    ? reportTickets.data
        .filter(
          (r) =>
            r.status === ReportTicketStatus.pending ||
            r.adminId === session.data?.user?.userId
        )
        .map((reportTicket) => ({
          ticketId: reportTicket.ticketId,
          userId: reportTicket.reporterId,
          reporterUsername: reportTicket.reporter.username,
          imageUri: reportTicket.reporter.imageUri,
          reporterFullname: "FirstName LastName", // TODO: fix this
          title: reportTicket.title,

          status: reportTicket.status,
        }))
    : [];

  // columns to show
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Reporter",
      selector: (row) => row.reporterFullname || "",
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
                {row.reporterFullname}
              </div>
              <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[16px] text-wp-blue">
                #{row.reporterUsername}
              </div>
            </div>
          </div>
        </RecursivePropsProvider>
      ),
      width: "25%",
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
      width: "60%",
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
    await router.push(`/admin/report/${row.ticketId}`);
  };

  return (
    <DataTable
      keyField="username"
      title={Title}
      data={data}
      columns={columns}
      defaultSortFieldId={4}
      defaultSortAsc={false}
      customStyles={customStyles}
      onRowClicked={onRowClicked}
      contextMessage={{
        singular: "report",
        plural: "reports",
        message: "selected",
      }}
      // contextComponent={}
      // selectableRowsComponent={}
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

  if (!session || !session.user || session.user.userType !== UserType.Admin) {
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
