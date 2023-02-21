import { Fragment, useState } from "react";

const SortAndFilterPanel = () => {
  // TODO: convert to "hotel" and "freelance" for backend
  const petSitterTypeList = ["Pet Hotel", "Freelance"];

  const initialCheckBoxState: { [key: string]: boolean } =
    petSitterTypeList.reduce((map, petSitterType) => {
      map[petSitterType] = false;
      return map;
    }, {} as { [key: string]: boolean });

  const [checkBoxState, setCheckBoxState] = useState(initialCheckBoxState);

  const toggleState = (petSitterType: string) => {
    console.log(!checkBoxState[petSitterType]);
    setCheckBoxState({
      ...checkBoxState,
      [petSitterType]: !checkBoxState[petSitterType],
    });
  };

  const getBgColor = (petSitterType: string): string => {
    return checkBoxState[petSitterType] ? "#633C01" : "#ffffff";
  };

  const sortByOptions = ["Name", "Review", "Price"];

  return (
    <div
      id="sort-filter-pane"
      className="w-[312px] rounded-xl border border-[#633C01] py-5"
    >
      <div id="sort-panel" className="px-7">
        <p className="mb-1 text-[18px] font-bold text-[#633C01]">
          Sort Results By
        </p>
        <div className="text-center">
          <select
            className="font-regular w-full rounded-sm border border-[#633c01] bg-[#eeeeee] py-2  px-1 text-[15px] text-[#633c01]
              focus:border-[#633c01] focus:outline-none focus:ring-2 focus:ring-[#633c01]"
          >
            <option value="" disabled selected hidden>
              Choose a filter
            </option>
            {sortByOptions.map((sortByOption) => (
              <option key={sortByOption} value={sortByOption}>
                {sortByOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="separator" className="my-2 h-2 border-b border-[#633C01]"></div>
      <div id="filter-panel" className="px-7">
        <p className="my-1 text-[18px] font-bold text-[#633C01]">
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
                  className="flex h-[25px] w-[25px] select-none flex-col justify-center rounded-md text-center text-xl font-medium text-white shadow-inner"
                  style={{
                    backgroundColor: getBgColor(petSitterType),
                    borderWidth: checkBoxState[petSitterType] ? "0px" : "1.5px",
                  }}
                  onClick={() => {
                    toggleState(petSitterType);
                  }}
                >
                  <input type="checkbox" hidden className=""></input>
                  {checkBoxState[petSitterType] ? "✓" : ""}
                </div>
                <p className="text-[15px] font-normal text-[#633C01]">
                  {petSitterType}
                </p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortAndFilterPanel;
