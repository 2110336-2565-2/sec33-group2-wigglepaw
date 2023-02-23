import { useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { Gallery, Image as I2 } from "react-grid-gallery";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { addWidthHeightToImages } from "../../utils/image";
import { Post } from "@prisma/client";

const Post = (props: { post: Post }) => {
  //TODO: Remove image example
  const images1: I2[] = [
    {
      src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
      width: 320,
      height: 174,
    },
    {
      src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
      width: 320,
      height: 212,
    },
    {
      src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
      width: 320,
      height: 212,
    },
  ];

  const imageSrcsOld = [
    {
      src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
      original:
        "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
      // width: 320,
      // height: 174,
    },
    {
      src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
      original:
        "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
      // width: 320,
      // height: 212,
    },
    {
      src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
      original:
        "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
      // width: 320,
      // height: 212,
    },
    {
      src: "https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg",
      original:
        "https://c5.staticflickr.com/9/8768/28941110956_b05ab588c1_b.jpg",
      // width: 240,
      // height: 320,
      tags: [{ value: "Nature", title: "Nature" }],
      caption: "8H (gratisography.com)",
    },
    {
      src: "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
      original:
        "https://c3.staticflickr.com/9/8583/28354353794_9f2d08d8c0_b.jpg",
      // width: 320,
      // height: 190,
      caption: "286H (gratisography.com)",
    },
    {
      src: "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg",
      original:
        "https://c7.staticflickr.com/9/8569/28941134686_d57273d933_b.jpg",
      // width: 320,
      // height: 148,
      tags: [{ value: "People", title: "People" }],
      caption: "315H (gratisography.com)",
    },
    {
      src: "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
      original:
        "https://c6.staticflickr.com/9/8342/28897193381_800db6419e_b.jpg",
      // width: 320,
      // height: 213,
      caption: "201H (gratisography.com)",
    },
    {
      src: "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg",
      original:
        "https://c2.staticflickr.com/9/8239/28897202241_1497bec71a_b.jpg",
      alt: "Big Ben - London",
      // width: 248,
      // height: 320,
      caption: "Big Ben (Tom Eversley - isorepublic.com)",
    },
  ];

  const imageSrcs = props.post.pictureUri.map((uri) => ({ src: uri }));

  // Hook to execute async function and return result
  const { result: images } = useAsync<I2[]>(
    // Function returning a promise to execute,
    // calc and add width and height field to images
    () => addWidthHeightToImages(imageSrcs),
    // Run only once (this is similar to useEffect's)
    []
  );

  console.log(images);

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
  const handleClickLB = (index: number, item: I2) => setIndex(index);
  const handleCloseLB = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div className="profile-post">
      <div className="mt-1 flex w-full justify-between ">
        <h1 className="text-lg font-bold">Post Title</h1>
        <h2>2d ago</h2>
      </div>
      <p className="my-1 text-gray-700">
        Provide in-home pet sitting and pet care services, including workday
        check-ins and feedings, litterbox, cage, and kennel cleaning, overnight
        care, and long-term ...
      </p>

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
          mainSrc={currentImage?.src}
          imageTitle={currentImage?.caption}
          mainSrcThumbnail={currentImage?.src}
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
