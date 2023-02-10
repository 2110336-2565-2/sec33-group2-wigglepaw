import { useRouter } from "next/router";
import { FieldValues, useForm } from "react-hook-form";
import { api } from "../utils/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RangeSlider from "./RangeSlider";
import TmpRangeSlider from "./TmpRangeSlider";
import { useState } from "react";

const SearchBox: React.FC = () => {
  // const formDataSchema = z.object({
  //   name: z.string().min(1),
  // });

  // type FormData = z.infer<typeof formDataSchema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(formDataSchema),
  });

  // // TODO: how to get the params from the form and send it as a params to the useQuery ?
  // const petSitters = api.petSitter.searchPetSitter.useQuery({
  const petHotels = api.petHotel.getByUsername.useQuery({
    username: watch("name") as string,
  });

  const router = useRouter();
  const petSitterType = router.query["petSitterType"];

  const [test, setTest] = useState(Array<number>());

  const onSubmit = async (data: FieldValues) => {
    // TODO: call the back end router in here

    console.log("ewoafj;oiwe");

    console.log(watch("priceRange"));
    const hotels = petHotels.data;
    console.log(hotels);
    // console.log(data);
    console.log(watch("name"));
    alert(JSON.stringify(data));

    // TODO: once retrieved data from the back end
    // set the result in the matching page to that
    // setResult(result);
  };

  return (
    <div className="border- mx-auto w-3/5 min-w-fit bg-sky-200 p-4">
      <h1>Search for {petSitterType}</h1>
      <div>
        {/* <form> */}
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <RangeSlider setTest={setTest} register={register} />

          <button
            type="submit"
            // type='button'
            value="Submit"
            className="rounded-full bg-sky-700 px-4 py-2 font-bold text-white transition-colors hover:bg-sky-600"
            // onClick={handleSubmit(onSubmit)}
          >
            test
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
