import * as React from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Range, getTrackBackground } from "react-range";
import { SearchValues } from "../common/interfaces";

const STEP = 0.1;
const MIN = 0;
const MAX = 1000;

interface RangeSliderProps {
  register: UseFormRegister<SearchValues>; // declare register props
  setValue: UseFormSetValue<SearchValues>;
}

const TwoThumbs: React.FC<{ rtl: boolean } & RangeSliderProps> = ({
  rtl = false,
  register,
  setValue,
}) => {
  const [values, setValues] = React.useState([250, 1000]);
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
              height: "42px",
              width: "42px",
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
      <output style={{ marginTop: "30px" }} id="output">
        {values[0]?.toFixed(1)} - {values[1]?.toFixed(1)}
      </output>
      <input
        {...register("searchPriceMin", { value: values[0] })}
        className="h-0 w-0"
        hidden
      ></input>
      <input
        {...register("searchPriceMax", { value: values[1] })}
        className="h-0 w-0"
        hidden
      ></input>
    </div>
  );
};

export default TwoThumbs;
