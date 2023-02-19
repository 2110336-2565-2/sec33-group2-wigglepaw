import { useState } from "react";
import { Gallery, Image } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

export interface CustomImage extends Image {
  original: string;
}

const Post = () => {
  //TODO: Remove image example
  const images: CustomImage[] = [
    {
      src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
      original:
        "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
      width: 320,
      height: 174,
    },
    {
      src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
      original:
        "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
      width: 320,
      height: 212,
    },
    {
      src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
      original:
        "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
      width: 320,
      height: 212,
    },
  ];

  const [index, setIndex] = useState(-1);

  const currentImage = images[index];
  const nextIndex = (index + 1) % images.length;
  const nextImage = images[nextIndex] || currentImage;
  const prevIndex = (index + images.length - 1) % images.length;
  const prevImage = images[prevIndex] || currentImage;

  const handleClick = (index: number, item: CustomImage) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div className="profile-post">
      <div className="flex w-full justify-between">
        <h1 className="text-lg font-bold">Post Title</h1>
        <h2>2d ago</h2>
      </div>
      <p className="text-gray-700">
        TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING TESTING
        TESTING TESTING TESTING TESTING
      </p>

      {images.length >= 1 && (
        <Gallery
          images={images}
          onClick={handleClick}
          enableImageSelection={false}
        />
      )}
      {!!currentImage && (
        /* @ts-ignore */
        <Lightbox
          mainSrc={currentImage?.original}
          imageTitle={currentImage?.caption}
          mainSrcThumbnail={currentImage?.src}
          nextSrc={nextImage?.original}
          nextSrcThumbnail={nextImage?.src}
          prevSrc={prevImage?.original}
          prevSrcThumbnail={prevImage?.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
    </div>
  );
};

export default Post;
