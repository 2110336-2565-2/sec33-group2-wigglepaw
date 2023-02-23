import {
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * key of picture of post. used to locate picture in S3.
 */
export function key(postId: string, i?: number) {
  return i === undefined ? `post-img/${postId}` : `post-img/${postId}/${i}.png`;
}

/**
 * Publically accessible URL of picture of post.
 */
export function publicUrl(postId: string, i: number) {
  if (!process.env.S3_PUBLIC_URL) {
    throw new Error("S3_PUBLIC_URL is not set");
  }
  return `${process.env.S3_PUBLIC_URL}/${key(postId, i)}`;
}

/**
 * Make S3 parameter pointing to picture of post, to be used in S3 commands.
 */
export function s3Param(postId: string, i: number) {
  return {
    Bucket: process.env.S3_BUCKET,
    Key: key(postId, i),
  };
}

/**
 * Make presigned URL for uploading picture of post.
 */
export async function signedUploadUrl(s3: S3Client, postId: string, i: number) {
  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      ...s3Param(postId, i),
      ContentType: "image/png",
    }),
    { expiresIn: 60 * 5 }
  );
}
/**
 * Check if picture of post is uploaded.
 */
export async function checkUploaded(s3: S3Client, postId: string, i: number) {
  try {
    await s3.send(new HeadObjectCommand(s3Param(postId, i)));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Delete all pictures of post.
 */
export async function deleteOfPost(s3: S3Client, postId: string) {
  console.log(`Deleting picture in post ${postId}`);

  const objPaths = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET,
      Prefix: key(postId),
    })
  );

  console.assert(objPaths.IsTruncated === false, "IsTruncated should be false");

  if (objPaths.Contents === undefined) {
    console.error(`Contents is undefined in post ${postId}`);
    return;
  }

  if (objPaths.Contents.length === 0) {
    console.log(`No picture in post ${postId}, skipping`);
    return;
  }

  return await s3.send(
    new DeleteObjectsCommand({
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: objPaths.Contents.map((obj) => ({
          Key: obj.Key,
        })),
      },
    })
  );
}

// export all function as single object
const postS3 = {
  key,
  publicUrl,
  s3Param,
  signedUploadUrl,
  checkUploaded,
  deleteOfPost,
};
export default postS3;
