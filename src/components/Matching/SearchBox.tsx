import Image from "next/image";
import { check } from "prettier";
import { Fragment, useContext, useEffect, useState } from "react";
import { api } from "../../utils/api";
import { MatchingFormContext } from "./MatchingFormProvider";
import PriceRangeInput from "./PriceRangeInput";
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

const SearchBox = () => {
  const {
    useFormReturn: { register, setValue },
  } = useContext(MatchingFormContext);

  // FIXME: redocument this
  // the internals of this state
  const [checkBoxState, setCheckBoxState] = useState(initialCheckBoxState);

  const toggleState = (petType: string) => {
    const updatedCheckBoxState = {
      ...checkBoxState,
      [petType]: !checkBoxState[petType],
    };
    const searchPetTypes = Object.entries(updatedCheckBoxState)
      .filter(([, value]) => value)
      .map((elem) => elem[0]);
    setValue("searchPetTypes", searchPetTypes);
    setCheckBoxState(updatedCheckBoxState);
  };

  const getBgColor = (petType: string): string => {
    return checkBoxState[petType] ? "#633c01" : "#ffffff";
  };

  useEffect(() => {
    const searchPetTypes = Object.entries(checkBoxState)
      .filter(([, value]) => value)
      .map((elem) => elem[0]);
    setValue("searchPetTypes", searchPetTypes);
  }, [checkBoxState, setValue]);

  return (
    <div id="search-box" className="relative drop-shadow-md max-md:w-auto">
      <div id="header-search" className="">
        <Image
          alt="could be a shelter roof, could be a bone. who knows"
          src="/searchBoxHeaderBg.png"
          width={351}
          height={91}
          priority={true}
          className="absolute left-0 right-0 mx-auto max-md:hidden"
        />
        <p className="max-md:w-a absolute left-[2px] top-5 z-20 w-full text-center text-[25px] font-bold text-white drop-shadow-lg max-md:top-0 max-md:left-0 max-md:bg-[#EB945E] max-md:py-2 max-md:text-[18px]">
          Search Pet Sitters
        </p>
      </div>
      <div
        id="empty-space"
        className="mx-auto h-[15px] w-[312px] max-md:hidden"
      ></div>
      <div
        id="search-pane"
        className="mx-auto flex w-[312px] flex-col rounded-xl border-b-2 border-r border-r-[#dabf888d] border-b-[#d2b67d] bg-[#ffdfa0] px-7 pb-6 pt-[72px] max-md:w-auto max-md:pt-[66px]"
      >
        <div id="search-params-wrapper" className="flex flex-col ">
          <div
            id="name-input-wrapper"
            className="mb-2 flex flex-col border-b-[1px] border-[#c89d48] pb-4"
          >
            <p className="text-[18px] font-bold text-[#8a5534] max-md:text-[14px]">
              Name
            </p>
            <input
              className="rounded-md border border-[#633c015d] px-2 py-1 font-extrabold text-[#633c01] placeholder-[#caa79287] focus:border-[#E99548] focus:outline-none focus:ring-2 focus:ring-[#eea663] max-md:text-[14px] "
              placeholder="Sitter Name"
              {...register("searchName")}
            ></input>
          </div>
          <div
            id="pet-types-input-wrapper"
            className="mb-2 flex flex-col border-b-[1px] border-[#c89d48] pb-4 "
          >
            <p className="my-1 text-[18px] font-bold text-[#8a5534] max-md:text-[14px]">
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
                      className="flex h-[25px] w-[25px] select-none flex-col justify-center rounded-md text-center text-xl font-medium text-white shadow-inner drop-shadow-sm max-md:h-[18px] max-md:w-[18px] max-md:text-[14px]"
                      style={{ backgroundColor: getBgColor(petType) }}
                      onClick={() => {
                        toggleState(petType);
                      }}
                    >
                      {checkBoxState[petType] ? "✓" : ""}
                    </div>
                    <p className="text-[15px] font-normal text-[#8a5534] max-md:text-[14px]">
                      {petType}
                    </p>
                  </div>
                </Fragment>
              ))}
              <input hidden {...register("searchPetTypes")}></input>
            </div>
          </div>
          <div id="price-range-input-wrapper" className="flex flex-col ">
            <p className="mb-1 text-[18px] font-bold text-[#8a5534] max-md:text-[15px]">
              Price Range &#40;฿&#41;
            </p>
            <div id="two-thumbs-container" className="mb-6 px-2">
              <PriceRangeInput />
            </div>
          </div>
        </div>

        <div id="search-button-wrapper" className="">
          <button
            type="submit"
            className="drop-shadow-slg w-full rounded-sm bg-[#2a4764] py-2 text-[20px] font-bold text-white duration-150 hover:bg-[#213951] max-md:rounded-lg max-md:text-[14px]"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
