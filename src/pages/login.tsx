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
      <div className="px-[200px] text-xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Username</h1>
          <input {...register("username", { required: true })} type="text" />
          <p className="text-red-400">{errors.username?.message}</p>

          <h1>Password</h1>
          <input
            {...register("password", { required: true })}
            placeholder="**********"
            type="password"
          />
          <p className="text-red-400">{errors.password?.message}</p>
          {/*errors. && <span>This field is required</span>*/}

          <button className="text-center">Login</button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;
