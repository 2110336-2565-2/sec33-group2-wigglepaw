import { useRouter } from "next/router";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { api } from "../utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RangeSlider from "./RangeSlider";
import { SetStateAction, useEffect, useState } from "react";
import { SearchValues } from "../common/interfaces";
interface SearchBoxProps {
  useFormReturn: UseFormReturn<SearchValues>;
  setPetSitters: React.Dispatch<any>;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  useFormReturn,
  setPetSitters,
}) => {
  // const formDataSchema = z.object({
  //   name: z.string().trim().min(1),
  //   priceRange: z.number(),
  // });

  // type FormData = z.infer<typeof formDataSchema>;
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormReturn;

  // // TODO: how to get the params from the form and send it as a params to the useQuery ?
  // const petSitters = api.petSitter.searchPetSitter.useQuery({
  const petHotels = api.petHotel.getByUsername.useQuery({
    username: watch("name") as string,
  });

  const petSitterSort = api.petSitter.searchPetSitter.useQuery({
    searchName: watch("name") as string,
    searchPetType: watch("petType") as string,
    searchLocation: watch("location") as string,
    searchPriceMax: watch("priceRange") as number,
    searchSortBy: watch("sortby") as string,
    searchIncludePetSitterType: watch("petSitterType") as string,
  });
  useEffect(() => {
    setPetSitters(petSitterSort.data);
  }, [petSitterSort]);

  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    // TODO: call the back end router in here

    // data.priceRange = test[0]; // way of the CURSE --FIXED

    //console.log(hotels);

    //console.log(petHotelsSort.data?.petSitter.user?.username);

    // alert data
    alert(JSON.stringify(data));

    // TODO: once retrieved data from the back end
    // set the result in the matching page to that
    // setResult(result);
  };

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

            <label htmlFor="location">Location</label>
            <br />
            <input
              className="search-input"
              type="text"
              id="location"
              {...register("location")}
            />
            <br />
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

            {/* TODO: passed a state onto the inner component of the range slider*/}

            {/* slider is work in progress */}
            {/* <div> */}
            {/* <label htmlFor="priceRange">Price Range</label>

            <input type="range"
              min="0"
              max="100"
              value={50}
              onChange={e => {
                setPriceValue(e.target.value);
              }}
            /> */}

            {/* <RangeSlider/> */}
            {/* <TmpRangeSlider/> */}
            {/* </div> */}

            <label>Price Range</label>
            <br></br>
            {/* <input type="range"
          {...(register("priceRange", {required: true})) }

          >

          </input> */}
            <br></br>
            <RangeSlider register={register} setValue={setValue} />
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
