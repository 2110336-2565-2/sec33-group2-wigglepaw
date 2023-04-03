import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeMute, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../utils/api";

type MuteButtonProps = {
  otherUserId: string;
  isMute: boolean;
};

export default function MuteButton(props: MuteButtonProps) {
  const muteUser = api.mute.mute.useMutation();
  const unmuteUser = api.mute.unmute.useMutation();
  const [mute, setMute] = React.useState(props.isMute);
  useEffect(() => {
    setMute(props.isMute);
  }, [props.isMute]);
  return (
    <div>
      {/*Mute Button*/}
      {mute && (
        <button
          className={`flex items-center justify-center`}
          onClick={async () => {
            await unmuteUser.mutateAsync({ userId: props.otherUserId });
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
          onClick={async () => {
            await muteUser.mutateAsync({ userId: props.otherUserId });
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
