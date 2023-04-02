import { faArrowLeft, faPaw, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

type SideTabProps = {
  user?: any;
  isPetOwner?: boolean;
  booking?: any;
  help?: any;
  admin?: any;
};

export default function SideTab(props: SideTabProps) {
  const [tab, setTab] = useState("Profile");
  const [openTab, setOpenTab] = React.useState(false);

  if (props.booking !== undefined) {
    return (
      <div>
        {/* TAB BUTTON */}
        {OpenSideTabButton()}
        {/* SIDE TAB */}
        <div
          className={`fixed top-0 z-20 h-screen w-[219px] bg-[#E5D4C2] pt-[30%] sm:relative sm:z-0 sm:h-full ${
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
                  href={{
                    pathname: "/chat",
                    query: { username: props.user?.userId },
                  }}
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
  } else if (props.help !== undefined) {
    return (
      <div>
        {/* TAB BUTTON */}
        {OpenSideTabButton()}
        {/* SIDE TAB */}
        <div
          className={`fixed top-0 z-20 h-screen w-[219px] bg-[#B6B6B6] pt-[30%] sm:relative sm:z-0 sm:h-full ${
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
          <div className="mx-auto my-1 text-center text-2xl font-semibold">
            Help Center
          </div>
          <div className="my-16">
            <div className="flex flex-col  ">
              {/*Report problem Tab*/}
              <Link
                href={`/help/reports/new`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Report a Problem
              </Link>
              {/*View My Report Tab*/}
              <Link
                href={`/help/reports`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                View My Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.admin !== undefined) {
    return (
      <div>
        {/* TAB BUTTON */}
        {OpenSideTabButton()}
        {/* SIDE TAB */}
        <div
          className={`fixed top-0 z-20 h-screen w-[219px] bg-[#B6B6B6] pt-[30%] sm:relative sm:z-0 sm:h-full ${
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
          <div className="mx-auto my-1 text-center text-2xl font-semibold">
            Welcome Admin
          </div>
          <div className="my-16">
            <div className="flex flex-col  ">
              {/*Dashboard Tab*/}
              <Link
                href={`/admin/dashborad`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Dashboard
              </Link>
              {/*Pet Sitters Tab*/}
              <Link
                href={`/admin/verification`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Pet Sitters
              </Link>
              {/*Review Tab*/}
              <Link
                href={`/admin/reviews`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Reviews
              </Link>
              {/*User Reports Tab*/}
              <Link
                href={`/admin/reports`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                User Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }

  function OpenSideTabButton() {
    return (
      <div className="top-50 fixed left-0 z-10 block sm:hidden">
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
    );
  }
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
