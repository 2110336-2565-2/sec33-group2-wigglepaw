import Header from "../Header";
import Image from "next/image";
import {
  HiAtSymbol,
  HiMap,
  HiPencilAlt,
  HiPhone,
  HiUserCircle,
} from "react-icons/hi";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import type { PetOwnerProfileType, UserProfile } from "../../types/user";
import UploadProfilePicture from "./UploadProfilePicture";

type PetOwnerProfileProps = {
  editable: boolean;
  user: UserProfile & PetOwnerProfileType;
};

const formDataSchema = z.object({
  firstNameLastName: z.string().min(1),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Invalid phone number" }),
  address: z.string().min(1, { message: "Required" }),
  email: z.string().email(),
});

type FormDataInformation = z.infer<typeof formDataSchema>;

const PetOwnerProfile = (props: PetOwnerProfileProps) => {
  const updatePetOwner = api.petOwner.update.useMutation();
  const utils = api.useContext();
  const updateUser = api.user.update.useMutation();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataInformation>({
    resolver: zodResolver(formDataSchema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: FormDataInformation) => {
    const [firstName, lastName] = data.firstNameLastName.split(" ");

    await updatePetOwner.mutateAsync({
      userId: props.user.userId,
      data: { firstName: firstName, lastName: lastName },
    });
    await updateUser.mutateAsync({
      userId: props.user.userId,
      data: {
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
    });

    // Refetch user data
    // console.log("Invalidating cache");
    await utils.user.getByUsername.invalidate({
      username: props.user.username,
    });

    setEditing(false);
  };

  return (
    <div className="min-h-screen">
      <Header></Header>
      <div className="flex min-h-[90vh]">
        <div className="mt-6 max-w-[100vw] px-2">
          <div className="mx-3 flex flex-wrap justify-center">
            <div className="my-auto flex w-screen flex-col md:m-4 md:w-1/5 md:min-w-min">
              <div className="relative mx-auto flex h-[6rem] w-[6rem]">
                <Image
                  src={props.user.imageUri ?? "/profiledummy.png"}
                  alt={"Icon"}
                  fill
                  className="rounded-full object-cover"
                />
                {props.editable && <UploadProfilePicture user={props.user} />}
              </div>
              <h1 className="mx-auto my-1 text-center text-2xl font-semibold">
                {props.user.username}
              </h1>

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
              <div className="profile-information">
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
              </div>
            )}
            {editing && (
              <div className=" mt-2  w-screen  rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
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
                    {errors.firstNameLastName && (
                      <p className=" text-xs italic text-red-500">
                        {errors.firstNameLastName.message}
                      </p>
                    )}
                  </p>
                  <p className="data-field">
                    <HiPhone className="profile-icon" />
                    &nbsp;Phone:&nbsp;
                    <input
                      defaultValue={`${
                        props.user.phoneNumber ? props.user.phoneNumber : ""
                      }`}
                      placeholder="Phone Number"
                      className="profile-input"
                      {...register("phoneNumber", { required: true })}
                    />
                    {errors.phoneNumber && (
                      <p className=" text-xs italic text-red-500">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </p>
                  <p className="data-field">
                    <HiMap className="profile-icon" />
                    &nbsp;Address:&nbsp;
                    <textarea
                      defaultValue={`${
                        props.user.address ? props.user.address : ""
                      }`}
                      placeholder="Address"
                      className="profile-input max-h-40 min-h-[2rem]"
                      {...register("address", { required: true })}
                    />
                    {errors.address && (
                      <p className=" text-xs italic text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </p>
                  <p className="data-field">
                    <HiAtSymbol className="profile-icon" />
                    &nbsp;Email:&nbsp;
                    <input
                      type="email"
                      defaultValue={`${props.user.email}`}
                      placeholder="Email"
                      className="profile-input"
                      {...register("email", { required: true })}
                    />
                    {errors.email && (
                      <p className=" text-xs italic text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </p>

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
        </div>
      </div>
    </div>
  );
};

export default PetOwnerProfile;
