import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../utils/api";
import axios from "axios";
import Header from "../components/Header";
import { useImageSize } from "react-image-size";
import imageCompression from "browser-image-compression";

// The type is simple enough so I didn't bother to create zod schema for it.
// But if you want, try https://zod.dev/?id=custom-schemas + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
type FormData = { image: FileList };

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

const ProfilePictureUploadDemo: NextPage = () => {
  const { data: session, status } = useSession();

  // API ==================================================
  const profileData = api.user.getForProfilePage.useQuery(
    {
      username: session?.user?.username ?? "",
    },
    { enabled: !!session?.user?.username }
  );

  const updateProfilePicture = useUpdateProfilePicture();

  // Form ==================================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  /**
   * Progress of image compression, null if not compressing. otherwise between 0 and 100.
   */
  const [compressProgress, setCompressProgress] = useState<number | null>(null);

  const onSubmit = async (data: FormData) => {
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

  // Guard ==================================================

  if (status === "loading" || !profileData.data) {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>Not signed in</div>;
  }

  // Render ==================================================

  return (
    <div className="space-y-4 text-center">
      <Header />
      <h1 className="text-xl font-bold">Upload Demo</h1>

      <section className="border-4 p-1">
        <h2 className="pb-3 text-lg">Profile Picture</h2>
        {profileData.data.imageUri ? (
          <ProfileImage url={profileData.data.imageUri} />
        ) : (
          <div className="italic text-gray-400">No profile picture</div>
        )}
      </section>

      <section className="border-4 p-1">
        <h2 className="pb-3 text-lg">Profile Picture Upload</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <input {...register("image")} type="file" required accept="image/*" />
          <button
            type="submit"
            className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-400 disabled:opacity-50"
            disabled={
              updateProfilePicture.status === "loading" ||
              compressProgress !== null
            }
          >
            Upload ({updateProfilePicture.status})
          </button>
          {compressProgress && <span>{compressProgress}%</span>}
          <span className="text-red-500">{errors.image?.message}</span>
        </form>
      </section>

      <section className="border-4 p-1">
        <h2 className="pb-3 text-lg">User data</h2>
        <pre>{JSON.stringify(profileData.data, null, 2)}</pre>
      </section>
    </div>
  );
};

const ProfileImage = ({ url }: { url: string }) => {
  const [dim] = useImageSize(url);

  return (
    <>
      <img className="m-auto" src={url} alt="Profile Picture" />

      <span>{`${url} (${dim?.width ?? ""}x${dim?.height ?? ""})`}</span>
    </>
  );
};

export default ProfilePictureUploadDemo;
