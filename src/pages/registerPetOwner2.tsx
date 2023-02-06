import * as React from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import Image from "next/image";
import {
  FieldValues,
  useForm,
  UseFormRegister,
  ValidationRule,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";

const registerPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: FieldValues) => {
    alert(JSON.stringify(data));
    console.log(21);
  };
  return (
    <div className="flex h-screen flex-col">
      <div className="bg-blue-500 text-right">Waiting for NavBar! susu!</div>
      <div className="h-full items-center">
        <div className="w-full items-center ">
          <h1 className="mt-4 flex justify-center text-3xl font-bold">
            Register Pet Owner
          </h1>
          <h1 className="flex justify-center text-3xl font-bold">2/2</h1>
        </div>
        <div>
          <h1 className=" ml-[15%] text-2xl font-bold">Payment</h1>
        </div>
        <div className="flex justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className=" h-full w-2/3 ">
            <div className="mx-auto grid w-full grid-cols-4 grid-rows-6 gap-2">
              <div className="col-span-4 flex items-center">
                <input className="mr-2" type="checkbox"></input>
                <label>By Card</label>
                <div className="ml-4 h-6 w-8 rounded  bg-blue-300"></div>
                <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
              </div>
              <div className="col-span-2 flex w-full  flex-col">
                <Input
                  id="cardno"
                  label="Card No.*"
                  placeholder="xxxx xxxx xxxx xxxx"
                  register={register}
                  validationRules={{ required: true }}
                  type="number"
                />
              </div>
              <div className="col-span-2"></div>

              <div className="flex w-full flex-col">
                <Input
                  id="expdate"
                  label="Expiration Date*"
                  register={register}
                  validationRules={{ required: true }}
                  type="date"
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="cvv"
                  label="CVV / CVN*"
                  register={register}
                  validationRules={{ required: true }}
                  type="number"
                />
              </div>
              <div className="col-span-2"></div>
              <div className="col-span-4 flex w-full items-center">
                <input className="mr-2" type="checkbox"></input>
                <label>Mobile banking</label>
                <div className="ml-4 h-7 w-7 rounded-full bg-blue-300"></div>
                <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="bankno"
                  label="Bank No.*"
                  placeholder="xxx-x-xxxxx-x"
                  register={register}
                  type="number"
                  validationRules={{ required: true }}
                />
              </div>
              <div className=" flex w-full flex-col">
                <Input
                  id="bankname"
                  label="Bank Name*"
                  register={register}
                  validationRules={{ required: true }}
                  placeholder="ABC"
                />
              </div>
              <div className="col-span-2"></div>
              <div className="col-span-2 flex items-center">
                <input className="mr-2" type="checkbox"></input>
                <label>I agree to the &nbsp;</label>
                <label className="text-red-600 underline">
                  terms, conditions and privacy policy
                </label>
              </div>

              <div className="flex gap-6"></div>
            </div>
            <div className="flex w-full justify-evenly">
              <Button>Back</Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute top-[-4rem] -z-10 ">
            <Image src="/dogcat.png" width={468} height={315} alt="cat" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  register: UseFormRegister<FieldValues>; // declare register props
  validationRules?: object;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  register,
  validationRules,
  type = "text",
  ...rest
}) => (
  <>
    <label htmlFor={id}>{label}</label>

    <input
      className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
      id={id}
      type={type}
      {...rest}
      {...register(id, validationRules)}
    />
  </>
);

const Button: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    className="w-full rounded bg-[#98AAB4] px-24 py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
    {...props}
  >
    {children}
  </button>
);

export default registerPage;
