import * as React from "react";
import {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Range, getTrackBackground } from "react-range";
import { SearchValues } from "../common/interfaces";

const STEP = 100;
const MIN = 0;
const MAX = 10000;
export const BEGIN_MIN = 1000;
export const BEGIN_MAX = 4000;

interface RangeSliderProps {
  register: UseFormRegister<SearchValues>; // declare register props
  setValue: UseFormSetValue<SearchValues>;
  getValues: UseFormGetValues<SearchValues>;
}

const TwoThumbs: React.FC<{ rtl: boolean } & RangeSliderProps> = ({
  rtl = false,
  register,
  setValue,
  getValues,
}) => {
  const [values, setValues] = React.useState([BEGIN_MIN, BEGIN_MAX]);

  const {
    onBlur: onBlurMin,
    name: nameMin,
    ref: refMin,
  } = register("searchPriceMin", {
    value: values[0],
    valueAsNumber: true,
  });

  const {
    onBlur: onBlurMax,
    name: nameMax,
    ref: refMax,
  } = register("searchPriceMax", {
    value: values[1],
    valueAsNumber: true,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={rtl}
        onChange={(values) => {
          if (values[0] && values[1]) {
            setValue("searchPriceMin", values[0]);
            setValue("searchPriceMax", values[1]);
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
          >
            <div
              ref={props.ref}
              style={{
                height: "5px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values,
                  colors: ["#ccc", "#548BF4", "#ccc"],
                  min: MIN,
                  max: MAX,
                  rtl,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "10px",
              width: "10px",
              borderRadius: "4px",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0px 2px 6px #AAA",
            }}
          >
            <div
              style={{
                height: "16px",
                width: "5px",
                backgroundColor: isDragged ? "#548BF4" : "#CCC",
              }}
            />
          </div>
        )}
      />
      {/* <output style={{ marginTop: "30px" }} id="output">
        {values[0]?.toFixed(1)} - {values[1]?.toFixed(1)}
      </output> */}
      <label>Min</label>
      <input
        className="mx-2 w-10"
        onBlur={onBlurMin}
        name={nameMin}
        ref={refMin}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (
            e.key === "Enter" &&
            ((e.target as HTMLInputElement).value as unknown as number) > 0 &&
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

      <label>Max</label>
      <input
        className="mx-2 w-10"
        onBlur={onBlurMax}
        name={nameMax}
        ref={refMax}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (
            e.key === "Enter" &&
            ((e.target as HTMLInputElement).value as unknown as number) < MAX &&
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
  );
};

export default TwoThumbs;
