import { faArrowLeft, faPaw, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Image from "next/image";
import {
  FreelancePetSitterProfileType,
  PetSitterProfileType,
  UserProfile,
} from "../types/user";
import Link from "next/link";

type SideTabProps = {
  user?: UserProfile & PetSitterProfileType & FreelancePetSitterProfileType;
  isPetOwner?: boolean;
};

export default function SideTab(props: SideTabProps) {
  const [tab, setTab] = useState("Profile");
  const [openTab, setOpenTab] = React.useState(false);

  return (
    <div>
      {/* TAB BUTTON */}
      <div className="top-50 fixed left-0 block sm:hidden">
        <button
          className={`flex items-center justify-center`}
          onClick={() => {
            setOpenTab((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`rounded-full border ${openTab} bg-gray-400 p-1`}
          />
        </button>
      </div>
      {/* SIDE TAB */}
      <div
        className={`s fixed top-0 z-30 h-screen  w-[219px] bg-[#E5D4C2] pt-[30%] sm:relative sm:h-full  ${
          !openTab ? "max-sm:hidden" : ""
        }`}
      >
        {/* Close Button */}
        <div className="top-50 absolute right-0 block sm:hidden">
          <button
            className={`flex items-center justify-center`}
            onClick={() => {
              setOpenTab((prev) => !prev);
            }}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className={`rounded-full border ${openTab} bg-gray-400 p-1`}
            />
          </button>
        </div>
        <div className="relative mx-auto flex h-[135px] w-[135px]">
          <Image
            src={props.user?.imageUri ?? "/profiledummy.png"}
            alt={"Profile Picture"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="mx-auto my-1 text-center text-2xl font-semibold">
          {props.user?.username}
        </div>
        <div className="my-16">
          <div className="flex flex-col border ">
            {/*Profile Tab*/}
            <Link
              href={`/user/${props.user?.username}/profile`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
            >
              Profile
            </Link>
            {/*Booking Tab*/}
            {props.isPetOwner && (
              <Link
                href={`/user/${props.user?.username}/booking`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
              >
                Booking
              </Link>
            )}
            {/*Review Tab*/}
            <Link
              href={`/user/${props.user?.username}/review`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
            >
              Review
            </Link>
            {/*Contact Tab*/}
            {props.isPetOwner && (
              <Link
                href={`/user/${props.user?.username}/chat`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
              >
                Chat
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TabProps {
  tabName: string;
}

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  openTab: boolean;
  setOpenTab: (value: React.SetStateAction<boolean>) => void;
}

function TabButton({
  openTab,
  setOpenTab,
  className,
  ...rest
}: TabButtonProps) {
  return (
    <button
      className={`flex items-center justify-center border hover:bg-gray-500 ${className} `}
      onClick={() => {
        setOpenTab((prev) => !prev);
      }}
    >
      <FontAwesomeIcon
        icon={faPaw}
        className={`rounded-full border ${openTab} p-1`}
      />
    </button>
  );
}
