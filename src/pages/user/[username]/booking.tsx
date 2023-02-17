import * as React from "react";
import { useState } from "react";
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

const booking: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="-mt-2 flex w-full">
        <div className="w-1/6 border-2">Side tab under development bruh</div>
        <div className="w-5/6 border-2">
          <h1 className="flex justify-center border-2 text-2xl font-bold">
            Booking
          </h1>
          <form>
            <div className="mt-4 ml-12 mr-48 flex flex-col gap-4 border-2">
              <Input
                id="numberofday"
                label="Number of day* :"
                register={register}
                type="number"
                inputWidth={40}
              />
              <div className="flex gap-16">
                <div className="flex flex-col items-end gap-4 border-2">
                  <Input
                    id="datefrom"
                    label="Date from* :"
                    register={register}
                    type="date"
                    inputWidth={48}
                  />
                  <Input
                    id="dateto"
                    label="To* :"
                    register={register}
                    type="date"
                    inputWidth={48}
                  />
                </div>
                <div className="flex flex-col items-end gap-4 border-2">
                  <Input
                    id="timefrom"
                    label="Time* :"
                    register={register}
                    type="time"
                    inputWidth={48}
                  />
                  <Input
                    id="timeto"
                    label="Time* :"
                    register={register}
                    type="time"
                    inputWidth={48}
                  />
                </div>
              </div>
              <Input
                id="numpet"
                label="Number of pet* :"
                register={register}
                type="number"
                inputWidth={40}
              />
              <Input
                id="typepet"
                label="Type of pet* :"
                register={register}
                inputWidth={80}
              />
              <Input
                id="breedpet"
                label="Breed of pet* :"
                register={register}
                inputWidth={80}
              />
              <Input
                id="weightpet"
                label="Weight of pet* :"
                register={register}
                inputWidth={80}
              />
              <Input
                id="note"
                label="Note :"
                register={register}
                inputWidth="[24rem]"
              />
              <div className="flex justify-evenly">
                <button className="border bg-[#213951] px-2 py-1 text-white">
                  Preview Booking Request
                </button>
                <button className="border bg-[#213951] px-2 py-1 text-white">
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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // id: keyof FormData;
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>; // declare register props
  // errors: FieldErrorsImpl<FieldValues>; // declare errors props
  validationRules?: object;
  inputWidth?: string | number;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  register,
  // errors,
  validationRules,
  type = "text",
  inputWidth,
  ...rest
}) => (
  <div className="flex items-center gap-2">
    <label htmlFor={id} className="flex w-36 justify-end">
      {label}
    </label>

    <input
      id={id}
      type={type}
      {...rest}
      className={`border-[1px] border-black p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500 w-${inputWidth}`}
      {...register(id, validationRules)}
    />

    {/* <span className=" text-sm text-red-500">{errors[id]?.message}</span> */}
  </div>
);
