import { faArrowLeft, faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

type TabProps = {
  user?: any;
  isAdmin?: boolean;
  isHelpCenter?: boolean;
};

export default function AdminandHelpSideTab(props: TabProps) {
  const [tab, setTab] = useState("Profile");
  const [openTab, setOpenTab] = React.useState(false);

  return (
    <div>
      {/* SIDE TAB */}
      <div
        className={`fixed top-0 z-20 h-screen w-[219px] bg-[#B6B6B6] pt-[30%] sm:relative sm:z-0 sm:h-full ${
          !openTab ? "max-sm:hidden" : ""
        }`}
      >
        <div className="mx-auto my-1 text-center text-2xl font-semibold">
          Welcome Admin
        </div>
        <div className="my-16">
          <div className="flex flex-col  ">
            {/*Dashboard Tab*/}
            <Link
              href={`/user/${props.user?.username}/profile`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
            >
              Dashboard
            </Link>
            {/*Pet Sitters Tab*/}
            <Link
              href={`/user/${props.user?.username}/profile`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
            >
              Pet Sitters
            </Link>
            {/*Review Tab*/}
            <Link
              href={`/user/${props.user?.username}/review`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
            >
              Reviews
            </Link>
            {/*User Reports Tab*/}
            <Link
              href={`/user/${props.user?.username}/profile`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
            >
              User Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
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
