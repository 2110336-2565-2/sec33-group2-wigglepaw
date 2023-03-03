/* eslint-disable react/jsx-key */
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
export const SessionmediumCard = ({ data }) => {
  const dummyPet = [
    {
      name: "Eren",
      type: "Dog",
      weight: "30",
      breed: "Attack Titan",
    },
    {
      name: "Emperor Yoshiro",
      type: "Cat",
      weight: "25",
      breed: "Emperor of Stupid",
    },
    {
      name: "Ohirou",
      type: "Hamster",
      weight: "905",
      breed: "Pegasus",
    },
  ]; //for testing only
  return (
    <div>
      <div
        style={{ backgroundColor: data.color.toString() }}
        className="center-thing border-l-5 absolute top-0 right-[-0.5rem] h-7 skew-x-[30deg] bg-black  px-5 text-black shadow-xl"
      >
        <div className="-skew-x-[30deg] text-xs">{data.title}</div>
      </div>
      <div className="px-5">
        <div className="">
          <div className="text-lg font-bold text-[#505050]">Session Id:</div>
          <div className=" text-[#7b7b7b]">&nbsp;CsxS32JS&sasSdwWW02C </div>
        </div>
        <div className=" grid grid-cols-2 py-5 pb-5">
          <div>
            <div className="text-lg font-bold text-[#505050]">Start Time:</div>
            <div className=" text-[#7b7b7b]">&nbsp;{data.start} </div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#505050]">End Time:</div>
            <div className=" text-[#7b7b7b]">&nbsp;{data.end} </div>
          </div>
        </div>
        <div className="mb-5">
          <div className="text-lg font-bold text-[#505050]">Pet Sitter:</div>
          <div className="grid grid-cols-5 rounded-md border border-[#7b7b7b] py-2 ">
            <div className="relative mx-2 h-[60px] w-[60px]">
              <Image
                src="/umadeofstupid.webp"
                alt="dummy"
                fill
                className="relative rounded-xl"
              />
            </div>
            <div className="center-thing col-span-2  text-[#7b7b7b]">
              PetSitterName
            </div>
            <div className="center-thing col-span-2">
              <button className="center-thing rounded-md bg-[#357CC2] py-1 px-4 text-white">
                Chat
                <FontAwesomeIcon
                  className="ml-3 scale-y-75 scale-x-110"
                  size="xl"
                  icon={faMessage}
                />
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <div className="text-lg font-bold text-[#505050]">
            Pet (Number of pets):
          </div>
          <div>
            {dummyPet.map((value) => (
              <div className="relative border-b border-gray-400 bg-[#F3F3F3] py-2">
                <span className="pl-3">{value.name}</span>
                <span className=" absolute right-0 pr-5 text-sm">
                  <div className="rounded-full bg-yellow-200 py-0.5 px-3 shadow-sm">
                    {value.type}
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SessionmediumCard;
