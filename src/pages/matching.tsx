import { NextPage } from "next";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

const matching: NextPage = () => {
  return (
    <div>
      <Header></Header>
      <SearchBox></SearchBox>
    </div>
  );
};

export default matching;
