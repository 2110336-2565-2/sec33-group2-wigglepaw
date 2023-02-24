import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const profilePic = {
  /**
   * Key of profile picture of user. Used to locate picture in S3.
   */
  key: (userId: string) => `profile-img/${userId}.png`,

  /**
   * Publically accessible URL of profile picture of user.
   */
  publicUrl: (userId: string) => {
    if (!process.env.S3_PUBLIC_URL) {
      throw new Error("S3_PUBLIC_URL is not set");
    }
    return `${process.env.S3_PUBLIC_URL}/${profilePic.key(userId)}`;
  },

  /**
   * Make S3 parameter pointing to profile picture of user, to be used in S3 commands.
   */
  s3Param: (userId: string) => ({
    Bucket: process.env.S3_BUCKET,
    Key: profilePic.key(userId),
  }),

  /**
   * Make presigned URL for uploading profile picture of user.
   */
  signedUploadUrl: async (s3: S3Client, userId: string, expiresIn = 60 * 1) => {
    return await getSignedUrl(
      s3,
      new PutObjectCommand({
        ...profilePic.s3Param(userId),
        ContentType: "image/png",
      }),
      { expiresIn }
    );
  },

  //   /**
  //    * Check if profile picture of user is uploaded.
  //    */
  //   checkUploaded: async (s3: S3Client, userId: string) => {
  //     try {
  //       await s3.send(new HeadObjectCommand(profilePic.s3Param(userId)));
  //       return true;
  //     } catch (e) {
  //       return false;
  //     }
  //   },

  /**
   * Delete profile picture of user.
   */
  delete: async (s3: S3Client, userId: string) => {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: profilePic.s3Param(userId).Key,
      })
    );
  },
};
export default profilePic;
