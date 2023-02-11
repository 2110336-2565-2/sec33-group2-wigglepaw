import { useRouter } from "next/router";
import { FieldValues, useForm, UseFormReturn } from "react-hook-form";
import { api } from "../utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RangeSlider from "./RangeSlider";
import TmpRangeSlider from "./TmpRangeSlider";
import { SetStateAction, useState } from "react";
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

  const petHotelsSort = api.petHotel.getByUsernameSortby.useQuery({
    username: watch("name") as string,
    sortby: watch("sortby") as string,
  });

  const router = useRouter();
  const petSitterType = router.query["petSitterType"];

  const onSubmit = async (data: FieldValues) => {
    // TODO: call the back end router in here

    // data.priceRange = test[0]; // way of the CURSE --FIXED

    const hotels = petHotels.data;
    //console.log(hotels);

    //กุเครียด  DATA คืออะไรไปดูที่ back ด้วยโว้ย  หยุดจำทุกอย่าง .data แล้วหวังว่ามันจะมีผลลัพธ์
    console.log(petHotelsSort.data?.petSitter.user?.username);
    setPetSitters(petHotelsSort.data);

    // alert data
    alert(JSON.stringify(data));

    // TODO: once retrieved data from the back end
    // set the result in the matching page to that
    // setResult(result);
  };

  return (
    <form className="w-[60%]" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid  grid-cols-2">
        <div className="border- flex w-full  min-w-fit justify-start bg-sky-200 p-4">
          <div>
            <h1>Search for {petSitterType}</h1>
            {/* <form> */}

            <label htmlFor="name">Name</label>
            <br />
            <input
              placeholder="BaanMaewMaa"
              {...register("name", { required: true })}
            />
            <br />
            {/* check into required true*/}

            <label htmlFor="location">Location</label>
            <br />
            <input type="text" id="location" />
            <br />
            <label htmlFor="petType">Pet Type</label>
            <br />
            <input type="text" id="petType" list="petName" />
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
            {/* <input type="range"
          {...(register("priceRange", {required: true})) }

          >

          </input> */}

            <RangeSlider register={register} setValue={setValue} />

            <button
              type="submit"
              // type='button'
              value="Submit"
              className="rounded-full bg-sky-700 px-4 py-2 font-bold text-white transition-colors hover:bg-sky-600"
              // onClick={handleSubmit(onSubmit)}
            >
              test
            </button>
          </div>
        </div>
        <div className="border- mx-auto w-full min-w-fit bg-sky-200 p-4">
          <h1>Sort By</h1>
          <div className="flex items-center">
            <select
              className="mr-2 w-3/5"
              {...register("sortby", { required: true })}
            >
              <option value="name">Name</option>
              <option value="pettype">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBox;
