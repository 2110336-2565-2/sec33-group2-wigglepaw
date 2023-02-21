import SearchBox from "./SearchBox";
import SortAndFilterPanel from "./SortAndFilterPanel";
const MatchingPanel = () => {
  return (
    <div id="matching-panel" className="">
      <div id="searchbox-wrapper" className="mb-6 ">
        <SearchBox />
      </div>
      <div id="sort-and-filter-wrapper" className="px-[34.4px] ">
        <SortAndFilterPanel />
      </div>
    </div>
  );
};

export default MatchingPanel;
