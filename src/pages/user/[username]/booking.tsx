import * as React from "react";
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

const formDataSchema = z.object({
  datetimefrom: z.date(),
  datetimeto: z.date(),

  numpet: z.number().nonnegative(),
  typepet: z.string().min(1),
  breedpet: z.string().optional(),
  weightpet: z.number().gte(0),

  note: z.string().optional(),
});

type FormData = z.infer<typeof formDataSchema>;

const booking: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { data: petSitterData, error: userError } =
    api.user.getByUsername.useQuery(
      { username: typeof username === "string" ? username : "" },
      { enabled: typeof username === "string" }
    );
  const requestBooking = api.booking.request.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = async (data: FormData) => {
    alert(data);
    if (petSitterData) {
      await requestBooking.mutateAsync({
        petSitterId: petSitterData?.userId,
        petIdList: [], //TODO: Add Pets
        note: data.note,
      });
    }
  };

  // FOR SMALLER BREAKPOINTS ONLY!
  const [openTab, setOpenTab] = React.useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="-mt-2 flex w-full max-md:flex-col">
        <DummySideTab openTab={openTab} setOpenTab={setOpenTab} />
        <div className="w-full border-2 max-lg:w-full">
          <div className="relative flex items-center justify-center border-2">
            <TabButton
              openTab={openTab}
              setOpenTab={setOpenTab}
              className="absolute left-2 z-20 lg:hidden"
            />
            <h1 className="text-2xl font-semibold">Booking</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-6 mt-6 mb-8 flex flex-col gap-6 border sm:mx-12 lg:mb-4 lg:mr-32">
              {/* I DON'T THINK THIS IS NEEDED 
              <Input
                id="numberofday"
                label="Number of day* :"
                register={register}
                type="number"
                inputClass="w-full md:w-36 max-w-full"
              /> */}
              <div className="flex flex-col items-end gap-6">
                <div className="flex w-full max-md:gap-4">
                  <Input
                    id="datetimefrom"
                    label="Start Date* :"
                    register={register}
                    type="datetime-local"
                    className="w-1/2"
                    inputClass="w-full md:w-64 max-w-full"
                  />
                  <Input
                    id="datetimeto"
                    label="End Date* :"
                    register={register}
                    type="datetime-local"
                    className="w-1/2 md:-ml-12"
                    inputClass="w-full md:w-64 max-w-full"
                  />
                </div>
              </div>
              <Input
                id="numpet"
                label="Number of pet* :"
                register={register}
                type="number"
                min="1"
                inputClass="w-full md:w-48  max-w-full"
              />
              <Input
                id="typepet"
                label="Type of pet* :"
                register={register}
                inputClass="w-full md:w-80 max-w-full"
              />
              <Input
                id="breedpet"
                label="Breed of pet* :"
                register={register}
                inputClass="w-full md:w-80 max-w-full"
              />
              <Input
                id="weightpet"
                label="Weight of pet* :"
                register={register}
                inputClass="w-full md:w-80 max-w-full"
              />
              <TextArea
                id="note"
                label="Note :"
                register={register}
                textAreaClass="w-full md:w-[24rem] max-md:h-16 max-w-full max-h-24 min-h-[2rem]"
              />
              <div className="flex justify-evenly border-2 max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:gap-4">
                <button className="border bg-[#213951] px-2 py-1 text-white max-lg:w-1/2 max-md:w-full">
                  Preview Booking Request
                </button>
                <button className="border bg-[#213951] px-2 py-1 text-white max-lg:w-1/2 max-md:w-full">
                  Send Booking Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
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
