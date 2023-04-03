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
  const verifications = queryVerifications
    ?.filter((obj) => {
      return (
        obj.userType === UserType.FreelancePetSitter ||
        obj.userType === UserType.PetHotel
      );
    })
    .slice(0, 5)
    .map((obj, idx) => {
      let firstField;
      if (obj.userType === UserType.FreelancePetSitter)
        firstField = `${obj.firstName} ${obj.lastName}`;
      else if (obj.userType === UserType.PetHotel) firstField = obj.hotelName;
      else firstField = "nani!";
      return {
        firstField: firstField,
        id: obj.userId,
        status:
          (obj.userType === UserType.FreelancePetSitter ||
            obj.userType === UserType.PetHotel) &&
          obj.verifyStatus
            ? "verified"
            : "pending",
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
      <div className="flex h-screen gap-4">
        <SideTab admin />
        <div id="main-wrapper" className="my-5 flex w-full flex-col gap-5 px-6">
          <h1 className="text-3xl font-semibold md:text-4xl">Dashboard</h1>
          <TableDisplay
            linkTo={"/admin/verification"}
            dataRows={verifications}
            isLoading={verificationsIsLoading}
            tableTitle={"Pet Sitter Verification"}
            fill={true}
          />
          <div id="review-report-flex-wrapper" className="flex gap-4">
            <TableDisplay
              linkTo={"/admin/reviews"}
              dataRows={reviews}
              isLoading={reviewsIsLoading}
              tableTitle={"Review Moderation"}
              fill={false}
            />
            <TableDisplay
              linkTo={"/admin/report"}
              dataRows={reports}
              isLoading={reportIsLoading}
              tableTitle={"User Reports"}
              fill={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TableDisplay = ({ linkTo, dataRows, isLoading, tableTitle, fill }) => {
  let wrapperClassName = "rounded-md border p-4 shadow-md ";
  if (fill) {
    wrapperClassName += "w-full ";
  } else {
    wrapperClassName += "flex-grow ";
  }
  return (
    <div className={wrapperClassName}>
      <Link href={linkTo}>
        <p className="mb-4 text-xl font-bold hover:underline">{tableTitle}</p>
      </Link>
      <ul className="">
        {isLoading && <>Loading</>}
        {!isLoading &&
          (dataRows?.length !== 0 ? (
            <>
              {dataRows?.map(
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
              )}
              <Link
                href={linkTo}
                className="ml-1 mt-2 inline-block text-[#B3B3B3] hover:text-[#7f7f7f]"
              >
                show more ...
              </Link>
            </>
          ) : (
            <>No Data</>
          ))}
      </ul>
    </div>
  );
};

const StatusDisplay = (props: any) => {
  const classname =
    "text-white rounded-lg p-0.5 w-[6.5rem] whitespace-nowrap text-center";
  switch (props.status) {
    case "pending":
      return <p className={classname + " bg-datatable_pending"}>Pending</p>;
    case "acked":
      return <p className={classname + " bg-datatable_acked"}>In Progress</p>;
    case "canceled":
      return <p className={classname + " bg-datatable_rejected"}>Canceled</p>;
    case "resolved":
      return <p className={classname + " bg-datatable_resolved"}>Resolved</p>;
    case "verified":
      return <p className={classname + " bg-datatable_resolved"}>Verified</p>;
    default:
      return <p className={classname + "bg-gray-600"}>{props.status}</p>;
  }
};

export default Dashboard;
