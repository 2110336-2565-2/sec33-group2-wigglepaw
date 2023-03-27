import * as React from "react";
import { Fragment, useState, useRef } from "react";
import type { NextPage } from "next";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Rating } from "react-simple-star-rating";
import { api } from "../utils/api";
import ReviewImage from "./Profile/ReviewImage";
import { stringify } from "querystring";
const formDataSchema = z.object({
  rating: z.number(),
  text: z.string(),
  userid: z.string(),
  date: z.date(),
});
type FormData = z.infer<typeof formDataSchema>;

const ReviewBox = ({ rating, text, userid, date }: FormData) => {
  const user = api.user.getByUserId.useQuery({ userId: userid ?? "Error" });
  const username = user.data?.username;
  const img = user.data?.imageUri;
  const day = date.toDateString().substring(4);
  const datearray = day.split(" ");
  return (
    <div className="box-content flex min-w-fit flex-col items-center rounded-md border-4 bg-amber-50 p-4">
      <div className="grid-rows-8 mx-auto grid w-full grid-cols-2 gap-5">
        <ReviewImage img={img ?? ""} size={4} />
        <div>
          <br />
          <h1 className="text-l">{username}</h1>
        </div>
      </div>
      <div className="grid-rows-8 mx-auto grid w-full grid-cols-2 gap-5">
        <Rating
          initialValue={rating}
          SVGclassName="inline-block"
          size={30}
          readonly
        ></Rating>
        <div>
          {datearray[1]} {datearray[0]} {datearray[2]}
        </div>
      </div>
      <h1 className="text-l h-100 w-100">{text}</h1>
    </div>
  );
};
export default ReviewBox;
