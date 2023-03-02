import * as React from "react";
import { Fragment, useState, useRef } from "react";
import type { NextPage } from "next";
import { api } from "../utils/api";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PetKind } from "@prisma/client";
import Header from "../components/Header";
import { signIn, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Rating } from "react-simple-star-rating";
const ReviewPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const OnSubmit = (data: any) => {
    console.log(data.review);
    console.log(data.rate);
    setHasReview(true);
    closeModal();
  };
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasReview, setHasReview] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const handleRating = (rate: number) => {
    setRating(rate);
  };
  return (
    <div>
      <Header />
      <div className="mt-4 flex h-full flex-col items-center text-xl">
        <h1>Reviews</h1>
        <h2>Average rating : {rating}</h2>
        {!hasReview && <button onClick={openModal}>Write Review</button>}
        {hasReview && <button onClick={openModal}>Edit Review</button>}
        {hasReview && (
          <div className="h-100 w-100 box-content flex flex-col items-center rounded-md border-4 bg-amber-50 p-4">
            <Rating
              initialValue={rating}
              SVGclassName="inline-block"
              size={30}
              readonly
            ></Rating>
            <h1 className="text-base">
              I think this pet sitter is good she is friendly and cost is cheap
            </h1>
          </div>
        )}

        <h2>Review from other users</h2>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="flex flex-col items-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Write your review
                  </Dialog.Title>
                  <div className="flex flex-col items-center">
                    <form onSubmit={handleSubmit(OnSubmit)}>
                      <h1>Enter star</h1>

                      <Rating
                        {...register("rate")}
                        transition={true}
                        onClick={handleRating}
                        className="inline"
                        SVGclassName="inline-block"
                        initialValue={rating}
                      />
                      <br />
                      <h1>Enter your review</h1>
                      <input
                        {...register("review")}
                        type="text"
                        className="block w-full border border-black bg-gray-50"
                      ></input>
                      <br />
                      <div className="grid grid-cols-2">
                        <button onClick={closeModal}>Cancel</button>
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ReviewPage;
