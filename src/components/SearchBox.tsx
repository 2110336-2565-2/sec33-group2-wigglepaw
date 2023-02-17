import { useRouter } from "next/router";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { api } from "../utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RangeSlider from "./RangeSlider";
import { SetStateAction, useEffect, useState } from "react";
import { SearchValues } from "../common/interfaces";
import TwoThumbs from "./TwoThumbs";
interface SearchBoxProps {
  useFormReturn: UseFormReturn<SearchValues>;
  setPetSitters: React.Dispatch<any>;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  useFormReturn,
  setPetSitters,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormReturn;

  const petSitterSort = api.petSitter.searchPetSitter.useQuery(
    {
      searchName: watch("name") as string,
      searchPetType: watch("petType") as string,
      // searchLocation: watch("location") as string,
      searchPriceMin: watch("searchPriceMin") as number,
      searchPriceMax: watch("searchPriceMax") as number,
      searchSortBy: watch("sortby") as string,
      searchIncludePetSitterType: watch("petSitterType") as string,
    },
    {
      enabled: false,
    }
  );

  const onSubmit = async (data: FieldValues) => {
    // alert(JSON.stringify(data));
    await petSitterSort.refetch();
  };

  useEffect(() => {
    if (petSitterSort.status === "success") {
      setPetSitters(petSitterSort.data);
    }
  }, [petSitterSort.status]);

  // console.log(petSitterSort.data)
  // console.log(petSitterSort.status);

  return (
    <form className="w-[90%] md:w-[60%]" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="mb-1 text-2xl font-bold text-sky-800">
        Search for Pet Sitter & Pet Hotel
      </h1>
      <div className="grid grid-cols-1 rounded-md bg-sky-200 md:grid-cols-2">
        <div className="flex w-full min-w-fit justify-start px-4 pt-2">
          <div>
            {/* <form> */}

            <label htmlFor="name">Name</label>
            <br />
            <input
              className="search-input"
              //placeholder="BaanMaewMaa"
              {...register("name")}
            />
            <br />
            {/* check into required true*/}

            {/* <label htmlFor="location">Location</label>
            <br />
            <input
              className="search-input"
              type="text"
              id="location"
              {...register("location")}
            />
            <br /> */}
            <label htmlFor="petType">Pet Type</label>
            <br />
            <input
              className="search-input"
              type="text"
              id="petType"
              list="petName"
              {...register("petType")}
            />
            <datalist id="petName">
              <option value="Cat">Cat</option>
              <option value="Dog">Dog</option>
              <option value="Bird">Bird</option>
            </datalist>
            <br />

            <label>Price Range</label>
            <br></br>
            <br></br>
            <TwoThumbs rtl={false} register={register} setValue={setValue} />
          </div>
        </div>
        <div className="mx-auto w-full min-w-fit px-4 pt-2">
          <h2>Sort By</h2>
          <div className="flex items-center">
            <select className="search-input mr-2 w-3/5" {...register("sortby")}>
              <option value="name">Name</option>
              <option value="pettype">Rating</option>
              <option value="price">Price</option>
              <option value="">None</option>
            </select>
          </div>
          <h3>Pet Sitter Type</h3>
          <div className="flex items-center">
            <select
              className="search-input mr-2 w-3/5"
              {...register("petSitterType")}
            >
              <option value="hotel">Pet Hotel</option>
              <option value="freelance">Freelance</option>
              <option value="">Both</option>
            </select>
          </div>
        </div>
        <div className="flex grid-rows-2 justify-center py-2 md:col-span-2">
          <button
            type="submit"
            value="Submit"
            className="justify-self-center rounded-full bg-sky-700 px-4 py-2 font-bold text-white transition-colors hover:bg-sky-600"
          >
            Search
          </button>
        </div>

        {/* <div className="border- mx-auto w-full min-w-fit bg-sky-200 p-4">
          <h1>Sort By2</h1>
          <div className="flex items-center">
            <select className="mr-2 w-2/5" {...register("petSitterType")}>
              <option value="hotel">Pet Hotel</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div> */}
      </div>
    </form>
  );
};

export default SearchBox;
