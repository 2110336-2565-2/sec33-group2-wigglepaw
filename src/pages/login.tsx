import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Header from "../components/Header";
import { signIn, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";

const LoginPage: NextPage = () => {
  const router = useRouter();

  // Define form schema
  const formDataSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });
  type FormData = z.infer<typeof formDataSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.ok) {
      // redict to home page
      await router.push("/");
    } else {
      alert(`Login failed: ${result?.error ?? "unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Header></Header>
      <div className="my-[10vh] mx-auto flex rounded-xl bg-slate-300 p-6 text-xl ">
        <form onSubmit={handleSubmit(onSubmit)} className="w-fit leading-10 ">
          <h1 className="font-semibold">Username</h1>
          <input
            {...register("username", { required: true })}
            placeholder="Username"
            type="text"
            className="w-full rounded px-1"
          />
          <p className="text-[1rem] text-red-400">{errors.username?.message}</p>

          <h1 className="font-semibold">Password</h1>
          <input
            {...register("password", { required: true })}
            placeholder="********"
            type="password"
            className="w-full rounded p-1"
          />
          <p className="text-[1rem] text-red-400">{errors.password?.message}</p>
          {/*errors. && <span>This field is required</span>*/}
          <button className="mx-auto mt-6 flex rounded-full bg-sky-900 px-4 py-2 text-base font-bold text-white transition-all hover:bg-sky-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
