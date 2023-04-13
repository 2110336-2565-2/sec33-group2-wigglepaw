import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import Image from "next/image";

import { createContext } from "react";

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
  unread: number;
};

//THis is for PetHotel  (like all chat)
export const ModeContext = createContext<MatchingFormContextT>(
  {} as MatchingFormContextT
);

interface MatchingFormContextT {
  mode: boolean;
  togglemode: void;
}

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
  const [mode, setMode] = useState(false);
  const [rdyforchat, setRdyforchat] = useState(false);
  const [toid, setToid] = useState<string>("");

  useEffect(() => {
    if (session?.user?.userId) {
      //console.log(session.user.userId);
      setRdy(true);
    }
  }, [session]);

  useEffect(() => {
    if (rdy && rdyforchat) {
      void getAllChatroom.mutateAsync(
        { finderid: session?.user?.userId },
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
        //if it is admin?
        void alreadyChatroom.mutateAsync(
          {
            petOwnerid: session?.user?.userId,
            petSitterid: username,
          },
          {
            onSuccess: (data) => {
              //setCurrentChatroomid(data);
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

  const togglemode = () => {
    setMode((mode) => !mode);
  };

  return (
    <>
      <Header></Header>

      <div className=" flex h-[89vh]   ">
        <div
          className={
            !mode
              ? "relative h-full w-full border-r-2 border-[#F0A21F] md:w-[25%]"
              : "relative h-full w-0 border-r-2 border-[#F0A21F] md:w-[25%]"
          }
        >
          <div>
            {allchatroom?.map((data: DataAllchat, index) => {
              //console.log(allchatroom);
              const date1 = new Date();

              let formattedDate = "";
              let formattedData = "";

              //console.log(data.firstmsg, index);

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
                    day: "numeric",
                    year: "numeric",
                    month: "numeric",
                  });
                }
              }

              return (
                <>
                  <div
                    onClick={() => {
                      togglemode();
                      setCurrentChatroomid(data.chatroomId);
                      if (session?.user?.userId === data.petOwnerId) {
                        setToid(data.petSitterId);
                      } else {
                        setToid(data.petOwnerId);
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
                    <div className="ml-2 flex-1 overflow-x-hidden ">
                      <div className="flex justify-between">
                        <span className="">{data.username}</span>
                        <span className="text-right text-[0.6rem] text-[#A5A5A5]">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="flex justify-between ">
                        <div className="max-w-[75%] overflow-hidden pr-5 text-[0.6rem] text-[#A5A5A5]">
                          {formattedData}
                        </div>
                        {data.unread > 0 ? (
                          <div className="center-thing h-5 w-5 rounded-full bg-red-500 text-right text-xs text-white">
                            {data.unread}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr className="h-[0.01rem] w-full bg-[#F5F5F5]" />
                </>
              );
            })}
          </div>
          <div
            className={
              mode
                ? "invisible absolute bottom-0  left-[90%] z-10 h-[156px] w-[64px] bg-white md:visible"
                : "absolute  bottom-0 left-[90%] z-10 h-[156px] w-[64px] bg-white md:visible"
            }
          >
            <Image
              src={"/cuteto.png"}
              alt={"Icon"}
              width="64"
              height="116"
              className=" absolute bottom-0 object-cover"
            ></Image>
          </div>
        </div>
        <ModeContext.Provider value={{ mode, togglemode }}>
          <Chatmain
            chatroomid={currentChatroomid}
            username={sendusername}
            toid={toid}
          />
        </ModeContext.Provider>
      </div>
    </>
  );
};

export default ChatRoomPage;
