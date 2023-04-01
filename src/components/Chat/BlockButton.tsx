import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserSlash } from "@fortawesome/free-solid-svg-icons";

type BlockButtonProps = {
  isBlock?: Boolean;
};

export default function BlockButton(props: BlockButtonProps) {
  const [block, setBlock] = React.useState(false);
  return (
    <div>
      {/*Block Button*/}
      {block && (
        <button
          className={`flex items-center justify-center`}
          onClick={() => {
            setBlock((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faUserSlash}
            className={`rounded-full border ${block} bg-gray-300 p-1`}
          />
        </button>
      )}
      {!block && (
        <button
          className={`flex items-center justify-center`}
          onClick={() => {
            setBlock((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`rounded-full border ${block} bg-gray-300 p-1`}
          />
        </button>
      )}
    </div>
  );
}
