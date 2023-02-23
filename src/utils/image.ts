import { getImageSize } from "react-image-size";

/**
 * Take an array of images (any object with a src property)
 * and add width and height properties to each image.
 *
 *
 * @param srcImages Array of images (any object with a src property)
 * @param replacementFn Function that returns a replacement image if the original image fails to load
 * @returns Array of images with width and height properties added
 */
export async function addWidthHeightToImages<T extends { src: string }, O>(
  srcImages: T[],
  replacementFn: (src: T) => O = ({ src }) => {
    throw new Error(`Image ${src} failed to load`);
  }
) {
  return await Promise.all(
    srcImages.map(async (image) => {
      // Get image dimensions
      let dim;
      try {
        dim = await getImageSize(image.src, {
          timeout: 1000,
        });
        console.log(JSON.stringify(dim) + " " + image.src);
      } catch (error) {
        // If there is an error, return the replacement image
        return replacementFn(image);
      }

      console.log(image.src);
      console.log(dim);

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
