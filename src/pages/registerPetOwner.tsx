import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Link from "next/link";
import Header from "../components/Header";
const registerPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  return (
    <div>
      <Header></Header>
      <div className="text-center text-3xl">
      <h1>Register Pet owner</h1>
      <h1>1/2</h1>
      </div>
      <div className="px-[200px] text-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 grid-cols-2">
        <div>First Name<span className="text-red-600">*</span></div><div>Last Name<span className="text-red-600">*</span></div>
        <input {...register("firstname", { required: true })}className="bg-neutral-200" placeholder="Pooh" type="text"/>
        <input {...register("lastname", { required: true })} className="bg-neutral-200"placeholder="Dkomplex" type="text"/>
        </div>
        <h1>Email<span className="text-red-600">*</span></h1>
        <input {...register("email", { required: true })} className="bg-neutral-200"placeholder="DKomplex@hotmail.com" type="email"/>
        <h1>Address<span className="text-red-600">*</span></h1>
        <input {...register("address", { required: true })} className="bg-neutral-200"placeholder="xxxxxxxxxx" type="text"/>
        <h1>Phone No.<span className="text-red-600">*</span></h1>
        <input {...register("phone", { required: true })} className="bg-neutral-200"placeholder="081-234-5678" type="text"/>
        <h1>Username</h1>
        <input {...register("username", { required: true })} className="bg-neutral-200"placeholder="Pooh.dkp" type="text"/>
        <h1>Password</h1>
        <input {...register("password", { required: true })} className="bg-neutral-200"placeholder="********" type="password" />
        <h1>Confirm Password</h1>
        <input {...register("confirmpassword", { required: true })} className="bg-neutral-200"placeholder="********" type="password" />
        <div className="grid gap-4 grid-cols-3">
        <div>Type of pet<span className="text-red-600">*</span> :</div><div> Breed of pet<span className="text-red-600">*</span> :</div><div> Weight of pet<span className="text-red-600">*</span> :</div>
        <input {...register("type", { required: true })} className="bg-neutral-200"placeholder="Cat" type="text" />
        <input {...register("breed", { required: true })} className="bg-neutral-200"placeholder="Persian"type="text" />
        <input {...register("weight", { required: true })} className="bg-neutral-200"placeholder="5-10 kg" type="text" />
        </div>
        </form>
        </div>
        <br/>
        <div className="text-2xl text-center grid gap-1 grid-cols-2 px-[200px]">
        <Link href="/">
        <button className="bg-sky-600">Back</button>
        </Link>
        <Link href="/registerPetOwner2">
        <button className="bg-sky-600">Next</button>
        </Link>
        </div>
    </div>
  );
}
export default registerPage;
