import {
  HeadObjectCommand,
  PutObjectCommand,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * key of picture of report. used to locate picture in S3.
 */
export function key(ticketId: string, i?: number) {
  return i === undefined
    ? `report-img/${ticketId}`
    : `report-img/${ticketId}/${i}.png`;
}

/**
 * Publically accessible URL of picture of the report.
 */
export function publicUrl(ticketId: string, i: number) {
  if (!process.env.S3_PUBLIC_URL) {
    throw new Error("S3_PUBLIC_URL is not set");
  }
  return `${process.env.S3_PUBLIC_URL}/${key(ticketId, i)}`;
}

/**
 * Make S3 parameter pointing to picture of report, to be used in S3 commands.
 */
export function s3Param(ticketId: string, i: number) {
  return {
    Bucket: process.env.S3_BUCKET,
    Key: key(ticketId, i),
  };
}

/**
 * Make presigned URL for uploading picture of post.
 */
export async function signedUploadUrl(
  s3: S3Client,
  ticketId: string,
  i: number,
  expiresIn = 60 * 5
) {
  return await getSignedUrl(
    s3,
    new PutObjectCommand({
      ...s3Param(ticketId, i),
      ContentType: "image/png",
    }),
    { expiresIn }
  );
}

/**
 * Check if picture of report is uploaded.
 */
export async function checkUploaded(s3: S3Client, ticketId: string, i: number) {
  try {
    await s3.send(new HeadObjectCommand(s3Param(ticketId, i)));
    return true;
  } catch (e) {
    return false;
  }
}

// export all function as single object
const reportTicketS3 = {
  key,
  publicUrl,
  s3Param,
  signedUploadUrl,
  checkUploaded,
};
export default reportTicketS3;
