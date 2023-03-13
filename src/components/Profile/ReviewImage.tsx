import Image from "next/image";
type ReviewImageProps = {
  img: string;
};
const ReviewImage = (props: ReviewImageProps) => {
  return (
    <div className="relative mx-auto flex h-[6rem] w-[6rem]">
      <Image
        src={props.img ?? "//profiledummy.png"}
        alt={"Icon"}
        fill
        className="rounded-full object-cover"
      />
    </div>
  );
};
export default ReviewImage;
