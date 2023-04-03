import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../utils/api";

type BlockButtonProps = {
  otherUserId: string;
  isBlock: boolean;
};

export default function BlockButton(props: BlockButtonProps) {
  const blockUser = api.block.block.useMutation();
  const unblockUser = api.block.unblock.useMutation();
  const [block, setBlock] = React.useState(props.isBlock);
  useEffect(() => {
    setBlock(props.isBlock);
  }, [props.isBlock]);
  return (
    <div>
      {/*Block Button*/}
      {block && (
        <button
          className={`flex items-center justify-center`}
          onClick={async () => {
            await unblockUser.mutateAsync({ userId: props.otherUserId });
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
          onClick={async () => {
            await blockUser.mutateAsync({ userId: props.otherUserId });
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
