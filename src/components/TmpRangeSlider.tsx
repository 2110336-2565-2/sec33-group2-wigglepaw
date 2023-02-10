import React, { useState } from "react";
import { useForm } from "react-hook-form";

function TmpRangeSlider() {
  const { register, handleSubmit, setValue } = useForm();
  const [value, setSliderValue] = useState(50);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => {
          setSliderValue(e.target.value);
          setValue("range", e.target.value);
        }}
        ref={register({ required: true })}
        name="range"
      />
      <input type="submit" />
    </form>
  );
}

export default TmpRangeSlider;
