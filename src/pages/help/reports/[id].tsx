import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "../../../components/Header";
import { api } from "../../../utils/api";
import { ReportTicket } from "@prisma/client";

const ReportPage = () => {
  const router = useRouter();
  const { id: ticketId } = router.query;

  // there are two tricks going on here
  // 1. we use a type-guard fallback to check solve the error:
  // ```
  //  Type 'string | string[] | undefined' is not assignable to type 'string'.
  //  Type 'undefined' is not assignable to type 'string'.ts(2322)
  // ```
  //
  // 2. we prevent the premature query error from the browser:
  // TRPCClientError: [
  //   {
  //     "validation": "cuid",
  //     "code": "invalid_string",
  //     "message": "Invalid cuid",
  //     "path": [
  //       "ticketId"
  //     ]
  //   }
  // ]
  //
  // by setting the enabled option to be true only if the ticketId value is not undefined, that is it's supplied from next's router
  const { isLoading, data } = api.reportTicket.getByTicketId.useQuery(
    { ticketId: typeof ticketId === "string" ? ticketId : "" },
    {
      enabled: typeof ticketId === "string",
    }
  );

  // tmp
  if (isLoading) {
    return <>isLoading</>;
  } else {
    if (typeof data === "undefined" || data === null) {
      return <>typescript error ja</>;
    }

    const {
      status,
      title,
      ticketId,
      description,
      notes,
      createdAt,
      pictureUri,
      reporterId,
      username,
    } = data;

    console.log(data);

    return (
      <>
        <Header />
        <div className="m-5">
          <h1 className="text-[40px] text-[#213951]">Problem Report</h1>
          <div className=" border border-[#a3bad1] p-5">
            <div className="mb-6 flex">
              <div id="title-and-text-wrapper" className="mr-6 flex-1">
                {/* the report ticket id */}
                <ReportFieldStyle2 label={"Report Id"} text={ticketId} />

                {/* the report status */}
                <ReportFieldStyle2 label={"Status"} text={status} />

                {/* the reported user */}
                <ReportFieldStyle1
                  label={"User"}
                  user={{ name: username, id: reporterId }}
                />

                {/* the reported date */}
                <ReportFieldStyle2 label={"Date"} text={createdAt.toString()} />

                {/* the report title */}
                <ReportFieldStyle2 label={"Title"} text={title} />

                {/* the report text */}
                <ReportFieldStyle3 label={"Description"} text={description} />

                {/* admin comments if any */}
                {status !== "pending" && notes && (
                  <ReportFieldStyle3 label={"Admin Comment"} text={notes} />
                )}
              </div>

              <div id="image-upload-wrapper" className=" mr-4">
                <p className="text-lg text-slate-700">Problem Screenshot</p>
                <div className="relative flex h-48 w-48 justify-center rounded-sm border">
                  <Image
                    fill
                    alt="preview-report-problem"
                    className="object-cover"
                    src={
                      typeof pictureUri[0] === "string"
                        ? pictureUri[0]
                        : "/nomatch_saddog.png"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

const ReportFieldStyle1 = ({ label, user }) => {
  return (
    <div className="mb-2 flex">
      <p className="w-28 text-lg  text-slate-700">{label}</p>
      <div className="flex flex-1">
        <div id="image wrapper">
          <Image
            alt="sitter profile image"
            src={"/nomatch_saddog.png"}
            className="rounded-full border-2 border-[#213951cb]"
            width={45}
            height={45}
          />
        </div>
        <div className="ml-2 flex flex-1 flex-col">
          <p className="text-slate-400">{user.name}</p>
          <p className="text-slate-400">{user.id}</p>
        </div>
      </div>
    </div>
  );
};

const ReportFieldStyle2 = ({ label, text }) => {
  return (
    <div className="mb-2 flex">
      <p className="w-28 text-lg  text-slate-700">{label}</p>
      <div className="flex flex-1 flex-col">
        <div className="rounded-sm text-slate-400">{text}</div>
      </div>
    </div>
  );
};

const ReportFieldStyle3 = ({ label, text }) => {
  return (
    <div className="mb-2 flex">
      <p className="w-28 text-lg  text-slate-700">{label}</p>
      <div className="flex flex-1 flex-col">
        <div className="rounded-sm border border-[#dbdbdb] px-1 py-1 text-slate-400">
          {text}
        </div>
      </div>
    </div>
  );
};
export default ReportPage;
