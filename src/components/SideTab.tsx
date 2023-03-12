import { faPaw, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { SetStateAction, useState } from "react";
import { HiUser } from "react-icons/hi";

export default function SideTab() {
  const [tab, setTab] = useState("Profile");
  const [openTab, setOpenTab] = React.useState(false);

  return (
    <div>
      {/* TAB BUTTON HERE */}
      <div className="visible sm:hidden">
        <button
          className={`flex items-center justify-center border hover:bg-gray-500`}
          onClick={() => {
            setOpenTab((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`rounded-full border ${openTab} absolute left-0 top-1 p-1`}
          />
        </button>
      </div>
      {/* SIDE TAB HERE */}
      <div
        className={`min-h-screen w-[219px] border-2 bg-[#E5D4C2] ${
          !openTab ? "max-sm:hidden" : ""
        }`}
      >
        <div className="mx-auto flex h-[135px] w-[135px]  items-center rounded-full border-8 text-center">
          Profile pic goes here
        </div>
        <div className="border text-center">Username goes here</div>
        <div className="my-16">
          <div className="flex flex-col border ">
            {["Profile", "Information", "booking", "Review", "Contact"].map(
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
      className={`h-[58px] w-[219px] border bg-[#B77B59] hover:bg-[#A96037]  ${
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
