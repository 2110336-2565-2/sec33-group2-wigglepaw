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
const formDataSchema = z.object({
  rating: z.number(),
  text: z.string(),
  userid: z.string(),
});
type FormData = z.infer<typeof formDataSchema>;

const ReviewBox = ({ rating, text, userid }: FormData) => {
  const user = api.user.getByUserId.useQuery({ userId: userid ?? "Error" });
  const username = user.data?.username;
  return (
    <div className="h-100 w-100 box-content flex flex-col items-center rounded-md border-4 bg-amber-50 p-4">
      <Rating
        initialValue={rating}
        SVGclassName="inline-block"
        size={30}
        readonly
      ></Rating>
      <h1 className="text-l">- by {username}</h1>
      <h1 className="text-base">{text}</h1>
    </div>
  );
};
export default ReviewBox;
