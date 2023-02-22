import { getImageSize } from "react-image-size";

/**
 * Take an array of images (any object with a src property)
 * and add width and height properties to each image.
 *
 *
 * @param srcImages Array of images (any object with a src property)
 * @returns Array of images with width and height properties added
 */
export async function addWidthHeightToImages<T extends { src: string }>(
  srcImages: T[]
) {
  return await Promise.all(
    srcImages.map(async (image) => {
      // Get image dimensions
      const dim = await getImageSize(image.src);
      // Add width and height to image
      const newImage = {
        ...image,
        width: dim.width,
        height: dim.height,
      };
      return newImage;
    })
  );
}
