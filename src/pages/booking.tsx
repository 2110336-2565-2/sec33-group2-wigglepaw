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
import Link from "next/link";
const booking: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div>
      <Header></Header>
      <h1>Booking</h1>
      <form className=" h-full w-2/3 ">
        <div className="flex justify-between gap-12">
          <div>
            <h2>
              Date From*:
              <input
                {...register("datefrom", { required: true })}
                type="date"
                className="w-full rounded px-1"
              />
            </h2>
            <h2>
              To*:
              <input
                {...register("dateto", { required: true })}
                type="date"
                className="w-full rounded px-1"
              />
            </h2>
          </div>
          <div>
            <h2>
              Time*:
              <input
                {...register("timefrom", { required: true })}
                type="time"
                className="w-full rounded px-1"
              />
            </h2>
            <h2>
              Time*:
              <input
                {...register("timeto", { required: true })}
                type="time"
                className="w-full rounded px-1"
              />
            </h2>
          </div>
        </div>
        <h2>
          Number of pet*:
          <input
            {...register("numpet", { required: true })}
            type="int"
            className="w-full rounded px-1"
          />
        </h2>
        <h2>
          Type of pet*:
          <input
            {...register("typepet", { required: true })}
            type="text"
            className="w-full rounded px-1"
          />
        </h2>
        <h2>
          Breed of pet*:
          <input
            {...register("breedpet", { required: true })}
            type="text"
            className="w-full rounded px-1"
          />
        </h2>
        <h2>
          Weight of pet*:
          <input
            {...register("weightpet", { required: true })}
            type="int"
            className="w-full rounded px-1"
          />
        </h2>
        <h2>
          Note:
          <input
            {...register("note")}
            type="text"
            className="w-full rounded px-1"
          />
        </h2>
        <button>Send Booking request</button>
      </form>
    </div>
  );
};
export default booking;
