import * as React from "react";
import { Fragment, useState, useRef } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { Rating } from "react-simple-star-rating";
const reviewPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const OnSubmit = async (data: any) => {
    console.log(data.review);
    closeModal();
  };
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleReset = () => {
    // Set the initial value
    setRating(0);
  };
  const avgrate = 4.2;
  return (
    <div>
      <Header />
      <div className="mt-4 flex h-full flex-col items-center text-xl">
        <h1>Reviews</h1>
        <h2>Average rating : {avgrate}</h2>
        <button onClick={openModal}>Write Review</button>
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
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Write your review
                  </Dialog.Title>
                  <div>
                    <form onSubmit={OnSubmit}>
                      <h1>Enter star</h1>
                      <Rating
                        transition={true}
                        onClick={handleRating}
                        className="inline"
                        SVGclassName="inline-block"
                      />
                      <br />

                      {rating}
                      <button onClick={handleReset}>reset</button>
                      <h1>Enter your review</h1>
                      <input id="review" type="text"></input>
                      <br />
                      <button onClick={closeModal}>Cancel</button>
                      <br />
                      <button type="submit">Submit</button>
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

export default reviewPage;
