import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import SideTab from "../../../components/SideTab";
import { api } from "../../../utils/api";

const ReportHome = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <SideTab help />
        <div className="my-5 w-full gap-5">
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
    <div>
      Report Table
      <ul>
        {isLoading && <>Loading</>}
        {!isLoading && reports?.length === 0 && <>No Reports</>}
        {!isLoading &&
          reports &&
          reports.map((report) => {
            return (
              <Link
                href={`/admin/report/${report.ticketId}`}
                key={report.ticketId}
              >
                <li className="flex gap-1 border">
                  <p>{report.title}</p>
                  <p>{report.status}</p>
                </li>
              </Link>
            );
          })}
      </ul>
    </div>
  );
};

export default ReportHome;
