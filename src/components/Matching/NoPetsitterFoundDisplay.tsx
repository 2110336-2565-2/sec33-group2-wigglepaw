// TODO: add link to support service (productbacklog code US11-1)
import Image from "next/image";
import Link from "next/link";

const NoPetsitterFoundDisplay: React.FunctionComponent = ({}) => {
  return (
    <div
      id="card"
      className="relative -ml-4 w-[818px] grow animate-showing rounded-md border border-[#dadadac2] opacity-0 drop-shadow-sm"
    >
      <div className="mx-auto mt-56 mb-32 w-fit text-center drop-shadow-none max-md:mt-24 max-md:mb-10">
        <p className="mb-1 text-[32px] text-[#878787] max-md:text-[16px]">
          Oops... no suitable pet sitters found.
        </p>
        <p className="text-[14px] text-[#c4c4c4] max-md:text-[12px]">
          Experiencing a problem ?
          <Link href={"/"}>
            <span className=" ml-1 text-[14px] text-[#c4c4c4] underline max-md:text-[12px] md:hover:text-[#3C8DE1]">
              Please contact our staff.
            </span>
          </Link>
        </p>
        <Image
          alt="sitter profile image"
          src={"/nomatch_saddog.png"}
          width={85}
          height={85}
          className="mx-auto mt-16 opacity-80 max-md:h-auto max-md:w-[60px]"
        />
      </div>
    </div>
  );
};

export default NoPetsitterFoundDisplay;
