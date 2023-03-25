import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import Image from "next/image";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Chatmain } from "../components/Chat/chatmain";

let socket;

type DataAllchat = {
  username: string;
  chatroomId: string;
  data: string;
  firstmsg: { data: string; createdAt: Date };
  petSitterId: string;
  petOwnerId: string;
  imageuri: string;
};

//THis is for PetHotel  (like all chat)

const ChatRoomPage: NextPage = () => {
  const router = useRouter();

  const { username } = router.query;
  const { data: session } = useSession();

  const alreadyChatroom = api.chat.checkChatroomid.useMutation();
  //here will be initialed no matter how

  const getAllChatroom = api.chat.getAllChatroom.useMutation(); //beware some case that session is not yet finishing initialed, and this won't query anything
  const [allchatroom, setAllchatroom] = useState();
  const [currentChatroomid, setCurrentChatroomid] = useState<string>("");
  const [sendusername, setSendusername] = useState<string>("");
  const [check, setCheck] = useState(false);
  const [rdy, setRdy] = useState(false);
  const [rdyforchat, setRdyforchat] = useState(false);
  const [toid, setToid] = useState<string>("");

  useEffect(() => {
    if (session?.user?.userId) {
      console.log(session.user.userId);
      setRdy(true);
    }
  }, [session]);

  useEffect(() => {
    if (rdy && rdyforchat) {
      void getAllChatroom.mutateAsync(
        session?.user?.userType === "PetHotel" ||
          session?.user?.userType === "FreelancePetSitter"
          ? { petSitterid: session.user.userId }
          : { petOwnerid: session?.user?.userId },
        {
          onSuccess(data) {
            setAllchatroom(data);
          },
        }
      ),
        {};
    }
  }, [rdy, rdyforchat]);

  useEffect(() => {
    setCheck(true);
  }, [username]);

  useEffect(() => {
    if (check) {
      if (username) {
        void alreadyChatroom.mutateAsync(
          {
            petOwnerid: session?.user?.userId,
            petSitterid: username,
          },
          {
            onSuccess: (data) => {
              setCurrentChatroomid(data);
              setRdyforchat(true);
            },
          }
        );
      } else {
        setRdyforchat(true);
      }
    }
  }, [check]);

  // We just call it because we don't need anything else out of it

  return (
    <>
      <Header></Header>

      <div className=" flex h-[89vh]   ">
        <div className="relative h-full w-[25%] border-r-2 border-[#F0A21F]">
          <div>
            {allchatroom?.map((data: DataAllchat, index) => {
              const date1 = new Date();

              let formattedDate = "";
              let formattedData = "";

              console.log(data.firstmsg, index);

              if (data.firstmsg) {
                const date2 = data.firstmsg.createdAt;
                formattedData = data.firstmsg.data;
                if (
                  date1.getFullYear() === date2.getFullYear() &&
                  date1.getMonth() === date2.getMonth() &&
                  date1.getDate() === date2.getDate()
                ) {
                  formattedDate = date2.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                } else {
                  formattedDate = date2.toLocaleString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }
              }

              return (
                <>
                  <div
                    onClick={() => {
                      setCurrentChatroomid(data.chatroomId);
                      if (
                        session?.user?.userType === "PetHotel" ||
                        session?.user?.userType === "FreelancePetSitter"
                      ) {
                        setToid(data.petOwnerId);
                      } else {
                        setToid(data.petSitterId);
                      }
                      setSendusername(data.username);
                    }}
                    className=" flex items-center px-4 py-2"
                    key={data.chatroomId}
                  >
                    <div className="relative h-[50px] w-[50px]">
                      <Image
                        src={data.imageuri}
                        alt={"Icon"}
                        fill
                        className="rounded-full object-cover"
                      ></Image>
                    </div>
                    <div className="ml-2 w-full">
                      <span className="">{data.username}</span>
                      <div className="flex justify-between text-[0.6rem] text-[#A5A5A5]">
                        <div>{formattedData}</div>
                        <div className="">{formattedDate}</div>
                      </div>
                    </div>
                  </div>
                  <hr className="h-[0.01rem] w-full bg-[#F5F5F5]" />
                </>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-[90%] z-10 h-[156px] w-[64px] bg-white">
            <Image
              src={"/cuteto.png"}
              alt={"Icon"}
              width="64"
              height="116"
              className=" absolute bottom-0 object-cover"
            ></Image>
          </div>
        </div>

        <Chatmain
          chatroomid={currentChatroomid}
          username={sendusername}
          toid={toid}
        />
      </div>
    </>
  );
};

export default ChatRoomPage;
