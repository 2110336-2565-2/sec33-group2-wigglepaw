import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";

const loginPage: NextPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  return (
    <div className="flex flex-col gap-2">
        <button>About</button>
        <button>Log in</button>
        <button>Register</button>
        
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-[200px] text-xl">
        <h1>Username or email</h1>
        <input {...register("username", { required: true })}placeholder="Tuchtham0869@gmail.com" />
        <h1>Password</h1>
        <input {...register("password", { required: true })}placeholder="**********" type="password" />
        {errors.exampleRequired && <span>This field is required</span>}
        </div>
      </form>
      <button className="text-center">Login</button>
    </div>
  );
};
export default loginPage;