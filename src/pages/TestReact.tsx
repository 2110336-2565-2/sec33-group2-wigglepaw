import { useState } from "react";
import { api } from "../utils/api";

export default function Test() {
  const [A, setA] = useState(0);

  return (
    <div>
      I'm in Spain without S.
      <br></br>
      <button onClick={() => setA(A + 1)}>PAIN</button>
      {A}
    </div>
  );
}
