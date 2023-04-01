import Image from "next/image";
type ReviewImageProps = {
  img: string;
  size: number;
};
const ReviewImage = (props: ReviewImageProps) => {
  return (
    <div
      className={`relative mx-auto flex h-[${props.size}rem] w-[${props.size}rem]`}
    >
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
