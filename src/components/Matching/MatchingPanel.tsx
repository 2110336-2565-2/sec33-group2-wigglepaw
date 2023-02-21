import SearchBox from "./SearchBox";
import SortAndFilterPanel from "./SortAndFilterPanel";
const MatchingPanel = () => {
  // TODO: setup the form, and linked to backend
  return (
    <div id="matching-panel" className="mx-auto w-[383px]">
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
