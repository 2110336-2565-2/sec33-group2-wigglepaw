import { NextPage } from "next";

const DemoNewPetSitterCard: NextPage = () => {
  return (
    <main className="">
      <div className="mx-auto h-screen w-[851px] border">
        <div
          id="card"
          className="flex h-[189px] flex-row border border-purple-400"
        >
          <div id="profile-image" className="w-[168px] border p-[10.5px]">
            <div className="h-full w-full border">test</div>
          </div>

          <div className="flex h-full grow flex-col justify-center border border-green-500 pl-[19px]">
            <div id="ßcenter-wrapper">
              {/* desktop */}
              <div className="flex flex-col gap-2 border">
                <div className="border">
                  Eren Yeager <span>฿฿฿</span>
                </div>
                <div className="border">
                  Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110
                </div>
              </div>
              <div>
                <div>I'm going to kill them all.</div>
                <div className="flex flex-row gap-2">
                  <div className="rounded-md border px-2 shadow-sm">Cat</div>
                  <div className="rounded-md border px-2 shadow-sm">Deer</div>
                  <div className="rounded-md border px-2 shadow-sm">Iguana</div>
                </div>
              </div>
              {/* end of desktop */}

              {/* mobile */}
              <div className="flex flex-col gap-2 border border-red-500 md:hidden">
                <div className="border">
                  Eren Yeager <span>฿฿฿</span>
                </div>
                <div className="border">
                  Laem Thong Rd, Thung Sukhla, Si Racha, Chon Buri 20110
                </div>
              </div>
              {/* end of mobile */}
            </div>
          </div>
          <div id="book" className="w-[168px] border border-red-500 pr-[18px]">
            <div className="mx-auto flex h-full flex-col justify-center border">
              <div className="border">Very Positive (24)</div>
              <div className="w-[119px] border bg-[#213951] py-1 text-center text-white">
                <button>Book</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoNewPetSitterCard;
