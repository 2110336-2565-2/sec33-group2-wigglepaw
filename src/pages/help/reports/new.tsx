import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Header from "../../../components/Header";

interface ReportFormDataT {
  date: Date;
  title: string;
  text: string;
  image?: FileList;
}

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
  const useImagePreview = (file) => {
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

  // define the onSubmit method for the form
  const onSubmit = (data: ReportFormDataT) => {
    // append date to the submitted report
    data.date = new Date();

    console.log("submitting new report");
    console.log(data);

    // TODO: call mutations to server here
  };

  return (
    <>
      <Header />
      <div className="text-center">
        <h1>New Report</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <p>Title</p>
            <input
              className="border"
              {...register("title", { required: true })}
              placeholder="What is your report title?"
            />
            {errors.title && (
              <p className="text-red-500">This field is required</p>
            )}
          </div>

          <div>
            <p>Text</p>
            <input
              className="border"
              {...register("text", { required: true })}
              placeholder="What do you want to report ?"
            />
            {errors.text && (
              <p className="text-red-500">This field is required</p>
            )}
          </div>

          <div>
            <p>Problem Screenshot</p>
            {imagePreview && (
              <img className="h-60 w-60" src={imagePreview} alt="preview" />
            )}
            <input
              className="border"
              {...register("image")}
              type="file"
              accept="image/*"
            />
          </div>

          <div>
            <button type="submit" className="border bg-green-600">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewReportPage;
