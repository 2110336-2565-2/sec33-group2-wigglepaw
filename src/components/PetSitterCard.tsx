import { PetSitter, User } from "@prisma/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {
  faAddressCard,
  faMap,
  faPaw,
  faStar,
  faW,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";

interface PetSitterCardProps {
  pet_sitter: (PetSitter & { user: User }) | null;
}

const PetSitterCard = ({ pet_sitter }: PetSitterCardProps) => {
  // console.log("yoyo");
  // console.log(pet_sitter);
  const name = pet_sitter ? pet_sitter.user.username : "NAME";
  const petTypes = pet_sitter ? pet_sitter.petTypes : ["Husky"];
  const profile_link = pet_sitter
    ? "/user/" + pet_sitter.user.username
    : "/user/lmao";
  const profileImageUri = pet_sitter
    ? pet_sitter.user
      ? pet_sitter.user.imageUri
      : "/profiledummy.png"
    : "/profiledummy.png";
  return (
    <div className="drop-shadow-md transition-all hover:scale-[1.03] ">
      <Link
        href={profile_link}
        className="m-3 flex h-fit rounded-2xl border border-2 border-solid border-black bg-yellow-50 p-3  transition-colors hover:bg-yellow-200  md:p-5"
      >
        <div className="relative flex w-[4rem] md:w-[5rem]">
          <Image
            src={profileImageUri}
            alt={"Profile Pic"}
            fill
            className="rounded-2xl object-contain"
          ></Image>
        </div>

        <div className="mx-3 w-[100%] leading-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faAddressCard} />
            <p className="ml-2"> {name}</p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPaw} />
            <p className=" ml-[0.7rem]">
              {petTypes.map((petType) => `${petType} `)}
            </p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faStar} />
            <p className="ml-2"> 3 Stars</p>
          </div>
        </div>
        <div className="my-auto ml-auto w-fit text-center md:mr-4">
          <FontAwesomeIcon icon={faMap} />

          <p>5.0 km</p>
        </div>
      </Link>
    </div>
  );
};

export default PetSitterCard;
