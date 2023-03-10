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

const formDataSchema = z.object({
  datetimefrom: z.date(),
  datetimeto: z.date(),

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
          <div className="mx-auto flex">
            <div className="mt-10 max-h-72 w-[90%] max-w-[96rem] rounded-md border-[4px] border-blue-500 px-2 py-4">
              <div className="relative mb-3 flex justify-center">
                <h1 className="text-2xl font-semibold">Booking</h1>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="flex justify-between">
                  <Input
                    id="datetimefrom"
                    label="Start Date* :"
                    register={register}
                    type="datetime-local"
                    className="w-[45%]"
                    inputClass=""
                  />
                  <Input
                    id="datetimeto"
                    label="End Date* :"
                    register={register}
                    type="datetime-local"
                    className="w-[45%]"
                    inputClass=""
                  />
                </div>
                {/* TODO: Pets */}
                <Input
                  id="Pets"
                  label="Pets* :"
                  register={register}
                  placeholder="PETS"
                />
                <TextArea
                  id="note"
                  label="Note :"
                  register={register}
                  textAreaClass=""
                />
                <div className="flex justify-evenly max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:gap-4">
                  <button className="rounded-md bg-wp-blue px-2 py-1 text-white hover:bg-wp-light-blue max-lg:w-1/2 max-md:w-full">
                    Preview Booking Request
                  </button>
                  <button className="rounded-md bg-wp-blue px-2 py-1 text-white hover:bg-wp-light-blue max-lg:w-1/2 max-md:w-full">
                    Send Booking Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Book Success Dialog */}
      <Transition show={isBookSuccess} as={Fragment}>
        <Dialog
          onClose={() => {
            setIsBookSuccess(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 overflow-y-auto">
              {/* Container to center the panel */}
              <div className="flex min-h-full items-center justify-center">
                <Dialog.Panel
                  className="mx-auto box-border w-fit cursor-default rounded bg-green-400 p-6 text-lg text-green-700"
                  onClick={() => {
                    setIsBookSuccess(false);
                    router.push("/schedule");
                  }}
                >
                  <div className="font-bold">Book Successful!</div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
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
