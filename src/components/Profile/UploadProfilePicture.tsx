import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useMemo, useState } from "react";
import { api } from "../../utils/api";
import Image from "next/image";
import { useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";
import { HiPencilAlt } from "react-icons/hi";
import { useUpdateProfilePicture } from "../../utils/upload";
import type { UserProfile } from "../../types/user";

// The type is simple enough so I didn't bother to create zod schema for it.
// But if you want, try https://zod.dev/?id=custom-schemas + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
type FormDataProfile = { image: FileList };

type UploadProfilePictureProps = {
  user: UserProfile;
};

const UploadProfilePicture = (props: UploadProfilePictureProps) => {
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  const profileData = api.user.getForProfilePage.useQuery(
    {
      username: props.user?.username ?? "",
    },
    { enabled: !!props.user?.username }
  );

  const updateProfilePicture = useUpdateProfilePicture();

  // Form ==================================================
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormDataProfile>();

  /**
   * Progress of image compression, null if not compressing. otherwise between 0 and 100.
   */
  const [compressProgress, setCompressProgress] = useState<number | null>(null);

  const onSubmit = async (data: FormDataProfile) => {
    const image = data.image[0];
    if (!image) {
      alert("No image selected");
      return;
    }

    // Compress image
    console.log(`Image size: ${image.size} bytes`);
    const compressedImage = await imageCompression(image, {
      maxSizeMB: 1,
      onProgress: (progress) => {
        setCompressProgress(progress);
      },
    });
    setCompressProgress(null);
    console.log(`Compressed image size: ${compressedImage.size} bytes`);

    // Upload image, run with custom hook
    await updateProfilePicture.mutateAsync(compressedImage);
  };

  // Watch for image changes
  // and create a URL for the image when it changes.
  // selectingImgs is the file currently in form.
  // uploadingImgUrl is the URL for the file created from selectingImgs.
  // will be null if no file is selected (in form input).
  const selectingImgs = watch("image");
  const selectingImgUrl = useMemo(() => {
    if (!selectingImgs || selectingImgs.length === 0) {
      return null;
    }
    const img = selectingImgs[0];
    return img ? URL.createObjectURL(img) : null;
  }, [selectingImgs]);

  return (
    <>
      <button
        className="absolute flex h-full w-full justify-center rounded-full opacity-0 transition delay-100 hover:bg-slate-400 hover:opacity-60"
        onClick={() => {
          setIsUploadingProfile(true);
        }}
      >
        <HiPencilAlt className="my-auto fill-white text-3xl font-bold" />
      </button>
      <p className="py-auto absolute left-full ml-2 h-full w-[6rem] text-sm md:hidden">
        Click on your profile to change profile
      </p>

      <Transition show={isUploadingProfile} as={Fragment}>
        <Dialog
          onClose={() => {
            setIsUploadingProfile(false);
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
                <Dialog.Panel className="mx-auto box-border w-[90vw] max-w-[30rem] rounded-md bg-white p-4">
                  <Dialog.Title className="mb-2 text-xl font-bold">
                    Change my profile picture
                  </Dialog.Title>

                  <div className="relative mx-auto mb-2 h-[6rem] w-[6rem] md:h-[8rem] md:w-[8rem]">
                    {profileData.data?.imageUri ? (
                      <Image
                        className="rounded-full object-cover"
                        src={selectingImgUrl ?? profileData.data.imageUri}
                        alt="Profile Picture"
                        fill
                      />
                    ) : (
                      <div className="text-center align-middle italic text-gray-400">
                        No profile picture
                      </div>
                    )}
                  </div>
                  <div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col"
                    >
                      <input
                        {...register("image")}
                        type="file"
                        required
                        accept="image/*"
                        className="mb-2"
                      />

                      {updateProfilePicture.status == "error" && (
                        <p className="mb-2 rounded-lg bg-red-500 p-2 text-white hover:bg-green-400">
                          Error
                        </p>
                      )}
                      {updateProfilePicture.status == "idle" && (
                        <p className="mb-2 rounded-lg bg-gray-500 p-2 text-white">
                          Choose your picture
                        </p>
                      )}
                      {compressProgress && (
                        <p className="mb-2 rounded-lg bg-yellow-500 p-2 text-white">
                          Loading... {compressProgress}%
                        </p>
                      )}
                      {(updateProfilePicture.status == "success" ||
                        updateProfilePicture.status == "loading") &&
                        !compressProgress && (
                          <p className="mb-2 rounded-lg bg-green-500 p-2 text-white">
                            Save Successful
                          </p>
                        )}

                      <span className="mb-2 text-red-500">
                        {errors.image?.message}
                      </span>
                      <div className="flex w-full justify-between">
                        <button
                          className="rounded-full bg-red-800 px-2 py-1 font-semibold text-white hover:bg-red-600"
                          onClick={() => setIsUploadingProfile(false)}
                          type="reset"
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded-full bg-sky-800 px-2 py-1 font-semibold text-white hover:bg-sky-600"
                          type="submit"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default UploadProfilePicture;
