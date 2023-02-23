import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { Gallery, Image as I2 } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { addWidthHeightToImages } from "../../utils/image";
import { Post } from "@prisma/client";

const Post = (props: { post: Post }) => {
  //Convert string array to object
  const imageSrcs = props.post.pictureUri.map((uri) => ({ src: uri }));

  // Hook to execute async function and return result
  const { result: images } = useAsync<I2[]>(
    // Function returning a promise to execute,
    // calc and add width and height field to images
    () => addWidthHeightToImages(imageSrcs),
    // Run only once (this is similar to useEffect's)
    props.post.pictureUri
  );

  //Image Light Box
  const [index, setIndex] = useState(-1);
  const [imagesLeft, setimagesLeft] = useState(0);

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

  if (!images) {
    return null;
  }
  const currentImage = images[index];
  const nextIndex = (index + 1) % images.length;
  const nextImage = images[nextIndex] || currentImage;
  const prevIndex = (index + images.length - 1) % images.length;
  const prevImage = images[prevIndex] || currentImage;
  const handleClickLB = (index: number) => setIndex(index);
  const handleCloseLB = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  console.log(index);

  return (
    <div className="profile-post">
      <div className="mt-1 flex w-full justify-between ">
        <h1 className="text-lg font-bold">{props.post.title}</h1>
        <h2>2d ago</h2>
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
            rowHeight={140}
            margin={2}
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
          mainSrc={currentImage.src}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage?.src}
          nextSrcThumbnail={nextImage?.src}
          prevSrc={prevImage?.src}
          prevSrcThumbnail={prevImage?.src}
          onCloseRequest={handleCloseLB}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}
    </div>
  );
};

export default Post;
