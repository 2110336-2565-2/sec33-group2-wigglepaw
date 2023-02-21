import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useImageSize } from "react-image-size";
import { api } from "../../utils/api";
import Image from "next/image";
import { useForm } from "react-hook-form";
import imageCompression from "browser-image-compression";

// The type is simple enough so I didn't bother to create zod schema for it.
// But if you want, try https://zod.dev/?id=custom-schemas + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
type FormDataProfile = { image: FileList };

/**
 * Custom hook that encapsulates the logic of uploading a profile picture.
 */
function useUpdateProfilePicture() {
  const utils = api.useContext();
  const uploadProfilePictureURL =
    api.profilePicture.requestUploadProfilePictureURL.useMutation();
  const confirmUpload =
    api.profilePicture.confirmUploadProfilePicture.useMutation();

  const updateProfilePicture = async (image: File) => {
    // Get the URL for upload the image to storage.
    // The URL is presigned, it can only be used for certain defined operations
    // (in this case, PUT), only to this user profile picture, and will expire after a certain time.
    //
    // The URL should be considered a secret, anyone else who has it can upload.
    const url = await uploadProfilePictureURL.mutateAsync();

    // Upload the image to the URL.
    // This operation doesn't pass through our server at all.
    // so we don't use TRPC here, instead, we use axios.
    //
    // This way of uploading directly to storage safely is call valet key pattern,
    // useful for reducing server load and costs.
    await axios.put(url, image);

    // Notify the server that the image has been uploaded.
    // This will update the user's profile picture URL in the database.
    // This is a normal TRPC call.
    //
    // The downside of valet key pattern is that server can't automatically
    // know when the image has been uploaded, so we need to notify it.
    await confirmUpload.mutateAsync();

    // Update the profile picture URL in the cache.
    await utils.user.invalidate();
  };

  const status =
    confirmUpload.status !== "idle" && confirmUpload.status !== "success"
      ? confirmUpload.status
      : uploadProfilePictureURL.status;

  return { mutate: updateProfilePicture, status };
}

const ProfileImage = ({ url }: { url: string }) => {
  const [dim] = useImageSize(url);
  return (
    <Image
      className="rounded-full object-cover"
      src={url}
      alt="Profile Picture"
      fill
    />
    //<span>{`${url} (${dim?.width ?? ""}x${dim?.height ?? ""})`}</span>
  );
};

const UploadProfilePicture = (props: any) => {
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [images, setImages] = useState([]);
  const [newImageUri, setNewImageUri] = useState("");

  useEffect(() => {
    if (images.length >= 1) {
      const newImageUris = images[0].map((image) => URL.createObjectURL(image));

      setNewImageUri(newImageUris);
    }
  }, [images]);

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
    reset,
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
    await updateProfilePicture.mutate(compressedImage);
  };

  return (
    <>
      <button
        className="absolute h-full w-full rounded-full opacity-0 transition delay-200 ease-in-out hover:bg-slate-400 hover:opacity-60"
        onClick={() => {
          setIsUploadingProfile(true);
        }}
      >
        EDIT
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
                <Dialog.Panel className="mx-auto box-border w-[90vw] max-w-[50rem] rounded bg-white p-4">
                  <Dialog.Title className="mb-2 text-xl font-bold">
                    Change my profile picture
                  </Dialog.Title>

                  <div className="relative mx-auto mb-2 h-[6rem] w-[6rem]">
                    {profileData.data?.imageUri ? (
                      <ProfileImage url={profileData.data.imageUri} />
                    ) : (
                      <div className="italic text-gray-400">
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
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-400 disabled:opacity-50"
                        disabled={
                          updateProfilePicture.status === "loading" ||
                          compressProgress !== null
                        }
                      >
                        {updateProfilePicture.status == "error" && <p>Error</p>}
                        {updateProfilePicture.status == "idle" && <p>Upload</p>}
                        {updateProfilePicture.status == "loading" && (
                          <p>Loading...</p>
                        )}
                        {updateProfilePicture.status == "success" && (
                          <p>Upload Again</p>
                        )}
                      </button>
                      {compressProgress && <span>{compressProgress}%</span>}
                      <span className="text-red-500">
                        {errors.image?.message}
                      </span>
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