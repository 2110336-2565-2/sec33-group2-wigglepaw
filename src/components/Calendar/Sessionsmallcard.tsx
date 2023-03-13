import Image from "next/image";
export const SessionSmallCard = ({ data }) => {
  return (
    <div className="my-1 animate-showing rounded-xl border-2 border-[#E7E7E7] p-1 opacity-0 shadow-inner transition-all hover:bg-[#F4F4F4]  ">
      <div className="grid grid-cols-5 px-1">
        <div className="relative m-1 mx-[0.4rem]">
          <Image
            src="/umadeofstupid.webp"
            alt="dummy"
            fill
            className="rounded-xl"
          />
        </div>
        <div className="col-span-4 py-2">
          <div className="relative ml-3 mt-1">
            <span className="mr-5">{data.petOwner.firstName} </span>
            <span className="absolute right-1">
              {" "}
              <div className="rounded-xl bg-[#F4F4F4] py-[5px] px-[5px]">
                <div className="h-[4px] w-[4px] rounded-full bg-[#818080] "></div>
                <div className="my-[1.5px] h-[4px] w-[4px] rounded-full bg-[#818080] "></div>
                <div className="h-[4px] w-[4px] rounded-full bg-[#818080] "></div>
              </div>
            </span>
            <div className="flex">
              <div className="text-sm text-gray-500">Date1 &nbsp;- </div>
              <div className="text-sm text-gray-500"> &nbsp; Date2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SessionSmallCard;
