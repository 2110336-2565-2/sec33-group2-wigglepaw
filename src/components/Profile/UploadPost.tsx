import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Gallery, Image } from "react-grid-gallery";
import { addWidthHeightToImages } from "../../utils/image";
import { useAsync } from "react-async-hook";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useAddNewPost } from "../../utils/upload";

const formDataSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  content: z.string(),
  image: z.custom<FileList>(),
});

type FormData = z.infer<typeof formDataSchema>;

const UploadPost = (props: any) => {
  const [isPosting, setIsPosting] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  const images: Image[] = [];
  const { data: session, status } = useSession();
  const addNewPost = useAddNewPost();

  // Form ==================================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const image = data.image;
    if (!image) {
      alert("No image selected");
      return;
    }

    const user = session?.user;
    if (!user) {
      alert("No user found");
      return;
    }

    await addNewPost.mutateAsync(
      user.id,
      {
        title: data.title,
        text: data.content,
        // TODO: Add videoUri?
        videoUri: null,
      },
      image
    );
    setIsPosting(false);
    reset();
    setIsUploadSuccess(true);
    setTimeout(function () {
      setIsUploadSuccess(false);
    }, 2000);
  };

  //Images
  const selectingImgs = watch("image");
  const imagesURLs = useMemo(() => {
    if (!selectingImgs || selectingImgs.length === 0) {
      return null;
    }

    let imageURLs: string[] = [];

    if (selectingImgs) {
      for (const img of selectingImgs) {
        const img_url = URL.createObjectURL(img);
        imageURLs.push(img_url);
      }
    }
    return imageURLs;
  }, [selectingImgs]);

  return (
    <>
      <button
        className="profile-post py-2 text-center font-semibold"
        onClick={() => {
          setIsPosting(true);
        }}
      >
        + New Post
      </button>
      <Transition show={isPosting} as={Fragment}>
        <Dialog onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 overflow-y-auto">
              {/* Container to center the panel */}
              <div className="flex min-h-full items-center justify-center">
                <Dialog.Panel className="mx-auto box-border w-[90vw] max-w-[50rem] rounded bg-white p-4">
                  <Dialog.Title className="mb-2 text-xl font-bold">
                    Create Post
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col"
                  >
                    <input
                      className="mb-2 rounded border-2 p-1 text-lg font-bold placeholder-gray-600"
                      placeholder="Title"
                      {...register("title", { required: true })}
                    />
                    <textarea
                      className="mb-2 min-h-[4rem] w-full border-2 p-1"
                      placeholder="Post something about your pet setting experience!"
                      {...register("content")}
                    ></textarea>
                    <input
                      {...register("image")}
                      type="file"
                      multiple
                      required
                      accept="image/*"
                      className="mb-2"
                    />
                    <ShowImages imagesURLs={imagesURLs} images={images} />
                    <div className="flex w-full justify-between">
                      <button
                        className="rounded-full bg-red-800 px-2 py-1 font-semibold text-white hover:bg-red-600"
                        onClick={() => {
                          setIsPosting(false);
                          reset();
                        }}
                        type="reset"
                      >
                        Cancel
                      </button>
                      <button
                        className="rounded-full bg-sky-800 px-2 py-1 font-semibold text-white hover:bg-sky-600"
                        type="submit"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Upload Success Dialog */}
      <Transition show={isUploadSuccess} as={Fragment}>
        <Dialog
          onClose={() => {
            setIsUploadSuccess(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 overflow-y-auto">
              {/* Container to center the panel */}
              <div className="flex min-h-full items-center justify-center">
                <Dialog.Panel
                  className="mx-auto box-border w-fit cursor-default rounded bg-green-400 p-6 text-lg text-green-700"
                  onClick={() => {
                    setIsUploadSuccess(false);
                  }}
                >
                  <div className="font-bold">Upload Successful</div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

const ShowImages = (props: {
  imagesURLs: string[] | null;
  images: Image[];
}) => {
  const imagesURLs = props.imagesURLs;

  // Get image in format that react-grid-gallery can use
  // use react-async-hook to run async function in react component, and get the output.
  const { result: images } = useAsync(async () => {
    // If no imagesURLs, there is no images to show
    if (!imagesURLs) return undefined;

    // Convert imagesURLs (string) to imageObjs ({src: string})
    const imageObjs = imagesURLs.map((i) => ({ src: i }));

    // Add width and height to images, so that the gallery can render them properly
    // then return the images
    return await addWidthHeightToImages(imageObjs);
  }, [imagesURLs]);

  if (!imagesURLs || !images) return <></>;

  return (
    <div className="mb-2">
      <Gallery
        images={images}
        enableImageSelection={false}
        rowHeight={140}
        margin={2}
      />
    </div>
  );

  // if (imagesURLs.length == 1) {
  //   return (
  //     <div className="mb-2 grid w-full gap-2">
  //       {imagesURLs.map((iUrl: any) => (
  //         <div className="relative h-[25vw] max-h-48 md:h-[40vw]">
  //           <Image className="object-contain" src={iUrl} alt="" fill />
  //         </div>
  //       ))}
  //     </div>
  //   );
  // } else if (imagesURLs.length >= 1) {
  //   return (
  //     <div className="mb-2 grid w-full grid-cols-2 gap-2 md:grid-cols-3">
  //       {imagesURLs.map((iUrl: any) => (
  //         <div className="relative h-[25vw] max-h-32 md:h-[33vw] md:max-h-36">
  //           <Image className="object-contain" src={iUrl} alt="" fill />
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }
  // return <></>;
};

export default UploadPost;
