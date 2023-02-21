import type { NextPage } from "next";
import SearchBox from "../components/Matching/SearchBox";
import SortAndFilterPanel from "../components/Matching/SortAndFilterPanel";
const DemoSearchBoxComponent: NextPage = () => {
  return (
    <main className="pt-5">
      <div className="mx-auto h-[200vh] w-[383px]">
        <div id="matching-panel" className="">
          <div id="searchbox-wrapper" className="mb-6 ">
            <SearchBox />
          </div>
          <div id="sort-and-filter-wrapper" className="px-[34.4px] ">
            <SortAndFilterPanel />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoSearchBoxComponent;
