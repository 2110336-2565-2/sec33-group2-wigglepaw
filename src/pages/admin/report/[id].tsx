import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Header from "../../../components/Header";
import { api } from "../../../utils/api";
import { ReportTicket } from "@prisma/client";
import { ReportTicketStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import SideTab from "../../../components/SideTab";

type AdminSubmitForm = { notes: string };

const AdminReportPage = () => {
  const router = useRouter();
  const { id: ticketId } = router.query;
  const { data: session } = useSession();

  // query
  const { isLoading, data } = api.reportTicket.getByTicketId.useQuery(
    { ticketId: typeof ticketId === "string" ? ticketId : "" },
    {
      enabled: typeof ticketId === "string",
    }
  );

  // admin comment forms
  const { register, handleSubmit } = useForm<AdminSubmitForm>();

  // mutations:
  // status changers Methods
  const utils = api.useContext();
  const ackMutation = api.reportTicket.ack.useMutation();
  const resolveMutation = api.reportTicket.resolve.useMutation();
  const rejectMutation = api.reportTicket.cancel.useMutation();

  const ackHandler = async () => {
    await ackMutation.mutateAsync({
      ticketId: typeof ticketId === "string" ? ticketId : "",
      adminId:
        typeof session?.user?.userId === "string" ? session?.user?.userId : "",
    });

    await utils.reportTicket.invalidate();
  };

  // use for reject or resolved the acked report
  const resolveHandler = async (data: AdminSubmitForm) => {
    await resolveMutation.mutateAsync({
      ticketId: typeof ticketId === "string" ? ticketId : "",
      adminId:
        typeof session?.user?.userId === "string" ? session?.user?.userId : "",
      notes: data.notes,
    });

    await utils.reportTicket.invalidate();
  };
  const rejectHandler = async (data: AdminSubmitForm) => {
    await rejectMutation.mutateAsync({
      ticketId: typeof ticketId === "string" ? ticketId : "",
      adminId:
        typeof session?.user?.userId === "string" ? session?.user?.userId : "",
      notes: data.notes,
    });

    await utils.reportTicket.invalidate();
  };

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
        <div className="flex">
          <SideTab admin />
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
                  <ReportFieldStyle2
                    label={"Date"}
                    text={createdAt.toString()}
                  />

                  {/* the report title */}
                  <ReportFieldStyle2 label={"Title"} text={title} />

                  {/* the report text */}
                  <ReportFieldStyle3 label={"Description"} text={description} />

                  {/* admin comments if any */}
                  {(status === ReportTicketStatus.resolved ||
                    status === ReportTicketStatus.canceled) && (
                    <ReportFieldStyle3 label={"Admin Comment"} text={notes} />
                  )}
                </div>

                <div id="image-upload-wrapper" className="">
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

              {status === ReportTicketStatus.pending && (
                <div className="flex justify-center">
                  <button
                    onClick={ackHandler}
                    className="w-[200px] rounded-sm border-b-2 border-[#111d29] bg-[#2f4f6e] py-2 px-4 text-white duration-100 hover:border-[#213951] hover:bg-[#213951]"
                  >
                    Acknowledge
                  </button>
                </div>
              )}

              {status === ReportTicketStatus.acked && (
                <>
                  {/* a line separator */}
                  <div
                    id="separator"
                    className="-mx-5 mt-2 mb-8 h-2 border-b border-[#a3bad1]"
                  ></div>

                  {/* the form for admin submitting comments */}
                  <form>
                    <div className="mb-2 mt-2 flex">
                      <p className="w-28 text-lg  text-slate-700">
                        Admin Comments
                      </p>
                      <div className="flex flex-1 flex-col">
                        <input
                          className="h-60 rounded-sm border border-slate-400 px-2 py-2 text-start"
                          {...register("notes")}
                          placeholder="What do you want to comment ?"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center gap-5">
                      <button
                        type="submit"
                        onClick={handleSubmit(resolveHandler)}
                        className="w-[200px] rounded-sm border-b-2 border-[#35924e] bg-[#3FBD61] py-2 px-4 text-white duration-100 hover:border-[#20512d] hover:bg-[#35924e]"
                      >
                        Resolve
                      </button>

                      <button
                        type="submit"
                        onClick={handleSubmit(rejectHandler)}
                        className="w-[200px] rounded-sm border-b-2 border-[#c24023] bg-[#EC4E2A] py-2 px-4 text-white duration-100 hover:border-[#832b17] hover:bg-[#be4a30]"
                      >
                        Reject
                      </button>
                    </div>
                  </form>
                </>
              )}
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
          <div className="flex flex-row gap-10">
            <p className="text-slate-400">{user.name}</p>
            <Link
              href={{
                pathname: "/chat",
                query: { username: user.id },
              }}
            >
              <button className="center-thing rounded-md border-b border-b-[#235281] bg-[#357CC2] px-2 text-sm text-white  shadow-lg duration-100 hover:bg-[#1e4a77]">
                Chat
                <FontAwesomeIcon
                  className="ml-3 mt-1 scale-y-75 scale-x-100"
                  size="xl"
                  icon={faMessage}
                />
              </button>
            </Link>
          </div>
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
  if (text === "") {
    text = "no description provided";
  }
  return (
    <div className="mb-2 flex">
      <p className="w-28 text-lg  text-slate-700">{label}</p>
      <div className="flex flex-1 flex-col">
        <div className="h-full rounded-sm border border-[#dbdbdb] px-1 py-1 text-slate-400">
          {text}
        </div>
      </div>
    </div>
  );
};
export default AdminReportPage;
