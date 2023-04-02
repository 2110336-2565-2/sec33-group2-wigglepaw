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
              href={`/admin/Dashborad`}
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
}

interface TabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  openTab: boolean;
  setOpenTab: (value: React.SetStateAction<boolean>) => void;
}
