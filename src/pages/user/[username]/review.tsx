import * as React from "react";
import { Fragment, useState, useRef } from "react";
import type { NextPage } from "next";
import { api } from "../../../utils/api";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "../../../components/Header";
import { signIn, useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Rating } from "react-simple-star-rating";
import ReviewBox from "../../../components/ReviewBox";
import { UserType } from "../../../types/user";
import ReviewImage from "../../../components/Profile/ReviewImage";
const ReviewPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const { data: session } = useSession();
  const utils = api.useContext();
  const formDataSchema = z.object({
    petOwnerId: z.string().min(10),
    petSisterId: z.string().min(10),
    review: z.string(),
    rate: z.number().int(),
  });
  const { data: petSitterData, error: userError } =
    api.user.getForProfilePage.useQuery(
      { username: typeof username === "string" ? username : "" },
      {
        enabled: typeof username === "string",
      }
    );
  const { data: petSitterReview, error: userError2 } =
    api.petSitter.getReviewsByUserId.useQuery({
      petSitterId: petSitterData?.userId ?? "Error",
    });
  const Review = () => {
    if (petSitterReview) {
      return petSitterReview.map((review) => (
        <ReviewBox
          key={review.reviewId}
          rating={review.rating}
          text={review.text ?? ""}
          userid={review.petOwnerId}
        />
      ));
    }
    return <div></div>;
  };
  const LastReview = () => {
    if (petSitterReview && user) {
      for (let i = petSitterReview.length; i >= 0; --i) {
        if (petSitterReview[i]?.petOwnerId == user?.userId) {
          return (
            <ReviewBox
              rating={petSitterReview[i]?.rating ?? 0}
              text={petSitterReview[i]?.text ?? ""}
              userid={petSitterReview[i]?.petOwnerId ?? ""}
            />
          );
        }
      }
    }
    return <div></div>;
  };
  const petSitterRating = api.petSitter.getAvgRatingByUserId.useQuery({
    petSitterId: petSitterData?.userId ?? "Error",
  });
  const Rate = petSitterRating.data;
  type FormData = z.infer<typeof formDataSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const mutation = api.review.create.useMutation();
  const user = session?.user;
  const OnSubmit = async (data: FormData) => {
    setHasReview(true);
    if (user && petSitterData) {
      await mutation.mutateAsync({
        petOwnerId: user?.userId,
        petSitterId: petSitterData?.userId,
        review: {
          rating: rating,
          text: data.review,
        },
      });

      await utils.petSitter.getReviewsByUserId.invalidate();
    }

    setText(data.review);
    closeModal();
  };
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
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
  const img = petSitterData?.imageUri;
  return (
    <div>
      <Header />
      <div className="mt-4 flex h-full flex-col items-center text-xl">
        <ReviewImage img={img ?? ""}></ReviewImage>
        <h1 className="font-bold">{petSitterData?.username}</h1>
        <div className="h-100 w-100 box-content flex flex-col items-center rounded-md border-4 bg-green-300 p-4">
          <h1>Reviews</h1>
          <h2>Average rating : {Rate}</h2>
          <button onClick={openModal} className="font-bold">
            Write Review
          </button>
          <LastReview></LastReview>

          <h2>User reviews</h2>

          <div>
            <Review />
          </div>
        </div>
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
