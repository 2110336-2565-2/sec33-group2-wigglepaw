import { zodResolver } from "@hookform/resolvers/zod";
import { ContextType, createContext, useContext } from "react";
import { type FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { searchField } from "../../schema/schema";
import MatchingFormProvider from "./MatchingFormProvider";
import SearchBox from "./SearchBox";
import SortAndFilterPanel from "./SortAndFilterPanel";

// TODO: add schedule, rating, ...

const MatchingPanel = () => {
  return (
    <div id="matching-panel" className="mx-auto w-[383px]">
      <MatchingFormProvider>
        <div id="searchbox-wrapper" className="mb-6">
          <SearchBox />
        </div>
        <div id="sort-and-filter-wrapper" className="flex justify-center">
          <SortAndFilterPanel />
        </div>
      </MatchingFormProvider>
    </div>
  );
};

export default MatchingPanel;
