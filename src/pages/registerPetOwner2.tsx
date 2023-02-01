import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Header from "../components/Header";
import Link from "next/link";
const registerPage2: NextPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();
      const onSubmit = (data: any) => console.log(data);
    return(
    <div>
      <Header></Header>
      <div className="text-center text-3xl">
        <h1>Register Pet owner</h1>
        <h1>2/2</h1>
        </div>
        <div className="px-[200px] text-xl">
        <h1>Payment</h1>
        <h2>By card</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Card No.<span className="text-red-600">*</span> </h2>
          <input {...register("cardno", { required: true })} className="bg-neutral-200"placeholder="xxxx xxxx xxxx xxxx"type="text"/>
          <div className="grid gap-4 grid-cols-2">
            <div>Expiration Date<span className="text-red-600">*</span> </div><div>CVV/CVN<span className="text-red-600">*</span></div>
            <input {...register("expdate", { required: true })} className="bg-neutral-200"placeholder="MM / YY"type="date"/>
            <input {...register("cvvcvn", { required: true })} className="bg-neutral-200"placeholder="xxx"type="text"/>
          </div>
        </form>
        <h2>Mobile banking</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 grid-cols-2">
          <div>Bank No.<span className="text-red-600">*</span></div><div> Bank Name<span className="text-red-600">*</span></div>
          <input {...register("bankno", { required: true })} className="bg-neutral-200"placeholder="xxx-x-xxxxx-x"type="text"/> 
          <input {...register("bankname", { required: true })}className="bg-neutral-200"placeholder="SCB" type="text"/>
          </div>
        </form>
        </div>
        <h2 className="px-[200px] text-l">I agree to the terms,conditions and privacy policy</h2>
        <div className="text-2xl text-center grid gap-1 grid-cols-2 px-[200px]">
        <Link href="/registerPetOwner" >
          <button className="bg-sky-600">Back</button>
        </Link>
        <Link href="/home">
          <button className="bg-sky-600">Register</button>
        </Link>
        </div>
    </div>);
}
export default registerPage2;