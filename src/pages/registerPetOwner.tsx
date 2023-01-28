import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
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
  const onSubmit = (data: any) => console.log(data);
  return (
    <div className="flex h-screen flex-col">
      <div className="bg-blue-500 text-right">Waiting for NavBar! susu!</div>
      <div className="flex h-full flex-col items-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-1/2 flex-col items-center justify-evenly"
        >
          <div className="flex w-full flex-col items-center">
            <h1 className="text-2xl font-bold">Register Pet owner</h1>
            <h1 className="text-2xl font-bold">1/2</h1>
          </div>

          <div className="mx-auto flex w-full flex-col gap-1">
            <div className="flex justify-between gap-12">
              <div className="flex w-full flex-col">
                <h2>First Name*</h2>
                <input
                  {...register("firstname", { required: true })}
                  type="text"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="flex w-full flex-col">
                <h1>Last Name*</h1>
                <input
                  {...register("lastname", { required: true })}
                  type="text"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex w-full flex-col">
              <h1>Email*</h1>
              <input
                {...register("email", { required: true })}
                type="email"
                className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
              />
            </div>
            <div className="flex w-full flex-col">
              <h1>Address*</h1>
              <input
                {...register("address", { required: true })}
                type="text"
                className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
              />
            </div>
            <div className="flex w-full flex-col">
              <h1>Username</h1>
              <input
                {...register("username", { required: true })}
                type="text"
                className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
              />
            </div>
            <div className="flex w-full flex-col">
              <h1>Password</h1>
              <input
                {...register("password", { required: true })}
                type="password"
                className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
              />
            </div>
            <div className="flex w-full flex-col">
              <h1>Confirm Password</h1>
              <input
                {...register("confirmpassword", { required: true })}
                type="password"
                className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <h1>Type of pet* :</h1>
                <input
                  {...register("type", { required: true })}
                  type="text"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <h1>Breed of pet* :</h1>
                <input
                  {...register("breed", { required: true })}
                  type="text"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <h1>Weight of pet* :</h1>
                <input
                  {...register("weight", { required: true })}
                  type="text"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-4 text-sm text-gray-900 focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-evenly">
            <button className="w-full rounded bg-blue-700 px-24 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
              Back
            </button>
            <button className="w-full rounded bg-blue-700 px-24 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default registerPage;
