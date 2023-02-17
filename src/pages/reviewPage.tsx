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
const reviewPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <div>
      <Header />
      <h1>Review Page</h1>
      <form>
        <h2>Write your review</h2>
        <input
          {...register("review")}
          type="text"
          className="w-full rounded px-1"
        />
        <h2>Star</h2>
        <select name="star" id="star">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <br />
        <button>Back</button> <button>submit review</button>
      </form>
    </div>
  );
};
export default reviewPage;
