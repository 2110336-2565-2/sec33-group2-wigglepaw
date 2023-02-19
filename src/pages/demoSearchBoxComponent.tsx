import type { NextPage } from "next";
import { Fragment, useState } from "react";
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
    <main className="">
      <div className="mx-auto h-screen w-[312px] border">
        <div
          id="search-box"
          className="flex flex-col  rounded-xl bg-[#ffdfa0] px-7 pb-6"
        >
          <div id="header-search" className=" ">
            <p className="text-[25px] font-bold">Search Pet Sitters</p>
          </div>
          <div id="search-params-wrapper" className="flex flex-col ">
            <div
              id="name-input-wrapper"
              className="mb-2 flex flex-col border-b-[1px] border-[#c89d48] pb-4"
            >
              <p className="text-[15px] font-bold text-[#8a5534]">Name</p>
              <input
                className=" rounded-md border border-[#8a5534] px-2 py-1 text-[#b77b59] placeholder-[#c2c2c2] "
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
                        className="flex h-[25px] w-[25px] select-none flex-col justify-center rounded-sm text-center text-xl font-medium text-white"
                        style={{ backgroundColor: getBgColor(petType) }}
                        onClick={() => {
                          toggleState(petType);
                        }}
                      >
                        <input type="checkbox" hidden></input>
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
              <p className="text-[15px] font-bold text-[#8a5534]">
                Price Range
              </p>
              <div id="two-thumbs" className=" ">
                twoThumbs component & min max
              </div>
            </div>
          </div>

          <div id="search-button-wrapper" className="">
            <button className="drop-shadow-slg w-full bg-[#2a4764] py-2 text-[25px] font-bold text-white hover:bg-[#213951]">
              Search
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoSearchBoxComponent;
