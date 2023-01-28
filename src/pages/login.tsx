import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Header from "../components/Header";

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
      <Header></Header>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Username</h1>
        <input {...register("username", { required: true })} type="email" />
        <h1>Password</h1>
        <input {...register("password", { required: true })} type="password" />
        {errors.exampleRequired && <span>This field is required</span>}
        <h1></h1>
        <input type="submit" />
      </form>
    </div>
  );
};
export default loginPage;
