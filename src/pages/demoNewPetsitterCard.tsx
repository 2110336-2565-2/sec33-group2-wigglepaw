import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";

const DemoNewPetSitterCard: NextPage = () => {
  return (
    <main className="">
      <div className="mx-auto h-screen w-[851px] max-md:w-[330px]">
        {/*  TODO: add link to profile */}
        <Link href={""}>
          <div
            id="card"
            className="relative flex h-[189px] flex-row bg-[#f6f6f6] drop-shadow-lg duration-150 max-md:h-[115px] max-md:drop-shadow-md md:hover:scale-[1.01]"
          >
            <div className="absolute -left-4 top-3 z-10 bg-[#C3177E] px-2 py-1 text-xs font-bold text-white max-md:py-0.5 max-md:text-[10px]">
              Pet Hotel
            </div>
            <div
              id="profile-image-part"
              className="w-[168px] p-[10.5px] max-md:w-[111px]"
            >
              <div className="relative h-full w-full">
                <Image
                  alt="sitter profile image"
                  src="/profiledummy.png"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div
              id="center-part"
              className="flex grow flex-col justify-center pl-[19px] max-md:pl-0 max-md:pr-2"
            >
              {/* desktop */}
              <div className="max-md:hidden">
                <div className="mb-2 flex flex-col">
                  <div>
                    <span className="mr-2 text-[30px] font-semibold text-[#213951] hover:underline">
                      Eren Yeager
                    </span>
                    <span className="text-[20px] font-normal text-[#bfbfbf]">
                      ฿฿฿
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-[#8E8E8E]">
                    Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <div className="rounded-md border bg-[#a3a3a3] px-3 text-[14px] text-white shadow-sm">
                    Cat
                  </div>
                  <div className="rounded-md border bg-[#a3a3a3] px-3 text-[14px] text-white shadow-sm">
                    Deer
                  </div>
                  <div className="rounded-md border bg-[#a3a3a3] px-3 text-[14px] text-white shadow-sm">
                    Iguana
                  </div>
                </div>
              </div>
              {/* end of desktop */}

              {/* mobile */}
              <div className="flex flex-col border-b-2 pb-2 pt-3 md:hidden">
                <div className="text-[14px] font-medium leading-3 text-[#213951]">
                  Flash Coffee - Bangkok
                </div>
                <div className="flex flex-row justify-end">
                  <div className="flex grow flex-col  gap-2">
                    <div className="text-[10px] font-normal text-[#8e8e8e]">
                      Pattaya, Chonburi
                    </div>

                    <div className="flex flex-row gap-1 ">
                      <div className="rounded-md bg-[#a3a3a3] px-2 text-[10px] font-normal text-white">
                        Hippopotamus
                      </div>
                      <div className="rounded-md bg-[#a3a3a3] px-2 text-[10px] font-normal text-white">
                        ...
                      </div>
                    </div>
                  </div>
                  <div className=" flex flex-col justify-end">
                    <p className="text-[16px] font-normal text-[#bfbfbf]">
                      ฿฿฿฿
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-0.5 pt-1 md:hidden">
                <p className="text-[10px] font-normal text-[#8e8e8e]">
                  No Reviews
                </p>
                <p className="text-[10px] font-normal text-[#8e8e8e]">(0)</p>
              </div>
              {/* end of mobile */}
            </div>

            <div
              id="book-and-review-part"
              className="w-[168px] pr-[18px] max-md:hidden"
            >
              <div className="flex h-full flex-col justify-center">
                <div className="text-[18px] font-normal">
                  {/* TODO: add link to review page*/}
                  <span className="text-[#1F61A4] hover:underline">
                    Very Positive
                  </span>
                  <span className="font-light text-[#8e8e8e]">(24)</span>
                </div>
                <button
                  className="font-mono text-[30px]" /* TODO: add handler */
                >
                  <div className="w-[119px] bg-[#2a4764] py-1 text-center text-white hover:bg-[#213951]">
                    Book
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
};

export default DemoNewPetSitterCard;
