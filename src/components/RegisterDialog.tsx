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
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div
        className="fixed inset-0 h-full w-full bg-black opacity-40"
        onClick={() => setDialogType(null)}
      ></div>
      <div className="flex min-h-screen items-center px-4 py-8">
        <div className="relative mx-auto flex h-36 w-full max-w-sm rounded-md bg-white p-4 shadow-lg">
          <div className="b sm:flex">Please implement dialog M r. D E V</div>
        </div>
      </div>
    </div>
  );
}
