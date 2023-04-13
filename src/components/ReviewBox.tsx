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
  canDelete: z.boolean(),
  reviewId: z.string(),
});
type FormData = z.infer<typeof formDataSchema>;

const ReviewBox = ({
  rating,
  text,
  userid,
  date,
  canDelete,
  reviewId,
}: FormData) => {
  const user = api.user.getByUserId.useQuery({ userId: userid ?? "Error" });
  const username = user.data?.username;
  const img = user.data?.imageUri;
  const day = date.toDateString().substring(4);
  const datearray = day.split(" ");
  const deleteMutation = api.review.delete.useMutation();
  const reportMutation = api.review.report.useMutation();
  return (
    <div className="flex w-full min-w-fit flex-col items-center rounded-md border-4 bg-amber-50 p-4">
      <div className="grid-rows-8 mx-auto grid w-full grid-cols-3 gap-5">
        <ReviewImage img={img ?? ""} size={4} />
        <div>
          <h1 className="text-l">{username}</h1>
        </div>
        {canDelete && (
          <div
            className=".topcorner{ position:absolute;
            top:0;
            right:0;
            }
           m-1"
          >
            <button
              className="rounded-md border-4 bg-orange-500 p-1 font-bold"
              onClick={async () => {
                await deleteMutation.mutateAsync({ reviewId: reviewId });
                window.location.reload();
              }}
            >
              Delete
            </button>
          </div>
        )}
        {!canDelete && (
          <div
            className=".topcorner{ position:absolute;
            top:0;
            right:0;
            }
           m-1"
          >
            <button
              className="rounded-md border-4 bg-red-500 p-1 font-bold"
              onClick={async () => {
                await reportMutation.mutateAsync({ reviewId: reviewId });
                window.location.reload();
              }}
            >
              Report
            </button>
          </div>
        )}
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
      <h1 className="text-l max-w-lg whitespace-normal break-all">{text}</h1>
    </div>
  );
};
export default ReviewBox;
