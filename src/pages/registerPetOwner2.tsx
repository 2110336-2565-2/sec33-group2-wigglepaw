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
    return(<div>
        <button>About</button>
        <button>Log in</button>
        <button>Register</button>
        <h1>Register Pet owner</h1>
        <h1>2/2</h1>
        <h1>Payment</h1>
        <h2>By card</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Card No.*</h2>
        <input {...register("cardno", { required: true })} type="text"/>
        <h2>Expiration Date*</h2>
        <input {...register("expdate", { required: true })} type="date"/>
        <h2>CVV/CVN*</h2>
        <input {...register("cvvcvn", { required: true })} type="text"/>
      </form>
      <h2>Mobile banking</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Bank No.*</h2>
        <input {...register("bankno", { required: true })} type="text"/>
        <h2>Bank Name*</h2>
        <input {...register("bankname", { required: true })} type="text"/>
      </form>
      <h2>I agree to the terms,condirions and privacy policy</h2>
      <button>Back</button>
      {" "}
      <button>Register</button>
    </div>)
}
export default registerPage2;