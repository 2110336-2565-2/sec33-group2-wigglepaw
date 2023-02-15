import Header from "../Header";
import Image from "next/image";
import Link from "next/link";

import { HiPencilAlt } from "react-icons/hi";

const infomationSection = "flex flex-wrap";

const FreelancePetSitterProfile = (props: any) => {
  return (
    <div>
      <Header></Header>
      <div className={infomationSection}>
        <div className="flex w-screen flex-col md:w-1/5">
          <div className="relative mx-auto flex h-[6rem] w-[6rem]">
            <Image src={"/profile_icon.png"} alt={"Icon"} fill></Image>
          </div>
          <p className="mx-auto my-1 text-center text-xl font-semibold">
            {props.username}
          </p>
          <Link
            href={`/user/${props.username}/edit`}
            className="mx-auto flex rounded-2xl bg-sky-700 px-3 py-1 text-center text-white hover:bg-sky-600"
          >
            Edit my profile{" "}
            <HiPencilAlt className="mt-auto mb-[0.2rem] ml-1 fill-white" />
          </Link>
        </div>

        <div className="justify-auto mt-2 flex w-screen flex-wrap md:w-3/5">
          <p className="w-full">Name: Jhon Swogvagen</p>
          <p>Pet types: </p>
          <p className="w-full">Phone: 0123456789</p>
          <p className="w-full">
            Address: 254 Phaya Thai Rd, Wang Mai, Khet Pathum Wan, Krung Thep
            Maha Nakhon 10330
          </p>
          <p className="w-full">Email: wiggle-paw@chula.ac.th</p>
        </div>
      </div>
      <div className="mx-auto mt-3 w-screen max-w-md sm:w-1/2">
        <h1 className="font-bold">Posts</h1>
        {/* TODO: Posts display */}
        {/* {users.map((user: any) => (
          <PetSitterCard pet_sitter={user}></PetSitterCard>
        ))} */}
      </div>
    </div>
  );
};

export default FreelancePetSitterProfile;
