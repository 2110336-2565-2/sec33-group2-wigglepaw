/* eslint-disable react/jsx-key */
import { faMessage, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
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
  const [tickArray, setTickarray] = useState([true, false, true]); //Array for state in pet box, size = number of pets
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
        <div className="mb-5 ">
          <div className="text-lg font-bold text-[#505050]">Pet Sitter:</div>
          <div className="testt rounded-lg p-0.5">
            <div className="  grid grid-cols-5 rounded-md border border-[#7b7b7b] bg-[#F3F3F3] py-2 ">
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
                <button className="center-thing drop-s rounded-md bg-[#357CC2] py-1 px-4 text-white  shadow-lg drop-shadow-lg">
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
        </div>
        <div className="">
          <div className="text-lg font-bold text-[#505050]">
            Pet (Number of pets):
          </div>
          <div>
            {/* color ready to change dinamically, wait for agreement on tag color */}
            {dummyPet.map((value, index) => (
              <div className="my-2">
                <div className="relative flex justify-between border-b border-[#9D9D9D] bg-[#F3F3F3] py-2 ">
                  <span className="center-thing pl-3" style={{ color: "blue" }}>
                    {value.name}
                  </span>
                  <span className=" pr-5 text-sm">
                    <div className="center-thing">
                      <span
                        className="rounded-full py-0.5 px-3 text-white shadow-sm"
                        style={{ backgroundColor: "blue" }}
                      >
                        {" "}
                        {value.type}
                      </span>
                      {tickArray[index] ? (
                        <button
                          onClick={() => {
                            const newTick = [...tickArray];
                            if (newTick[index]) {
                              newTick[index] = false;
                            } else {
                              newTick[index] = true;
                            }
                            setTickarray(newTick);
                          }}
                          className="ml-2 mb-0.5 text-xl"
                        >
                          +
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const newTick = [...tickArray];
                            if (newTick[index]) {
                              newTick[index] = false;
                            } else {
                              newTick[index] = true;
                            }
                            setTickarray(newTick);
                          }}
                          className="ml-2 mb-0.5 text-xl"
                        >
                          -
                        </button>
                      )}
                    </div>
                  </span>
                </div>
                {!tickArray[index] ? (
                  <div className="rounded-b-md border border-[#9D9D9D] bg-[#F3F3F3] py-2 px-3.5">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-[#7B7B7B]">
                        {" "}
                        Weight:
                      </span>
                      <span className="text-sm  text-[#7B7B7B]">
                        {" "}
                        {value.weight} kg
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-sm font-bold text-[#7B7B7B]">
                        {" "}
                        Breed:
                      </span>
                      <span className="text-sm  text-[#7B7B7B]">
                        {" "}
                        {value.breed}
                      </span>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-[#505050]">
              Notes to sitter:{" "}
            </span>
            <div className="center-thing mr-2 rounded-xl border border-[#7B7B7B] px-3 text-[#7B7B7B]  hover:bg-[#dfdede] ">
              Edit
              <FontAwesomeIcon className="ml-2" icon={faPencil} />
            </div>
          </div>
          <div className="mt-2 rounded-lg border border-[#7B7B7B] p-1">
            <textarea className="box-border h-full w-full rounded-lg px-1 text-[#7B7B7B]">
              GG
            </textarea>
          </div>
        </div>
        <div className="center-thing mb-5 mt-5 rounded-md  bg-[#FC3737] py-4 text-white">
          <button className="text-xl">Cancel</button>
        </div>
      </div>
    </div>
  );
};
export default SessionmediumCard;
