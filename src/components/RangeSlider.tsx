import { faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Range } from "react-range";

const RangeSlider = () => {
  const [value, setValue] = React.useState([50]);
  return (
    <div className="py-4">
      <Range
        step={0.1}
        min={0}
        max={100}
        values={value}
        onChange={(values) => setValue(values)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              width: "100%",
              backgroundColor: "#ccc",
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div {...props}>
            <div
              className={
                "absolute -top-5 -left-7 rounded-md border-none px-4 " +
                (isDragged
                  ? "-left-7 border-none bg-indigo-400 text-indigo-800 focus:border-none"
                  : "bg-indigo-300 text-indigo-600")
              }
            >{`${value[0]?.toFixed(1)}฿`}</div>
            <FontAwesomeIcon icon={faPaw} className="my-0" />
          </div>
        )}
      />
    </div>
  );
};

export default RangeSlider;
