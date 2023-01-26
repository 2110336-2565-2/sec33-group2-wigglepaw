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
    <div className="flex flex-col gap-2">
      <button>About</button>
      <button>Log in</button>
      <button>Register</button>
      <h1>Register Pet owner</h1>
      <h1>1/2</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>First Name*</h2>
        <input {...register("firstname", { required: true })} type="text"/>
        <h1>Last Name*</h1>
        <input {...register("lastname", { required: true })} type="text"/>
        <h1>Email*</h1>
        <input {...register("email", { required: true })} type="email"/>
        <h1>Address*</h1>
        <input {...register("address", { required: true })} type="text"/>
        <h1>Username</h1>
        <input {...register("username", { required: true })} type="text"/>
        <h1>Password</h1>
        <input {...register("password", { required: true })} type="password" />
        <h1>Confirm Password</h1>
        <input {...register("confirmpassword", { required: true })} type="password" />
        <h1>Type of pet* :</h1>
        <input {...register("type", { required: true })} type="text" />
        <h1>Breed of pet* :</h1>
        <input {...register("breed", { required: true })} type="text" />
        <h1>Weight of pet* :</h1>
        <input {...register("weight", { required: true })} type="text" />
        <button>Back</button>{" "}
        <button>Next</button>
      </form>
    </div>
  );
};
export default registerPage;
