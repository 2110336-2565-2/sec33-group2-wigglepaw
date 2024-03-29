/* eslint-disable react/jsx-key */
import { faMessage, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { api } from "../../utils/api";
import { useRouter } from "next/router";
export const SessionMediumCard = ({ data }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const sitter =
    session?.user?.userType === "PetHotel" ||
    session?.user?.userType === "FreelancePetSitter"
      ? true
      : false;
  //for testing, use to set the value of usertype

  const imageUri = api.user.getImagebyId.useQuery(
    { userId: data.petSitterId },
    {}
  );
  const imageUri2 = api.user.getImagebyId.useQuery(
    { userId: data.petOwner.userId },
    {}
  );
  const colorbg = () => {
    if (data.status === "requested") {
      return "#fdba74";
    } else if (data.status === "accepted") {
      return "#a5f3fc";
    } else if (data.status === "canceled") {
      return "#bef264";
    } else {
      return "#cbd5e1";
    }
  };
  const mutate = api.booking.accept.useMutation();
  const mutatecan = api.booking.reject.useMutation();
  const payMutation = api.booking.pay.useMutation();

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

  //use to define each mode from backend, can add onClick event into these element
  const Lastbox = () => {
    switch (data.status) {
      case "requested":
        if (sitter) {
          return (
            <div className="mt-5 grid grid-cols-2">
              <div
                onClick={() => {
                  const gg = {
                    bookingId: data.bookingId,
                  };
                  const res = mutatecan.mutate(gg);
                  setTimeout(function () {
                    window.location.reload();
                  }, 500);
                }}
                className="center-thing mb-5 mr-3  rounded-md  bg-[#FC3737] py-4 text-white"
              >
                <button className="text-xl">Decline</button>
              </div>
              <div className="center-thing mb-5 ml-3  rounded-md  bg-[#54A900] py-4 text-white">
                <button
                  onClick={async () => {
                    const gg = {
                      bookingId: data.bookingId,
                    };
                    const res = mutate.mutate(gg);
                    setTimeout(function () {
                      window.location.reload();
                    }, 500);
                  }}
                  className="text-xl"
                >
                  Accept
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div className=" center-thing mb-5 mt-5 rounded-md  bg-[#FC3737] py-4 text-white">
              <button className="text-xl">Cancel</button>
            </div>
          );
        }
      case "accepted":
        if (sitter) {
        } else {
          // under maintance
          // return (
          //   <div className=" center-thing mb-5 mt-5 rounded-md  bg-[#FC3737] py-4 text-white">
          //     <button
          //       className="text-xl"
          //       onClick={() => {
          //         const gg = {
          //           bookingId: data.bookingId,
          //         };
          //         const res = mutatecan.mutate(gg);
          //         setTimeout(function () {
          //           window.location.reload();
          //         }, 500);
          //       }}
          //     >
          //       Cancel
          //     </button>
          //   </div>
          // );
        }
      case "3":
        if (sitter) {
        } else {
          return (
            <div className=" center-thing mb-5 mt-5 rounded-md  bg-[#2A4764] py-4 text-white disabled:opacity-50">
              <button
                disabled={payMutation.isLoading}
                className="text-xl"
                onClick={async () => {
                  if (!confirm(`Are you sure you want to pay?`)) {
                    return;
                  }

                  try {
                    await payMutation.mutateAsync({
                      bookingId: data.bookingId,
                    });
                  } catch (error) {
                    alert(JSON.stringify(error?.message));
                    return;
                  }

                  alert("Payment successful!");

                  await router.push(`/transaction`);
                }}
              >
                Confirm and Pay
              </button>
            </div>
          );
        }
      case "4":
        if (sitter) {
        } else {
          return (
            <div className="mt-5 grid grid-cols-2">
              <div className="center-thing mb-5 mr-3  rounded-md  bg-[#DB438C] py-4 text-white">
                <button className="text-xl">Write A Review</button>
              </div>
              <div className="center-thing mb-5 ml-3  rounded-md  bg-[#54A900] py-4 text-white">
                <button className="text-xl">Rebook</button>
              </div>
            </div>
          );
        }
      default:
      //under maintainance
      // if (sitter) {
      // } else {
      //   return (
      //     <div className=" center-thing mb-5 mt-5 rounded-md  bg-[#54A900] py-4 text-white">
      //       <button className="text-xl">Rebook</button>
      //     </div>
      //   );
      // }
    }
  };

  const [tickArray, setTickarray] = useState([true, false, true]); //Array for state in pet box, size = number of pets
  return (
    <div>
      <div
        style={{ backgroundColor: colorbg() }}
        className="center-thing border-l-5 absolute right-[-0.5rem] top-0 h-7 skew-x-[30deg] bg-black  px-5 text-black shadow-xl"
      >
        <div className="-skew-x-[30deg] text-xs">{data.status}</div>
        {/* change to status instead, 'Pending' forn example */}
      </div>
      <div className="px-5">
        <div className="">
          <div className="text-lg font-bold text-[#505050]">Session Id:</div>
          <div className=" text-[#7b7b7b]">&nbsp;{data.bookingId} </div>
        </div>
        <div className=" grid grid-cols-2 py-5 pb-5">
          <div>
            <div className="text-lg font-bold text-[#505050]">Start Time:</div>
            <div className=" text-[#7b7b7b]">
              &nbsp;{data.startDate.toString()}{" "}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#505050]">End Time:</div>
            <div className=" text-[#7b7b7b]">
              &nbsp;{data.endDate.toString()}{" "}
            </div>
          </div>
        </div>
        <div className="mb-5 ">
          {sitter ? (
            <div className="text-lg font-bold text-[#505050]">Pet Owner:</div>
          ) : (
            <div className="text-lg font-bold text-[#505050]">Pet Sitter:</div>
          )}
          <div className="testt rounded-lg p-0.5">
            <div className="  grid grid-cols-5 rounded-md border border-[#7b7b7b] bg-[#F3F3F3] py-2 ">
              <div className="relative mx-2 h-[60px] w-[60px]">
                <Image
                  src={sitter ? imageUri2.data : imageUri.data} //change photo
                  alt="dummy"
                  fill
                  className="relative rounded-xl"
                />
              </div>
              <div className="center-thing col-span-2  text-[#7b7b7b]">
                {sitter
                  ? data.petOwner.firstName
                  : data.petSitter.petHotel.hotelName}
              </div>
              <div className="center-thing col-span-2">
                <button
                  onClick={() => {
                    router.push("/chat");
                  }}
                  className="center-thing drop-s rounded-md bg-[#357CC2] px-4 py-1 text-white  shadow-lg drop-shadow-lg"
                >
                  Chat
                  <FontAwesomeIcon
                    className="ml-3 scale-x-110 scale-y-75"
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
                        className="rounded-full px-3 py-0.5 text-white shadow-sm"
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
                          className="mb-0.5 ml-2 text-xl"
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
                          className="mb-0.5 ml-2 text-xl"
                        >
                          -
                        </button>
                      )}
                    </div>
                  </span>
                </div>
                {!tickArray[index] ? (
                  <div className="animate-showing rounded-b-md border border-[#9D9D9D] bg-[#F3F3F3] px-3.5 py-2 opacity-0 ">
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
            {sitter ? (
              <div></div>
            ) : (
              <div className="center-thing mr-2 rounded-xl border border-[#7B7B7B] px-3 text-[#7B7B7B]  hover:bg-[#dfdede] ">
                Edit
                <FontAwesomeIcon className="ml-2" icon={faPencil} />
              </div>
            )}
          </div>
          <div className="mt-2 rounded-lg border border-[#7B7B7B] p-1">
            <textarea className="box-border h-full w-full rounded-lg px-1 text-[#7B7B7B]">
              {data.note}
            </textarea>
          </div>
        </div>
        <Lastbox />
      </div>
    </div>
  );
};
export default SessionMediumCard;
