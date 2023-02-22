import { getImageSize } from "react-image-size";

/**
 * Get images information from URLs
 */
export async function imagesFromURLs(imagesSrcs: string[]) {
  return await Promise.all(
    imagesSrcs.map(async (url) => {
      const dim = await getImageSize(url);
      const image = {
        src: url,
        width: dim.width,
        height: dim.height,
      };
      return image;
    })
  );
}
