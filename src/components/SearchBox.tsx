import { useRouter } from "next/router";

const SearchBox = () => {
  var router = useRouter();
  var petSitterType = router.query["petSitterType"];
  return (
    <div className="mx-auto w-3/5 min-w-fit bg-red-300">
      <h1>Search for {petSitterType}</h1>
      <div></div>
      <button>Search</button>
    </div>
  );
};

export default SearchBox;
