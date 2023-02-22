import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
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

    console.log(data);

    const user = session?.user;
    if (!user) {
      alert("No user found");
      return;
    }

    // TODO: Remove this mock subsitution once form is ready
    data.title = data.title ?? "Mock title";
    data.content = data.content ?? "Mock content";

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
  };

  const selectingImgs = watch("image");
  const imagesURLs = useMemo(() => {
    if (!selectingImgs || selectingImgs.length === 0) {
      return null;
    }
    console.log(selectingImgs);

    let imageURLs: string[] = [];

    if (selectingImgs) {
      for (const img of selectingImgs) {
        imageURLs.push(URL.createObjectURL(img));
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
                    <textarea
                      className="mb-2 min-h-[4rem] w-full border-2"
                      placeholder="Post something about your pet setting experience!"
                    ></textarea>
                    <input
                      {...register("image")}
                      type="file"
                      multiple
                      required
                      accept="image/*"
                      className="mb-2"
                    />

                    <ShowImages imagesURLs={imagesURLs} />

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
    </>
  );
};

const ShowImages = (props: { imagesURLs: string[] | null }) => {
  const imagesURLs = props.imagesURLs;
  if (!imagesURLs) return <></>;
  if (imagesURLs.length == 1) {
    return (
      <div className="mb-2 grid w-full gap-2">
        {imagesURLs.map((iUrl: any) => (
          <div className="relative h-[40vw] max-h-48">
            <Image className="object-contain" src={iUrl} alt="" fill />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mb-2 grid w-full grid-cols-2 gap-2 md:grid-cols-3">
      {imagesURLs.map((iUrl: any) => (
        <div className="relative h-[20vw] max-h-32">
          <Image className="object-contain" src={iUrl} alt="" fill />
        </div>
      ))}
    </div>
  );
};

export default UploadPost;
