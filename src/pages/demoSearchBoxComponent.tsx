import type { NextPage } from "next";
import Image from "next/image";
import { Fragment, useState } from "react";
import PriceRangeInput from "../components/PriceRangeInput";
const petTypesList = [
  "Dog",
  "Cat",
  "Hamster",
  "Fish",
  "Mouse",
  "Bird",
  "Snake",
  "Iguana",
  "Ferret",
];

const initialCheckBoxState: { [key: string]: boolean } = petTypesList.reduce(
  (map, petType) => {
    map[petType] = false;
    return map;
  },
  {} as { [key: string]: boolean }
);

const DemoSearchBoxComponent: NextPage = () => {
  const [checkBoxState, setCheckBoxState] = useState(initialCheckBoxState);

  const toggleState = (petType: string) => {
    console.log(!checkBoxState[petType]);
    setCheckBoxState({ ...checkBoxState, [petType]: !checkBoxState[petType] });
  };

  const getBgColor = (petType: string): string => {
    return checkBoxState[petType] ? "#633c01" : "#ffffff";
  };

  return (
    <main className="pt-20">
      <div className="mx-auto h-screen w-[351px]">
        <div id="search-box" className="relative drop-shadow-md">
          <div id="header-search" className="">
            <Image
              alt="could be a shelter roof, could be a bone. who knows"
              src="/searchBoxHeaderBg.png"
              width={351}
              height={91}
              className="absolute"
            />
            <p className="absolute left-[2px] top-5 z-20 w-full text-center text-[25px] font-bold text-white drop-shadow-lg">
              Search Pet Sitters
            </p>
          </div>
          <div id="empty-space" className="mx-auto h-[15px] w-[312px] "></div>
          <div
            id="search-pane"
            className="mx-auto flex w-[312px] flex-col rounded-xl bg-[#ffdfa0] px-7 pb-6 pt-[72px]"
          >
            <div id="search-params-wrapper" className="flex flex-col ">
              <div
                id="name-input-wrapper"
                className="mb-2 flex flex-col border-b-[1px] border-[#c89d48] pb-4"
              >
                <p className="text-[15px] font-bold text-[#8a5534]">Name</p>
                <input
                  className="rounded-md border border-[#8a5534] px-2 py-1 text-[#b77b59] placeholder-[#caa79287] focus:border-[#E99548] focus:outline-none focus:ring-2 focus:ring-[#eea663] "
                  placeholder="Sitter Name"
                ></input>
              </div>
              <div
                id="pet-types-input-wrapper"
                className="mb-2 flex flex-col border-b-[1px] border-[#c89d48] pb-4 "
              >
                <p className="mb-1 mt-1 text-[15px] font-bold text-[#8a5534]">
                  Pet Types
                </p>
                <div
                  id="pet-types-selector"
                  className="grid grid-cols-2 gap-y-3 px-2"
                >
                  {petTypesList.map((petType) => (
                    <Fragment key={petType}>
                      <div className="flex flex-row gap-2">
                        <div
                          className="flex h-[25px] w-[25px] select-none flex-col justify-center rounded-md text-center text-xl font-medium text-white shadow-inner drop-shadow-sm"
                          style={{ backgroundColor: getBgColor(petType) }}
                          onClick={() => {
                            toggleState(petType);
                          }}
                        >
                          <input type="checkbox" hidden className=""></input>
                          {checkBoxState[petType] ? "✓" : ""}
                        </div>
                        <p className="text-[15px] font-normal text-[#8a5534]">
                          {petType}
                        </p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div id="price-range-input-wrapper" className="flex flex-col ">
                <p className="mb-1 text-[15px] font-bold text-[#8a5534]">
                  Price Range
                </p>
                <div id="two-thumbs-container" className="mb-6 px-2">
                  <PriceRangeInput />
                </div>
              </div>
            </div>

            <div id="search-button-wrapper" className="">
              <button className="drop-shadow-slg w-full rounded-sm bg-[#2a4764] py-2 text-[20px] font-bold text-white hover:bg-[#213951]">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoSearchBoxComponent;
