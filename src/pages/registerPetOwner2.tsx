import * as React from "react";
import { useState } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";

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
        <button>About</button>
        <button>Log in</button>
        <button>Register</button>
        <h1>Register Pet owner</h1>
        <h1>2/2</h1>
        <h1>Payment</h1>
        <h2>By card</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Card No.<span className="text-red-600">*</span> </h2>
          <input {...register("cardno", { required: true })} placeholder="xxxx xxxx xxxx xxxx"type="text"/>
          <div className="grid gap-4 grid-cols-2">
            <div>Expiration Date<span className="text-red-600">*</span> </div><div>CVV/CVN<span className="text-red-600">*</span></div>
            <input {...register("expdate", { required: true })} placeholder="MM / YY"type="date"/>
            <input {...register("cvvcvn", { required: true })} placeholder="xxx"type="text"/>
          </div>
        </form>
        <h2>Mobile banking</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 grid-cols-2">
          <div>Bank No.<span className="text-red-600">*</span></div><div> Bank Name<span className="text-red-600">*</span></div>
          <input {...register("bankno", { required: true })} placeholder="xxx-x-xxxxx-x"type="text"/> 
          <input {...register("bankname", { required: true })}placeholder="SCB" type="text"/>
          </div>
        </form>
        <h2>I agree to the terms,condirions and privacy policy</h2>
        <button>Back</button>
        {" "}
        <button>Register</button>
    </div>);
}
export default registerPage2;