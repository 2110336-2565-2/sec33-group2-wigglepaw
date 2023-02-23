/**
 * This file contains custom hooks for creating and uploading entities.
 *
 * Only entities operation that required special ceremony to create should be here
 * For example: entities operation that require uploading images, which requires frontend to upload images.
 * In general, entities operation that require non-trivial frontend logic should be here.
 */

import { Post } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import image from "next/image";
import { api } from "./api";

/**
 * Custom hook that encapsulates the logic of uploading a profile picture.
 */
export function useUpdateProfilePicture() {
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

  return { mutateAsync: updateProfilePicture, status };
}

export function useAddNewPost() {
  const createPost = api.post.create.useMutation();

  const mutateAsync = async (
    userId: string,
    post: Pick<Post, "title" | "text" | "videoUri">,
    images: FileList
  ) => {
    // Create post with temporary picture uri, retrieve upload urls
    // @see valet key pattern
    const { uploadUrls } = await createPost.mutateAsync({
      petSitterId: userId,
      post: {
        title: post.title ?? undefined,
        text: post.text ?? undefined,
        videoUri: post.videoUri ?? undefined,
      },
      pictureCount: images.length,
    });

    // sanity check
    console.assert(uploadUrls.length === images.length);

    // Upload images
    await Promise.all(uploadUrls.map((url, i) => axios.put(url, images[i])));
  };

  const { mutate: _mutate, mutateAsync: _mutateAsync, ...rest } = createPost;
  return { ...rest, mutateAsync };
}
