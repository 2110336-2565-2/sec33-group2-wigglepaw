import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useState } from "react";

type TabProps = {
  user?: any;
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
          Help Center
        </div>
        <div className="my-16">
          <div className="flex flex-col  ">
            {/*Report problem Tab*/}
            <Link
              href={`/user/${props.user?.username}/profile`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
            >
              Report a Problem
            </Link>
            {/*View My Report Tab*/}
            <Link
              href={`/user/${props.user?.username}/profile`}
              className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
            >
              View My Report
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
