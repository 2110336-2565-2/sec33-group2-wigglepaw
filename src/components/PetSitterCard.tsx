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

const PetSitterCard = (props: any) => {
  const name = props.pet_sitter ? props.pet_sitter.username : "NAME";
  const profile_link = props.pet_sitter
    ? "/profile/" + props.pet_sitter.username
    : "/profile/lmao";
  return (
    <div className="drop-shadow-md transition-all hover:scale-[1.03] ">
      <Link
        href={profile_link} // TODO: Link to correct user
        className="m-3 flex h-fit rounded-2xl border border-2 border-solid border-black bg-yellow-50 p-3  transition-colors hover:bg-yellow-200  md:p-5"
      >
        <div className="relative flex w-[4rem] md:w-[5rem]">
          <Image
            src={"/profiledummy.png"}
            alt={"Profile Pic"}
            fill
            className="rounded-2xl object-contain"
          ></Image>
        </div>

        <div className="mx-3 w-fit leading-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faAddressCard} />
            <p className="ml-2"> {name}</p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPaw} />
            <p className=" ml-[0.7rem]"> Husky</p>
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
