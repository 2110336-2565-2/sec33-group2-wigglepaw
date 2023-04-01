import Image from "next/image";
import Header from "../../../components/Header";

const ReportPage = () => {
  const ReportTmp = {
    title: "the report title",
    text: "this is report text",
    status: "resolved",
    adminComment: "this is admin comment. read your report, done",
    date: "Sat Apr 01 2023 18:41:03 GMT+0700 (Indochina Time)",
    user: {
      id: "#uFree90",
      name: "myUserNameJa",
      imageURL: "/nomatch_saddog.png",
    },
  };

  return (
    <>
      <Header />
      <div className="m-5">
        <h1 className="text-[40px] text-[#213951]">Problem Report</h1>
        <div className=" border border-[#a3bad1] p-5">
          <div className="mb-6 flex">
            <div id="title-and-text-wrapper" className="mr-6 flex-1">
              {/* the reported user */}
              <ReportFieldStyle1 label={"User"} user={ReportTmp.user} />

              {/* the reported date */}
              <ReportFieldStyle2 label={"Date"} text={ReportTmp.date} />

              {/* the report title */}
              <ReportFieldStyle2 label={"Title"} text={ReportTmp.title} />

              {/* the report text */}
              <ReportFieldStyle3 label={"Text"} text={ReportTmp.text} />

              {/* the report status */}
              <ReportFieldStyle2 label={"Status"} text={ReportTmp.status} />

              {/* admin comments if any */}
              {ReportTmp.adminComment && ReportTmp.status !== "pending" && (
                <ReportFieldStyle3
                  label={"Admin Comment"}
                  text={ReportTmp.adminComment}
                />
              )}
            </div>

            <div id="image-upload-wrapper" className=" mr-4">
              <p className="text-lg text-slate-700">Problem Screenshot</p>
              <Image
                alt="sitter profile image"
                src={"/nomatch_saddog.png"}
                className="rounded-sm border p-[24px]"
                width={192}
                height={192}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
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
        <div className="rounded-sm border border-[#dbdbdb] px-2 py-2 text-slate-400">
          {text}
        </div>
      </div>
    </div>
  );
};
export default ReportPage;
