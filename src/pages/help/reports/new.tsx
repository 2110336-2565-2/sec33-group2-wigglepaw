import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import Header from "../../../components/Header";
import type { reportTicketFields } from "../../../schema/schema";
import { api } from "../../../utils/api";

type ReportFormDataT = z.infer<typeof reportTicketFields>;

const NewReportPage = () => {
  // define the form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportFormDataT>();

  // create a preview image before uploading using this custom hook
  // custom hook for previewing uploaded image
  const useImagePreview = (file: any) => {
    const [imgSrc, setImgSrc] = useState("");

    useEffect(() => {
      if (file && file[0]) {
        const newURL = URL.createObjectURL(file[0]);

        if (newURL !== imgSrc) {
          setImgSrc(newURL);
        }
      }
    }, [file]);

    return [imgSrc, setImgSrc];
  };
  const uploadedImage = watch("image");
  const [imagePreview] = useImagePreview(uploadedImage);

  const createReport = api.reportTicket.create.useMutation();
  const { data: session } = useSession();

  // define the onSubmit method for the form
  const onSubmit = async (data: ReportFormDataT) => {
    try {
      const user = session?.user;
      if (!user) {
        throw new Error("not logged in");
      }

      await createReport.mutateAsync({
        reporterId: user.id,
        reportTicket: {
          title: data.title,
          description: data.description,
        },
      });

      console.log("report created success");
    } catch (err) {
      console.log("error: ", err);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="m-5 mx-auto min-h-[90vh] w-[85vw] max-w-4xl">
        <h1 className="text-[40px] text-[#213951]">New Report</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" border border-[#a3bad1] p-5">
            <div className="mb-6 flex">
              <div id="title-and-text-wrapper" className="mr-6 flex-1">
                <div className="mb-2 flex">
                  <p className="w-20 text-lg  text-slate-700">Title</p>
                  <div className="flex flex-1 flex-col">
                    {errors.title && (
                      <p className="text-red-500">This field is required</p>
                    )}
                    <input
                      className="flex-1 rounded-sm border border-slate-400 px-2 py-2"
                      {...register("title", { required: true })}
                      placeholder="What is your report title?"
                    />
                  </div>
                </div>

                <div className="mb-2 flex">
                  <p className="w-20 text-lg  text-slate-700">Text</p>
                  <div className="flex flex-1 flex-col">
                    {errors.description && (
                      <p className="text-red-500">This field is required</p>
                    )}
                    <input
                      className="h-60 rounded-sm border border-slate-400 px-2 py-2 text-start"
                      {...register("description", { required: true })}
                      placeholder="What do you want to report ?"
                    />
                  </div>
                </div>
              </div>

              <div id="image-upload-wrapper" className=" mr-4">
                <p className="text-lg text-slate-700">Problem Screenshot</p>
                {imagePreview ? (
                  <div className="h-48 w-48 rounded-sm p-[24px]">
                    <img className="" src={imagePreview} alt="preview" />
                  </div>
                ) : (
                  <div className="h-48 rounded-sm border border-slate-200 p-[24px]">
                    <FontAwesomeIcon
                      icon={faCloudArrowUp}
                      className="h-full w-full opacity-10"
                    />
                  </div>
                )}
                <input
                  className="w-48 bg-white text-sm"
                  {...register("image")}
                  type="file"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-sm border-b-2 border-[#35924e] bg-[#3FBD61] py-2 px-4 text-white hover:border-[#20512d] hover:bg-[#35924e]"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReportPage;
