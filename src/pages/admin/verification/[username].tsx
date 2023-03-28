import { useRouter } from "next/router";
import FixedHeader from "../../../components/FixedHeader";

export default function VerifyUser() {
  const router = useRouter();
  const username =
    typeof router.query.username === "string" ? router.query.username : "";

  return (
    <div className="flex h-screen flex-col">
      <FixedHeader />
      <div className="flex flex-grow">
        <div className="flex h-full w-[200px] border-2 ">
          Please connect sidetab given I am done with my life.
        </div>
        <div className="w-full overflow-scroll sm:px-[40px] sm:pt-[20px] sm:pb-[40px] xl:px-[80px] xl:py-[40px]">
          <div className="flex h-full flex-col gap-[16px]">
            <h1 className="text-[40px] font-semibold">
              Pet Sitter Verification
            </h1>
            <div className="flex h-full w-full rounded-md border-2 sm:px-[20px] sm:py-[20px] xl:p-[40px]">
              <div className="flex w-[70%] flex-col gap-5 border text-[20px]">
                <div className="flex w-full">
                  <div className="w-[30%] border">Type</div>
                  <div className="w-[70%] border">Freelance</div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Name</div>
                  <div className="w-[70%] border">Touchy Sama</div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Pet Types</div>
                  <div className="w-[70%] border">Dog Dog Eat Dog</div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Price Range</div>
                  <div className="w-[70%] border">฿2600 - ฿7000</div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Certification</div>
                  <div className="w-[70%] border">
                    https://youtu.be/xvFZjo5PgG0
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Introduction</div>
                  <div className="w-[70%] whitespace-pre-wrap border">
                    <textarea
                      className="h-[100px] w-[80%] resize-none text-[18px]"
                      value="I will eat your pets.\n.\n."
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Register Date</div>
                  <div className="w-[70%] border">
                    {new Date().toLocaleString()}
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-[30%] border">Register Date</div>
                  <div className="w-[70%] border">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="w-[30%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
