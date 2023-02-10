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
import { useState } from "react";
import { useForm } from "react-hook-form";

const FreelancePetSitterProfile = (props: any) => {
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  console.log(watch("example"));

  return (
    <div>
      <Header></Header>
      <div className="mx-3 flex flex-wrap">
        <div className="my-auto flex w-screen flex-col md:w-1/5 md:min-w-min ">
          <div className="relative mx-auto flex h-[6rem] w-[6rem]">
            <Image src={"/profile_icon.png"} alt={"Icon"} fill></Image>
          </div>
          <h1 className="mx-auto my-1 text-center text-2xl font-semibold">
            {props.username}
          </h1>
          {props.editable && (
            <button
              onClick={() => setEditing(!editing)}
              className="mx-auto flex whitespace-nowrap rounded-2xl bg-sky-700 px-3 py-1 text-center font-semibold text-white hover:bg-sky-600"
            >
              Edit my profile{" "}
              <HiPencilAlt className="mt-auto mb-[0.2rem] ml-1 fill-white" />
            </button>
          )}
        </div>

        {!editing && (
          <div className="justify-auto mt-2 flex w-screen flex-wrap rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
            <p className="data-field">
              <HiUserCircle className="profile-icon" /> Name: Jhon Swogvagen
            </p>
            <p className="data-field">
              <HiPhone className="profile-icon" /> Phone: 0123456789
            </p>
            <p className="data-field">
              <HiMap className="profile-icon" />
              &nbsp;Address: 254 Phaya Thai Rd, Wang Mai, Khet Pathum Wan, Krung
              Thep Maha Nakhon 10330
            </p>
            <p className="data-field">
              <HiAtSymbol className="profile-icon" />
              &nbsp;Email: wiggle-paw@chula.ac.th
            </p>
            <p className="data-field">
              <IoPaw className="profile-icon" /> Pet Types:{" "}
            </p>
          </div>
        )}
        {editing && (
          <div className="justify-auto mt-2 flex w-screen flex-wrap rounded-md border-[3px] border-sky-500 p-2 md:mt-0 md:w-3/5">
            {/* <div >
              <p className="data-field">
                <HiUserCircle className="profile-icon" /> Name: Jhon Swogvagen
              </p>
              <p className="data-field">
                <HiPhone className="profile-icon" /> Phone: 0123456789
              </p>
              <p className="data-field">
                <HiMap className="profile-icon" />
                &nbsp;Address: 254 Phaya Thai Rd, Wang Mai, Khet Pathum Wan,
                Krung Thep Maha Nakhon 10330
              </p>
              <p className="data-field">
                <HiAtSymbol className="profile-icon" />
                &nbsp;Email: wiggle-paw@chula.ac.th
              </p>
              <p className="data-field">
                <IoPaw className="profile-icon" /> Pet Types:{" "}
              </p>
            </div> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* register your input into the hook by invoking the "register" function */}

              <p className="data-field flex">
                <HiUserCircle className="profile-icon" /> Name:&nbsp;
                <input
                  defaultValue="Jhon Swogvagen"
                  placeholder="Name"
                  className="inline w-full"
                  {...register("firstName", { required: true })}
                />
              </p>

              {/* errors will return when field validation fails  */}
              {errors.exampleRequired && <span>This field is required</span>}

              <input type="submit" />
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
