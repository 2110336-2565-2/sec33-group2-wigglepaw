import { ReportTicket } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { FunctionComponent } from "react";
import Header from "../../components/Header";
import SideTab from "../../components/SideTab";
import { UserType } from "../../types/user";
import { api } from "../../utils/api";

const Dashboard = () => {
  const { data: session } = useSession();
  // convert all the queries into a unified format for TableDisplay Component

  // query the verification
  const { data: queryVerifications, isLoading: verificationsIsLoading } =
    api.user.getAllForProfile.useQuery();
  const verifications = queryVerifications?.slice(0, 5).map((obj) => {
    return {
      firstField:
        obj.userType === UserType.FreelancePetSitter
          ? `${obj.firstName} ${obj.lastName}`
          : obj.userType === UserType.PetHotel
          ? obj.hotelName
          : "No name",
      id: obj.userId,
      status:
        (obj.userType === UserType.FreelancePetSitter ||
          obj.userType === UserType.PetHotel) &&
        obj.verifyStatus
          ? "Verified"
          : "Pending",
    };
  });

  // query the reportTickets
  const { data: queryReports, isLoading: reportIsLoading } =
    api.reportTicket.getAll.useQuery();
  const reports = queryReports?.slice(0, 5).map((obj) => {
    return {
      firstField: obj.title,
      id: obj.ticketId,
      status: obj.status,
    };
  });

  // query the reviews
  const { data: queryReviews, isLoading: reviewsIsLoading } =
    api.review.getAllReport.useQuery();
  const reviews = queryReviews?.slice(0, 5).map((obj) => {
    return {
      firstField: obj.text,
      id: obj.reviewId,
      status: obj.status,
    };
  });

  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex gap-4">
        <SideTab admin />
        <div id="main-wrapper" className="my-5 flex flex-col gap-5 px-6">
          <h1 className="text-3xl font-semibold md:text-4xl">Dashboard</h1>
          <TableDisplay
            linkTo={"/admin/verification"}
            dataRows={verifications}
            isLoading={verificationsIsLoading}
            tableTitle={"Pet Sitter Verification"}
          />
          <div id="review-report-flex-wrapper" className="flex gap-4">
            <TableDisplay
              linkTo={"/admin/review"}
              dataRows={reviews}
              isLoading={reviewsIsLoading}
              tableTitle={"Review Moderation"}
            />
            <TableDisplay
              linkTo={"/admin/report"}
              dataRows={reports}
              isLoading={reportIsLoading}
              tableTitle={"User Reports"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TableDisplay = ({ linkTo, dataRows, isLoading, tableTitle }) => {
  return (
    <div className="rounded-md border p-4 shadow-md">
      <Link href={linkTo}>
        <p className="mb-4 text-xl font-bold hover:underline">{tableTitle}</p>
      </Link>
      <ul className="">
        {isLoading && <>Loading</>}
        {!isLoading &&
          (dataRows?.length !== 0 ? (
            dataRows?.map(
              (dataRow: any /* FIXME: fix this to generic type */, idx) => {
                let liClassName =
                  "flex w-full items-center justify-between px-3 py-0.5 hover:bg-slate-300 duration-150 ";
                if (idx === 0) {
                  liClassName += "rounded-t-md border-t border-l border-r ";
                } else if (idx === dataRows?.length - 1) {
                  liClassName += "rounded-b-md border-b border-l border-r ";
                } else {
                  liClassName += "border ";
                }

                if (idx % 2 == 1) {
                  liClassName += "bg-[#f0f0f0] ";
                }
                return (
                  <Link
                    href={`${linkTo}/${dataRow.id}`}
                    key={dataRow.id}
                    className={liClassName}
                  >
                    <p className="float-left h-full ">{dataRow.firstField}</p>
                    <StatusDisplay status={dataRow.status} />
                  </Link>
                );
              }
            )
          ) : (
            <>No Data</>
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

export default Dashboard;
