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
  const OnSubmit = async (data: any) => {
    console.log(data.review);
  };
  const avgrate = 4.2;
  const [review, setReview] = useState(false);
  if (review == false) {
    return (
      <div>
        <Header />
        <div className="mt-4 flex h-full flex-col items-center text-xl">
          <h1>Reviews</h1>
          <h2>Average rating : {avgrate}</h2>
          <button onClick={() => setReview(true)}>Write Review</button>
          <h2>Review from other users</h2>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header />
        <div className="mt-4 flex h-full flex-col items-center text-xl">
          <h1>Select star</h1>
          <h2>Write review</h2>
          <form onClick={handleSubmit(OnSubmit)}>
            <input id="Review" type="text" {...register("review")} />
            <button onClick={() => setReview(false)}>Back</button>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
};

export default reviewPage;
