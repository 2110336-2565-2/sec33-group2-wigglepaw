import Header from "../Header";
import Image from "next/image";
import Link from "next/link";

import {
  HiAtSymbol,
  HiMap,
  HiPencilAlt,
  HiPhone,
  HiUserCircle,
} from "react-icons/hi";
import { IoPaw } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { User, PetSitter, FreelancePetSitter } from "@prisma/client";

type FreelancePetSitterProfileProps = {
  editable: boolean;
  user: User & PetSitter & FreelancePetSitter;
};

const FreelancePetSitterProfile = (props: FreelancePetSitterProfileProps) => {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  console.log(watch("example"));

  // TODO: Remove once done
  // Show the user data, for dev and debug
  useEffect(() => {
    console.log(props.user);
  }, [props.user]);

  return (
    <div>
      <Header></Header>
      <div className="mx-3 flex flex-wrap">
        <div className="my-auto flex w-screen flex-col md:w-1/5 md:min-w-min ">
          <div className="relative mx-auto flex h-[6rem] w-[6rem]">
            <Image src={"/profile_icon.png"} alt={"Icon"} fill></Image>
          </div>
          <h1 className="mx-auto my-1 text-center text-2xl font-semibold">
            {props.user.username}
          </h1>
          {/* TODO: Only display for owner of profile */}
          {props.editable && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="profile-edit-button"
            >
              Edit my profile&nbsp;
              <HiPencilAlt className="mt-auto mb-[0.2rem] ml-1 fill-white" />
            </button>
          )}
        </div>

        {!editing && (
          <div className="justify-auto mt-2 flex w-screen flex-wrap rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
            <p className="data-field">
              <HiUserCircle className="profile-icon" />
              &nbsp;Name: {props.user.firstName} {props.user.lastName}
            </p>
            <p className="data-field">
              <HiPhone className="profile-icon" />
              &nbsp;Phone: {props.user.phoneNumber}
            </p>
            <p className="data-field">
              <HiMap className="profile-icon" />
              &nbsp;Address: {props.user.address}
            </p>
            <p className="data-field">
              <HiAtSymbol className="profile-icon" />
              &nbsp;Email: {props.user.email}
            </p>
            <p className="data-field">
              <IoPaw className="profile-icon" />
              &nbsp;Pet Types:{" "}
              {props.user.petTypes.map((petType) => `${petType} `)}
            </p>
          </div>
        )}
        {editing && (
          <div className="justify-auto mt-2 flex w-screen flex-wrap rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* register your input into the hook by invoking the "register" function */}
              <p className="data-field">
                <HiUserCircle className="profile-icon" />
                &nbsp;Name:&nbsp;
                <input
                  defaultValue={`${props.user.firstName} ${props.user.lastName}`}
                  placeholder="Name"
                  className="profile-input"
                  {...register("firstNameLastName", { required: true })}
                />
              </p>
              <p className="data-field">
                <HiPhone className="profile-icon" />
                &nbsp;Phone:&nbsp;
                <input
                  defaultValue={`${props.user.phoneNumber}`}
                  placeholder="Phone Number"
                  className="profile-input"
                  {...register("phoenNumber", { required: true })}
                />
              </p>
              <p className="data-field">
                <HiMap className="profile-icon" />
                &nbsp;Address:&nbsp;
                <textarea
                  defaultValue={`${props.user.address}`}
                  placeholder="Address"
                  className="profile-input max-h-40 min-h-[2rem]"
                  {...register("address", { required: true })}
                />
              </p>
              <p className="data-field">
                <HiAtSymbol className="profile-icon" />
                &nbsp;Email:&nbsp;
                <input
                  defaultValue={`${props.user.email}`}
                  placeholder="Email"
                  className="profile-input"
                  {...register("email", { required: true })}
                />
              </p>
              <p className="data-field">
                <IoPaw className="profile-icon" />
                &nbsp;Pet Types:&nbsp;
                <input
                  defaultValue={`${props.user.petTypes}`}
                  placeholder="Pet Types"
                  className="profile-input"
                  {...register("petTypes", { required: true })}
                />
              </p>

              {/* errors will return when field validation fails  */}
              {errors.exampleRequired && <span>This field is required</span>}

              <div className="mt-3 flex">
                <button
                  onClick={() => setEditing(false)}
                  className="profile-edit-button bg-red-600 hover:bg-red-500"
                >
                  Cancel
                </button>
                <input
                  className="profile-edit-button"
                  type="submit"
                  value="Save profile"
                />
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="mx-3 mt-2 max-w-md sm:w-1/2">
        <h1 className="text-xl font-bold">Posts</h1>
        {/* TODO: Posts display */}
        {/* {users.map((user: any) => (
          <PetSitterCard pet_sitter={user}></PetSitterCard>
        ))} */}
      </div>
    </div>
  );
};

export default FreelancePetSitterProfile;
