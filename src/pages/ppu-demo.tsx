import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../utils/api";
import axios from "axios";
import Header from "../components/Header";

// The type is simple enough so I didn't bother to create zod schema for it.
// But if you want, try https://zod.dev/?id=custom-schemas + https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof
type FormData = { image: FileList };

const ProfilePictureUploadDemo: NextPage = () => {
  const { data: session, status } = useSession();

  // API ==================================================
  const utils = api.useContext();
  const profileData = api.user.getForProfilePage.useQuery(
    {
      username: session?.user?.username ?? "",
    },
    { enabled: !!session?.user?.username }
  );

  // TODO: convert these valet logic to custom hook
  const uploadProfilePictureURL =
    api.file.requestUploadProfilePictureURL.useMutation();
  const confirmUpload = api.file.confirmUploadProfilePicture.useMutation();

  // Form ==================================================
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const image = data.image[0];
    if (!image) {
      alert("No image selected");
      return;
    }

    // Get the URL for upload the image to storage.
    // The URL is presigned, it can only be used for certain defined operations
    // (in this case, PUT), only to this user profile picture, and will expire after a certain time.
    //
    // The URL should be considered a secret, anyone else who has it can upload.
    const url = await uploadProfilePictureURL.mutateAsync();
    console.log(url);

    // Upload the image to the URL.
    // This operation doesn't pass through our server at all.
    // so we don't use TRPC here, instead, we use axios.
    //
    // This way of uploading directly to storage safely is call valet key pattern,
    // useful for reducing server load and costs.
    const res = await axios.put(url, image);
    console.log(res);

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
          <>
            <img
              className="m-auto"
              src={profileData.data.imageUri}
              alt="Profile Picture"
            />

            <span>{profileData.data.imageUri}</span>
          </>
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
            className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-400"
            disabled={uploadProfilePictureURL.isLoading}
          >
            Upload
          </button>
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

export default ProfilePictureUploadDemo;
