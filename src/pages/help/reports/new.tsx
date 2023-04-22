import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Header from "../../../components/Header";
import SideTab from "../../../components/SideTab";
import type { ReportFormDataT } from "../../../schema/schema";
import { useAddNewReportTicket } from "../../../utils/upload";
import ResponsePopup from "../../../components/ResponsePopup";
import router from "next/router";

type ReportFormDataT = z.infer<typeof ReportFormDataT>;

const NewReportPage = () => {
  const [submitReportSuccess, setSubmitReportSuccess] = useState(false);

  // define the form
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReportFormDataT>();

  // create a preview image before uploading using this custom hook
  // custom hook for previewing uploaded image
  const useImagePreview = (file: FileList) => {
    const [imgSrc, setImgSrc] = useState("");

    console.log(file);

    useEffect(() => {
      if (file && file[0]) {
        console.log(file);

        const newURL = URL.createObjectURL(file[0]);

        if (newURL !== imgSrc) {
          setImgSrc(newURL);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file]);

    return [imgSrc, setImgSrc];
  };
  const uploadedImage = watch("image");
  const [imagePreview] = useImagePreview(uploadedImage);

  const createReportTicket = useAddNewReportTicket();

  const { data: session } = useSession();

  // define the onSubmit method for the form
  const onSubmit = async (data: ReportFormDataT) => {
    try {
      const user = session?.user;
      if (!user) {
        throw new Error("not logged in");
      }

      const response = await createReportTicket.mutateAsync(
        user.id,
        {
          title: data.title,
          description: data.description,
        },
        data.image
      );
      console.log("report created success");
      setSubmitReportSuccess(true);
      setTimeout(function () {
        router.push(`/help/reports/${response.reportTicket.ticketId}`);
        setSubmitReportSuccess(false);
      }, 1500);
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex h-screen max-w-[100vw] gap-4 pr-5">
        <SideTab help />
        <div className="content-with-sidetab mt-6">
          <div className="mx-auto w-fit">
            <h1 className="mb-2 w-fit text-2xl font-bold">New Report</h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-fit rounded-md border-2 border-[#a3bad1] p-5 "
            >
              <div className="flex w-fit flex-col lg:flex-row">
                <div
                  id="title-and-text-wrapper"
                  className="inline-block min-w-min lg:mr-8"
                >
                  <p className="mb-4 flex h-fit flex-wrap">
                    <label className="mr-2 text-lg text-slate-700">Title</label>
                    {errors.title && (
                      <p className="text-red-500">This field is required</p>
                    )}
                    <input
                      className="float-right rounded-sm border border-slate-400 p-1"
                      {...register("title", { required: true })}
                      placeholder="What is your report title?"
                    />
                  </p>
                  <p className="mb-4 flex h-fit flex-wrap">
                    <label className="mr-2 text-lg text-slate-700">Text</label>
                    {errors.description && (
                      <p className="text-red-500">This field is required</p>
                    )}
                    <textarea
                      className="float-right min-h-[3rem] rounded-sm border border-slate-400 p-1"
                      {...register("description", { required: true })}
                      placeholder="What do you want to report?"
                    />
                  </p>
                </div>
                <div id="image-upload-wrapper" className="">
                  <p className="text-lg text-slate-700">Problem Screenshot</p>
                  {imagePreview ? (
                    <div className="relative flex h-48 w-48 justify-center rounded-sm border">
                      <Image
                        fill
                        alt="preview-report-problem"
                        className="object-cover"
                        src={imagePreview as string}
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-48 rounded-sm border border-slate-200 p-[24px]">
                      <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        className="h-full w-full opacity-10"
                      />
                    </div>
                  )}
                  <input
                    className="mt-2 w-48 bg-white text-sm"
                    {...register("image")}
                    type="file"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="mt-4 w-[10rem] rounded-sm border-b-2 border-[#35924e] bg-[#3FBD61] px-4 py-2 text-white duration-100 hover:border-[#20512d] hover:bg-[#35924e]"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
        <ResponsePopup
          show={submitReportSuccess}
          setShow={setSubmitReportSuccess}
          panelCSS={"bg-green-400 text-green-700"}
        >
          <div className="font-bold">Report Submitted Successful!</div>
        </ResponsePopup>
      </div>
    </div>
  );
};

export default NewReportPage;
