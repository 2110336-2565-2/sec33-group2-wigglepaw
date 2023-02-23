import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";

export default function SideTab() {
  const [tab, setTab] = useState("Profile");
  return (
    <div className="min-h-screen w-[219px] border-2 bg-[#E5D4C2]">
      <div className="mx-auto flex h-[135px] w-[135px]  items-center rounded-full border-8 text-center">
        Profile pic goes here
      </div>
      <div className="border text-center    ">Username goes here</div>
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
  );
}

interface TabProps {
  tabName: string;
}

function Tab({ tabName }: TabProps) {
  const router = useRouter();
  return (
    <button
      className={`h-[58px] w-[219px] border bg-[#B77B59] hover:bg-[#A96037] ${
        null
        // router.query. === tabName && "h-[58px] w-[239px] bg-[#A96037]"
      } `}
      onClick={() => router.push(`/${tabName}`)}
    >
      {tabName}
    </button>
  );
}
