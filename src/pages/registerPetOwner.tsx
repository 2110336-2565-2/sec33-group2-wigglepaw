import * as React from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
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
      <div className="flex h-full flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-1/2 flex-col items-center justify-evenly"
        >
          <div className="flex w-full flex-col items-center">
            <h1 className="text-3xl font-bold">Register Pet Owner</h1>
            <h1 className="text-3xl font-bold">1/2</h1>
          </div>
          <div className="mx-auto grid grid-rows-8 grid-cols-1 w-full gap-5">
            <div className="flex justify-between gap-12">
              <div className="flex w-full flex-col">
                <Input
                  id="typed"
                  label="First Name*"
                  placeholder="Mohnke"
                  register={register}
                  validationRules={{ required: true }}
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="lastname"
                  label="Last Name*"
                  placeholder="Jesus"
                  register={register}
                  validationRules={{ required: true }}
                />
              </div>
            </div>
            <div className="flex w-full flex-col">
              <Input
                id="email"
                label="Email*"
                register={register}
                placeholder='someone@gmail.com'
                validationRules={{ required: true }}
                type="email"
              />
            </div>
            <div className="flex w-full flex-col">
              <Input
                id="address"
                label="Address*"
                placeholder='xxxxxxxxxxxxxxxxx'
                register={register}
                validationRules={{ required: true }}
              />
            </div>
            <div className="flex w-full flex-col">
              <Input
                id="phone"
                label="Phone No.*"
                placeholder='0123456789'
                register={register}
                validationRules={{ required: true }}
                type="tel"
              />
            </div>
            <div className="flex w-full flex-col">
              <Input
                id="username"
                label="Username"
                placeholder='เจ้าแม่กวนตีน'
                register={register}
                validationRules={{ required: true }}
              />
            </div>
            <div className="flex w-full flex-col">
              <Input
                id="confirmpassword"
                label="Password"
                register={register}
                validationRules={{ required: true }}
                type="password"
              />
            </div>
            <div className="flex w-full flex-col">
              <Input
                id="confirmpassword"
                label="Confirm Password"
                register={register}
                validationRules={{ required: true }}
                type="password"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex w-full flex-col">
                <Input
                  id="type"
                  label="Type of pet* :"
                  placeholder='Dogs'
                  register={register}
                  validationRules={{ required: true }}
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="breed"
                  label="Breed of pet* :"
                  placeholder="Corgi"
                  register={register}
                  validationRules={{ required: true }}
                />
              </div>
              <div className="flex w-full flex-col">
                <Input
                  id="weight"
                  label="Weight of pet* :"
                  placeholder='5-10 kg'
                  register={register}
                  validationRules={{ required: true }}
                  type="number"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-evenly">
            <Button>Back</Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
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
