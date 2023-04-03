import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

type MuteButtonProps = {
  isMuted?: Boolean;
};

export default function MuteButton(props: MuteButtonProps) {
  const [mute, setMute] = React.useState(false);
  return (
    <div>
      {/*Mute Button*/}
      {mute && (
        <button
          className={`flex items-center justify-center`}
          onClick={() => {
            setMute((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faVolumeMute}
            className={`rounded-full border ${mute} bg-gray-300 p-1`}
          />
        </button>
      )}
      {!mute && (
        <button
          className={`flex items-center justify-center`}
          onClick={() => {
            setMute((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faVolumeHigh}
            className={`rounded-full border ${mute} bg-gray-300 p-1`}
          />
        </button>
      )}
    </div>
  );
}
