import { Fragment, useContext, useState } from "react";
import { MatchingFormContext } from "./MatchingFormProvider";

// key : frontend display, value: backend input
const petSitterTypeList = ["Pet Hotel", "Freelance"];

const sortByOptions = {
  Name: "name",
  Price: "price",
  "Start Price": "startPrice",
  "End Price": "endPrice",
};

const SortAndFilterPanel = () => {
  const {
    useFormReturn: { register, setValue },
  } = useContext(MatchingFormContext);

  const initialCheckBoxState: { [key: string]: boolean } =
    petSitterTypeList.reduce((map, petSitterType) => {
      map[petSitterType] = true; // search both hotel and freelance by default
      return map;
    }, {} as { [key: string]: boolean });

  const [checkBoxState, setCheckBoxState] = useState(initialCheckBoxState);

  const toggleState = (petSitterType: string) => {
    let params;
    if (petSitterType === "Pet Hotel") {
      params = "searchIncludePetHotel";
    } else {
      params = "searchIncludeFreelancePetSitter";
    }
    setValue(params, !checkBoxState[petSitterType]);

    const updatedCheckBoxState = {
      ...checkBoxState,
      [petSitterType]: !checkBoxState[petSitterType],
    };
    setCheckBoxState(updatedCheckBoxState);
  };

  const getBgColor = (petSitterType: string): string => {
    return checkBoxState[petSitterType] ? "#633C01" : "#ffffff";
  };

  return (
    <div
      id="sort-filter-pane"
      className="w-[312px] rounded-xl border border-[#633c015d] py-5"
    >
      <div id="sort-panel" className="px-7">
        <p className="mb-1 text-[18px] font-bold text-[#633C01]">
          Sort Results By
        </p>
        <div className="text-center">
          <select
            className="font-regular w-full rounded-sm border border-[#633c015d] bg-[#eeeeee] py-2 px-1 text-[15px]  text-[#633c01] duration-150 hover:bg-[#dbdbdb]
              focus:border-[#633c01] focus:outline-none focus:ring-1 focus:ring-[#633c01]"
            {...register("searchSortBy")}
          >
            <option value="" disabled selected hidden>
              Choose a filter
            </option>
            {Object.entries(sortByOptions).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        id="separator"
        className="mt-2 mb-4 h-2 border-b border-[#633c015d]"
      ></div>
      <div id="filter-panel" className="px-7">
        <p className="my-2 text-[18px] font-bold text-[#633C01]">
          Filter Pet Sitter Type
        </p>

        <div
          id="sitter-type-checkbox-wrapper"
          className="flex flex-col gap-3 px-2"
        >
          {petSitterTypeList.map((petSitterType) => (
            <Fragment key={petSitterType}>
              <div className="flex flex-row gap-2">
                <div
                  style={{
                    backgroundColor: getBgColor(petSitterType),
                    borderWidth: checkBoxState[petSitterType] ? "0px" : "1.5px",
                  }}
                  className="flex h-[25px] w-[25px] select-none flex-col justify-center rounded-md text-center text-xl font-medium text-white shadow-inner"
                  onClick={() => {
                    toggleState(petSitterType);
                  }}
                >
                  {checkBoxState[petSitterType] ? "✓" : ""}
                </div>
                <p className="text-[15px] font-normal text-[#633C01]">
                  {petSitterType}
                </p>
              </div>
            </Fragment>
          ))}
          <input hidden {...register("searchIncludePetSitterType")}></input>
        </div>
      </div>
    </div>
  );
};

export default SortAndFilterPanel;
