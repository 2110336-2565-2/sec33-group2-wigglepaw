import { SetStateAction } from "react";

interface RegisterDialogProps {
  dialogType: "terms" | "confirm" | "success" | null;
  setDialogType: (
    value: SetStateAction<"terms" | "confirm" | "success" | null>
  ) => void;
}

export default function RegisterDialog({
  dialogType,
  setDialogType,
}: RegisterDialogProps) {
  if (dialogType === null) return <></>;
  if (dialogType === "confirm")
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto font-sans">
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-40"
          onClick={() => setDialogType(null)}
        ></div>
        <div className="flex min-h-screen items-center px-4 py-8">
          <div className="w-612 h-298 relative mx-auto flex max-w-sm items-center justify-center rounded-md bg-[#0080FF] p-4 shadow-lg ">
            <div className="b flex flex-col gap-6 ">
              <p className="text-[#]">Please press 'Confirm' to register</p>
              <div className="flex justify-evenly ">
                <button className="  border bg-[#D9D9D9] px-2">Cancel</button>
                <button className=" border bg-[#D9D9D9] px-2">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  if (dialogType === "terms")
    return (
      <div className="fixed inset-0 z-10 overflow-y-auto font-sans">
        <div
          className="fixed inset-0 h-full w-full bg-black opacity-40"
          onClick={() => setDialogType(null)}
        ></div>
        <div className="flex min-h-screen items-center px-4 py-8">
          <div className="relative mx-auto flex h-[551px] w-[870px] max-w-sm items-center justify-center rounded-md bg-[#98AAB4] p-4 shadow-lg ">
            <div className="b flex flex-col gap-6 ">
              <p className="underline">terms,conditions and privacy policy</p>
              <div className="">
                <p>Big Ass Conditions Here !!!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  //success
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto font-sans">
      <div
        className="fixed inset-0 h-full w-full bg-black opacity-40"
        onClick={() => setDialogType(null)}
      ></div>
      <div className="flex min-h-screen items-center px-4 py-8">
        <div className="w-612 h-298 relative mx-auto flex max-w-sm items-center justify-center rounded-md bg-[#6DD06B] p-4 shadow-lg ">
          <div className="b flex flex-col gap-6 ">
            <p>Sign up Success!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
