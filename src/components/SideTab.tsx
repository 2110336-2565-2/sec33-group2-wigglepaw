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

type SideTabProps = {
  user?: UserProfile & PetSitterProfileType & FreelancePetSitterProfileType;
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
        className={`fixed top-0 z-30 h-screen  w-[219px] bg-[#E5D4C2] pt-[30%] sm:relative  ${
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
            {["Profile", "Information", "Booking", "Review", "Contact"].map(
              (tabName) => (
                <Tab tabName={tabName}></Tab>
              )
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

function Tab({ tabName }: TabProps) {
  const router = useRouter();
  return (
    <button
      className={`h-[58px] w-[219px] border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]  ${
        null
        // router.query. === tabName && "h-[58px] w-[239px] bg-[#A96037]"
      } `}
      onClick={() => router.push(`/${tabName}`)}
    >
      {tabName}
    </button>
  );
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
