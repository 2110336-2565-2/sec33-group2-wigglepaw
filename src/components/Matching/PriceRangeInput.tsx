import Image from "next/image";
import { Fragment, useState } from "react";
import { Range, getTrackBackground } from "react-range";

const STEP = 100;
const MIN = 0;
const MAX = 10000;
export const BEGIN_MIN = 1000;
export const BEGIN_MAX = 4000;

const PriceRangeInput = () => {
  const [values, setValues] = useState([BEGIN_MIN, BEGIN_MAX]);

  return (
    <Fragment>
      {/* two thumbs starts here */}
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
              //   setValue("searchPriceMin", values[0]);
              //   setValue("searchPriceMax", values[1]);
              setValues(values);
            }
          }}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: "36px",
                display: "flex",
                width: "100%",
              }}
              className="flex-row justify-center"
            >
              <div
                ref={props.ref}
                style={{
                  height: "10px",
                  width: "100%",
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
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props /*isDragged*/ }) => (
            <div
              className="focus:outline-none"
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
          <div id="" className="flex flex-col">
            <label>
              <p className="text-[15px] font-medium text-[#8a5534]">Min</p>
            </label>
            <input
              className="w-[90px] rounded-md border border-[#8a5534] px-2 py-1 text-center text-[#b77b59] focus:border-[#E99548] focus:outline-none focus:ring-2 focus:ring-[#eea663]"
              //   onBlur={onBlurMin}
              //   name={nameMin}
              //   ref={refMin}
              value={`${values[0] as number}฿`}
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
            />
          </div>
          <div id="separator-container" className="flex flex-col pt-[38px]">
            <div
              id="separator-icon"
              className="h-1 w-12 rounded-[50%] bg-[#c89d48]"
            ></div>
          </div>
          <div id="" className="flex flex-col">
            <label>
              <p className="text-[15px] font-medium text-[#8a5534]">Max</p>
            </label>
            <input
              className="w-[90px] rounded-md border border-[#8a5534] px-2 py-1 text-center text-[#b77b59] focus:border-[#E99548] focus:outline-none focus:ring-2 focus:ring-[#eea663]"
              //   onBlur={onBlurMax}
              //   name={nameMax}
              //   ref={refMax}
              value={`${values[1] as number}฿`}
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
            ></input>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PriceRangeInput;
