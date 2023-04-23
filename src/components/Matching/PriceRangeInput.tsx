import Image from "next/image";
import { FocusEvent, Fragment, useContext, useState } from "react";
import { Range, getTrackBackground } from "react-range";
import { MatchingFormContext } from "./MatchingFormProvider";

const STEP = 100;
const MIN = 0;
const MAX = 10000;
const BEGIN_MIN = 250;
const BEGIN_MAX = 7000;

const PriceRangeInput = () => {
  const [values, setValues] = useState([BEGIN_MIN, BEGIN_MAX]);

  const {
    useFormReturn: {
      register,
      setValue,
      formState: { errors },
    },
  } = useContext(MatchingFormContext);

  return (
    <Fragment>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
        className=""
      >
        <Range
          values={values}
          step={STEP}
          min={MIN}
          max={MAX}
          rtl={false}
          onChange={(values) => {
            if (values[0] && values[1]) {
              setValue("searchPriceMin", values[0], { shouldValidate: true });
              setValue("searchPriceMax", values[1], { shouldValidate: true });
              setValues(values);
            }
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                display: "flex",
              }}
              className="h-[36px] w-full flex-row justify-center max-md:h-[20px]"
            >
              <div
                ref={props.ref}
                style={{
                  borderRadius: "4px",
                  background: getTrackBackground({
                    values,
                    colors: ["#EBC380", "#442900", "#EBC380"],
                    min: MIN,
                    max: MAX,
                    rtl: false,
                  }),
                  alignSelf: "center",
                }}
                className="h-[10px] w-full max-md:h-[6px]"
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              className="focus:outline-none max-md:h-[20px] max-md:w-[18px]"
              {...props}
              style={{
                ...props.style,
                height: "30px",
                width: "32px",
              }}
            >
              <Image src={"/sliderThumb.png"} fill alt={"slider thumb"} />
            </div>
          )}
        />

        <div id="min-max-label" className="flex flex-row justify-center gap-1">
          <div id="searchPriceMin-input-wrapper" className="flex flex-col">
            <label>
              <p className="text-[15px] font-medium text-[#8a5534] max-md:text-[13px]">
                Min
              </p>
            </label>
            <input
              className="w-[90px] rounded-md border border-[#633c015d] px-2 py-1 text-center font-extrabold text-[#633c01] focus:border-[#E99548] focus:outline-none focus:ring-2 focus:ring-[#eea663] max-md:text-[14px]"
              {...register("searchPriceMin", {
                value: values[0],
                valueAsNumber: true,
              })}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (
                  e.key === "Enter" &&
                  ((e.target as HTMLInputElement).value as unknown as number) >
                    0 &&
                  ((e.target as HTMLInputElement).value as unknown as number) <
                    (values[1] ?? MAX)
                ) {
                  setValues([
                    (e.target as HTMLInputElement).value as unknown as number,
                    values[1] as number,
                  ]);
                }
              }}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (
                  ((e.target as HTMLInputElement).value as unknown as number) >
                    0 &&
                  ((e.target as HTMLInputElement).value as unknown as number) <
                    (values[1] ?? MAX)
                ) {
                  setValues([
                    (e.target as HTMLInputElement).value as unknown as number,
                    values[1] as number,
                  ]);
                }
              }}
            />
            {errors.searchPriceMin && (
              <span className="text-[10px] text-red-500">invalid input</span>
            )}
          </div>
          <div id="separator-container" className="flex flex-col pt-[38px]">
            <div
              id="separator-icon"
              className="h-1 w-12 rounded-[50%] bg-[#c89d48]"
            ></div>
          </div>
          <div id="searchPriceMax-input-wrapper" className="flex flex-col">
            <label>
              <p className="text-[15px] font-medium text-[#8a5534] max-md:text-[13px] ">
                Max
              </p>
            </label>
            <input
              className="w-[90px] rounded-md border border-[#633c015d] px-2 py-1 text-center font-extrabold text-[#633c01] focus:border-[#E99548] focus:outline-none focus:ring-2 focus:ring-[#eea663] max-md:text-[14px]"
              {...register("searchPriceMax", {
                value: values[1],
                valueAsNumber: true,
              })}
              onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (
                  e.key === "Enter" &&
                  ((e.target as HTMLInputElement).value as unknown as number) <
                    MAX &&
                  ((e.target as HTMLInputElement).value as unknown as number) >
                    (values[0] ?? MIN)
                ) {
                  setValues([
                    values[0] as number,
                    (e.target as HTMLInputElement).value as unknown as number,
                  ]);
                }
              }}
              onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (
                  ((e.target as HTMLInputElement).value as unknown as number) <
                    MAX &&
                  ((e.target as HTMLInputElement).value as unknown as number) >
                    (values[0] ?? MIN)
                ) {
                  setValues([
                    values[0] as number,
                    (e.target as HTMLInputElement).value as unknown as number,
                  ]);
                }
              }}
            ></input>
            {errors.searchPriceMax && (
              <span className="text-[10px] text-red-500">invalid input</span>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PriceRangeInput;
