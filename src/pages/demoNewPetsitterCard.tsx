import type { NextPage } from "next";
import Image from "next/image";

const DemoNewPetSitterCard: NextPage = () => {
  return (
    <main className="">
      <div className="mx-auto h-screen w-[851px] border">
        <div
          id="card"
          className="relative flex h-[189px] flex-row border border-purple-400"
        >
          <div className="absolute -left-[16px] top-[12px] z-10  border bg-[#C3177E] px-2 py-1 text-xs font-bold text-white">
            Pet Hotel
          </div>
          <div id="profile-image" className="w-[168px] border p-[10.5px]">
            <div className="relative h-full w-full border">
              <Image
                alt="sitter profile image"
                src="/profiledummy.png"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex h-full grow flex-col justify-center border border-green-500 pl-[19px]">
            <div id="ßcenter-wrapper">
              {/* desktop */}
              <div className="max-md:hidden">
                <div className="mb-2 flex flex-col border">
                  <div className="border text-[30px] font-semibold">
                    Eren Yeager{" "}
                    <span className="text-[20px] font-normal">฿฿฿</span>
                  </div>
                  <div className="border text-[14px] font-semibold">
                    Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110
                  </div>
                </div>
                <div className="border text-[18px] font-normal">
                  <div>I&apos;m going to kill them all.</div>
                  <div className="flex flex-row gap-2">
                    <div className="rounded-md border px-3 shadow-sm">Cat</div>
                    <div className="rounded-md border px-3 shadow-sm">Deer</div>
                    <div className="rounded-md border px-3 shadow-sm">
                      Iguana
                    </div>
                  </div>
                </div>
              </div>
              {/* end of desktop */}

              {/* mobile */}
              <div className="border md:hidden">
                <div className="flex flex-col gap-2 border border-red-500">
                  <div className="border">
                    Eren Yeager <span>฿฿฿</span>
                  </div>
                  <div className="border">
                    Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110
                  </div>
                </div>
                <div className="flex flex-row gap-2 border ">
                  <div className="rounded-md border px-2 shadow-sm">Cat</div>
                  <div className="rounded-md border px-2 shadow-sm">Deer</div>
                  <div className="rounded-md border px-2 shadow-sm">Iguana</div>
                </div>

                <div className="border">Very Positive (24)</div>
                <span className="h-10 w-full bg-purple-600"></span>
              </div>

              {/* end of mobile */}
            </div>
          </div>
          <div id="book" className="w-[168px] border border-red-500 pr-[18px]">
            <div className="mx-auto flex h-full flex-col justify-center border">
              <div className="border text-[18px] font-normal">
                Very Positive (24)
              </div>
              <div className="w-[119px] border bg-[#213951] py-1 text-center text-white">
                <button className="font-mono text-[30px]">Book</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoNewPetSitterCard;
