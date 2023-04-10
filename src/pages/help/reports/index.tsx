import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import SideTab from "../../../components/SideTab";
import { api } from "../../../utils/api";
import { ReportTicket } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { getServerAuthSession } from "../../../server/auth";

const ReportHome = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <SideTab help />
        <div className="content-with-sidetab my-5 w-full gap-5">
          <div className="overflow-scroll px-6 text-base">
            <ReportsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportsTable = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.reportTicket.getByUserId.useQuery({
    userId: typeof session?.user?.id === "string" ? session?.user?.id : "",
  });
  const reports = data;

  return (
    <div className="min-h-screen">
      <p className="mb-4 text-2xl font-bold">My Reports</p>
      <ul>
        {isLoading && <>Loading</>}
        {!isLoading &&
          (reports?.length !== 0 ? (
            reports?.map((report: any) => {
              return (
                <Link
                  href={`/help/reports/${report.ticketId}`}
                  key={report.ticketId}
                  className="flex w-full items-center justify-between border px-3 py-2"
                >
                  <p className="float-left h-full">{report.title}</p>
                  <StatusDisplay status={report.status} />
                </Link>
              );
            })
          ) : (
            <>No Reports</>
          ))}
      </ul>
    </div>
  );
};

const StatusDisplay = (props: any) => {
  const classname =
    "text-white rounded-lg p-1 w-[6.5rem] whitespace-nowrap text-center";
  switch (props.status) {
    case "pending":
      return <p className={classname + " bg-yellow-400"}>Pending</p>;
    case "acked":
      return <p className={classname + " bg-orange-400"}>In Progress</p>;
    case "canceled":
      return <p className={classname + " bg-red-400"}>Canceled</p>;
    case "resolved":
      return <p className={classname + " bg-green-400"}>Resolved</p>;
    default:
      return <p className={classname + "bg-gray-600"}>{props.status}</p>;
  }
};

export default ReportHome;

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
