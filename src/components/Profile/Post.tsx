import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { Gallery, Image as I2 } from "react-grid-gallery";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { addWidthHeightToImages } from "../../utils/image";
import { Post } from "@prisma/client";

import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addLocale(en);
TimeAgo.addDefaultLocale(en);

const Post = (props: { post: Post }) => {
  const [index, setIndex] = useState(-1);
  const [imagesLeft, setimagesLeft] = useState(0);

  //Convert string array to object
  const imageSrcs = props.post.pictureUri.map((uri) => ({ src: uri }));

  // Hook to execute async function and return result
  const { result: images } = useAsync(
    // Function returning a promise to execute,
    // calc and add width and height field to images
    () =>
      addWidthHeightToImages(imageSrcs, ({ src }) => {
        // Replacement callback, called if image fails to load
        console.error(`Failed to load image: ${src}`);

        return {
          // TODO: Use actual replacement image (not profile dummy)
          src: "/profiledummy.png",
          width: 225,
          height: 225,
        };
      }),
    // Run only once (this is similar to useEffect's)
    props.post.pictureUri
  );

  useEffect(() => {
    if (images) {
      setimagesLeft(
        images.length -
          (document
            .querySelector(`#${props.post.postId}`)
            ?.querySelectorAll(".ReactGridGallery_tile").length ?? 0)
      );
    }
  });

  //Image Light Box
  if (!images) {
    return null;
  }
  const currentImage = images[index];
  const handleClickLB = (index: number, item: I2) => setIndex(index);

  const rowHeight = Math.min(150, Math.max(0, window.innerWidth * 0.3));

  return (
    <div className="profile-post">
      <div className="mt-1 flex w-full justify-between rounded">
        <h1 className="text-lg font-bold">{props.post.title}</h1>
        <h2>
          <ReactTimeAgo date={props.post.createdAt} locale="en-US" />
        </h2>
      </div>
      <p className="my-1 text-gray-700">{props.post.text}</p>

      {images.length >= 1 && (
        <div className="mb-2">
          <Gallery
            id={props.post.postId}
            images={images}
            onClick={handleClickLB}
            enableImageSelection={false}
            maxRows={2}
            rowHeight={rowHeight}
            margin={2}
            thumbnailStyle={{
              borderRadius: "0.25rem",
            }}
          />
        </div>
      )}
      {images.length >= 1 && imagesLeft > 0 && (
        <div className="flex justify-end">
          More {imagesLeft} images, Click on the image!
        </div>
      )}
      {!!currentImage && (
        <Lightbox
          slides={images}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
        />
      )}
    </div>
  );
};

export default Post;
