import { Fragment, useState } from "react";
import type { NextPage } from "next";
import { api } from "../../../utils/api";
import {
  FieldErrorsImpl,
  FieldValues,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../../../components/Header";
import { signIn, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { Dialog, Transition } from "@headlessui/react";
import SideTab from "../../../components/SideTab";
import { UserType } from "../../../types/user";
import ResponsePopup from "../../../components/ResponsePopup";

const formDataSchema = z.object({
  datetimefrom: z.date(),
  datetimeto: z.date(),
  petIdList: z.array(z.string()), //TODO: Use state
  totalPrice: z.number().gt(0),
  note: z.string().optional(),
});

type FormData = z.infer<typeof formDataSchema>;

const booking: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { username } = router.query;
  const requestBooking = api.booking.request.useMutation();

  const [isBookSuccess, setIsBookSuccess] = useState(false);

  const { data: petSitterData, error: userError } =
    api.user.getByUsername.useQuery(
      { username: typeof username === "string" ? username : "" },
      { enabled: typeof username === "string" }
    );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    if (petSitterData) {
      await requestBooking.mutateAsync({
        petSitterId: petSitterData?.userId,
        startDate: new Date(data.datetimefrom),
        endDate: new Date(data.datetimeto),
        petIdList: [], //TODO: Add Pets
        note: data.note,
      });
      setIsBookSuccess(true);
      setTimeout(function () {
        setIsBookSuccess(false);
        router.push("/schedule");
      }, 1500);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <Header />
        <div className="flex min-h-[90vh]">
          <SideTab
            user={petSitterData}
            isPetOwner={session?.user?.userType == UserType.PetOwner}
          />
          <div className="mx-auto mt-10 h-fit w-5/12 min-w-fit max-w-[96rem] rounded-md border-[4px] border-blue-500 px-2 py-4">
            <div className="relative mb-2 flex justify-center">
              <h1 className="text-2xl font-bold">Booking</h1>
            </div>
            <h2 className="text-lg font-semibold sm:hidden">
              Pet Sitter: {username}
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-1 flex flex-col gap-1"
            >
              <div>
                <label htmlFor="datetimefrom" className="mr-1">
                  Start Date:
                </label>
                <input
                  id="datetimefrom"
                  className=""
                  type="datetime-local"
                  {...register("datetimefrom", { required: true })}
                />
              </div>
              <div>
                <label htmlFor="datetimeto" className="mr-1">
                  End Date:
                </label>
                <input
                  id="datetimeto"
                  className=""
                  type="datetime-local"
                  {...register("datetimeto", { required: true })}
                />
              </div>
              <div className="flex">
                <label htmlFor="petIdList" className="mr-1">
                  Pets:
                </label>
                <span className="block">
                  <input
                    id="petIdList"
                    className=""
                    type="checkbox"
                    {...register("petIdList", { required: true })}
                  />
                  <br />
                  <input
                    id="petIdList"
                    className=""
                    type="checkbox"
                    {...register("petIdList", { required: true })}
                  />
                </span>
              </div>
              <div>
                <label htmlFor="totalPrice" className="mr-1">
                  Total Price:
                </label>
                <input
                  id="totalPrice"
                  type="number"
                  className=""
                  step="0.01"
                  {...register("totalPrice", { required: true })}
                />
              </div>
              <label htmlFor="note" className="">
                Note:
              </label>
              <textarea
                id="note"
                className="mb-2 max-h-[10rem] min-h-[2rem] w-full border-2 p-1"
                placeholder="Note to the pet sitter"
                {...register("note")}
              />
              <div className="flex w-full justify-between">
                <button
                  className="rounded-full bg-red-800 px-2 py-1 font-semibold text-white hover:bg-red-600"
                  onClick={() => {
                    reset();
                  }}
                  type="reset"
                >
                  Cancel Request
                </button>
                <button
                  className="rounded-full bg-sky-800 px-2 py-1 font-semibold text-white hover:bg-sky-600"
                  type="submit"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ResponsePopup
        show={isBookSuccess}
        setShow={setIsBookSuccess}
        doBeforeClose={() => {
          router.push("/schedule");
        }}
        panelCSS={"bg-green-400 text-green-700"}
      >
        <div className="font-bold">Book Successful!</div>
      </ResponsePopup>
    </>
  );
};
export default booking;

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // id: keyof FormData;
  openTab: boolean;
  setOpenTab: (value: React.SetStateAction<boolean>) => void;
}

function TabButton({
  openTab,
  setOpenTab,
  className,
  ...rest
}: TabButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-full border hover:bg-gray-200 ${className}`}
      onClick={() => {
        setOpenTab((prev) => !prev);
      }}
    >
      <FontAwesomeIcon
        icon={faPaw}
        className={`rounded-full border ${openTab && "bg-gray-200"} p-1`}
      />
    </button>
  );
}

interface DummySideTabProps {
  openTab: boolean;
  setOpenTab: (value: React.SetStateAction<boolean>) => void;
}

function DummySideTab({ openTab, setOpenTab }: DummySideTabProps) {
  if (openTab)
    return (
      <>
        <div className="absolute z-20 flex w-full flex-col items-center justify-center border-2 bg-white">
          <p>Profile</p>
          <p>Information</p>
          <p className="text-2xl font-semibold">Booking</p>
          <p>Review</p>
          <p>Contact</p>
        </div>
      </>
    );
  return (
    <div className="w-1/5 border-2 max-lg:hidden">
      <p>Side tab under development bruh!</p>
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // id: keyof FormData;
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>; // declare register props
  // errors: FieldErrorsImpl<FieldValues>; // declare errors props
  validationRules?: object;
  inputClass?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  register,
  // errors,
  validationRules,
  type = "text",
  className,
  inputClass,
  ...rest
}) => (
  <div className={`flex gap-2 max-md:flex-col md:items-center ${className}`}>
    <label htmlFor={id} className="flex w-32 md:justify-end">
      {label}
    </label>

    <input
      id={id}
      type={type}
      {...rest}
      {...register(id, validationRules)}
      className={`border-[1px] border-black p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:ring focus:ring-blue-400 ${inputClass}`}
    />

    {/* <span className=" text-sm text-red-500">{errors[id]?.message}</span> */}
  </div>
);

interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  // id: keyof FormData;
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>; // declare register props
  // errors: FieldErrorsImpl<FieldValues>; // declare errors props
  validationRules?: object;
  textAreaClass?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  label,
  register,
  // errors,
  validationRules,
  className,
  textAreaClass,
  ...rest
}) => (
  <div className={`flex gap-2 max-md:flex-col ${className}`}>
    <label htmlFor={id} className="flex w-32 md:justify-end">
      {label}
    </label>

    <textarea
      id={id}
      {...rest}
      {...register(id, validationRules)}
      className={`border-[1px] border-black p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:bg-white focus:ring-blue-300 ${textAreaClass}`}
    />

    {/* <span className=" text-sm text-red-500">{errors[id]?.message}</span> */}
  </div>
);

// FIX WHEN TAILWIND DOES NOT LOAD CLASS STYLES WHEN USING VARIABLE CLASSNAMES
// function TailwindBugFix() {
//   return (
//     <>
//       <div className="hidden w-40"></div>
//       <div className="hidden w-48"></div>
//       <div className="hidden w-60"></div>
//       <div className="hidden w-80"></div>
//       <div className="hidden w-[24rem]"></div>
//     </>
//   );
// }
