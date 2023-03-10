import SearchBox from "./SearchBox";
import SortAndFilterPanel from "./SortAndFilterPanel";

// TODO: add schedule, rating, ...

const MatchingPanel = () => {
  return (
    <div
      id="matching-panel"
      className="mx-auto mt-6 w-[383px] max-md:-mt-1 max-md:w-auto"
    >
      <div id="searchbox-wrapper" className="mb-6">
        <SearchBox />
      </div>
      <div id="sort-and-filter-wrapper" className="flex justify-center">
        <SortAndFilterPanel />
      </div>
    </div>
  );
};

export default MatchingPanel;
