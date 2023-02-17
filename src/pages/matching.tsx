import * as React from "react";
import { useState } from "react";
import { NextPage } from "next";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";

import PetSitterCard from "../components/PetSitterCard";

import { number } from "zod";
import { useForm } from "react-hook-form";

const matching: NextPage = () => {
  // const users = props.users;
  const pageNum = 1;

  const [petSitters, setPetSitters] = useState([]);

  React.useEffect(() => {
    //console.log("hhh ", petSitters);
  }, [petSitters]);

  let apage = [1, 2, 3, 4, 5];
  const [cpage, setCpage] = useState(0);
  const Pagelay = () => {
    const hi = apage.map((element) => {
      return (
        <>
          <div
            className={
              "mx-4 mb-5 flex items-center justify-evenly rounded-full text-white transition-all hover:scale-[1.15] " +
              (element === cpage
                ? " h-10 w-10 bg-yellow-200 text-sm text-black"
                : " h-7 w-7 bg-yellow-100 text-sm text-black")
            }
            onClick={() => {
              setCpage(element);
            }}
          >
            <p>{element}</p>
          </div>
        </>
      );
    });
    return <>{hi}</>;
  };

  const onSubmitpage = (e: any) => {
    e.preventDefault();
    setCpage(parseInt(e.target.page.value));
  };
  const useFormReturn = useForm({
    defaultValues: {
      name: "",
      searchPriceMin: 0,
      searchPriceMax: 1000,
      sortby: "",
      petSitterType: "",
    },
    // resolver: zodResolver(formDataSchema),
  });

  return (
    <div>
      <Header></Header>
      <div className="flex justify-center">
        <SearchBox
          useFormReturn={useFormReturn}
          setPetSitters={setPetSitters}
        ></SearchBox>
      </div>
      <div className="flex justify-center pt-5">
        <div className="w-[90%] md:w-[60%]">
          <div className="flex justify-between">
            <h1 className="text-xl font-bold text-yellow-500">Results</h1>
            <form className="w-fit" onSubmit={onSubmitpage}>
              <input
                className="w-[5rem] rounded bg-zinc-100 px-2 py-1 text-center text-sm font-semibold text-[#213951]  hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 "
                id="page"
                type="number"
                min={1}
                max={5}
              />
              <button className="rounded-xl bg-yellow-200 px-2">Search</button>
            </form>
          </div>
          <div className="mt-5 lg:grid lg:grid-cols-2">
            {petSitters?.map((user: any) => (
              <PetSitterCard pet_sitter={user}></PetSitterCard>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-center">
            <Pagelay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default matching;
