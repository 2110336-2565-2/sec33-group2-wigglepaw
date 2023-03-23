import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { z } from "zod";
import { Chatmain } from "../components/Chat/chatmain";

let socket;

type DataAllchat = {
  username: string;
  chatroomId: string;
  data: string;
  petSitterId: string;
  petOwnerId: string;
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

      <div className=" flex h-[90vh]   ">
        <div className="h-full w-[20%] bg-blue-200">
          <div>
            {allchatroom?.map((data: DataAllchat) => {
              return (
                <li
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
                  }}
                  className="bg-green-300 px-2 py-2"
                  key={data.chatroomId}
                >
                  {data.username}
                </li>
              );
            })}
          </div>
        </div>

        <Chatmain chatroomid={currentChatroomid} toid={toid} />
        {/* <div className="flex items-end justify-center">
            <span
              className={currentChatroomid === "" ? "invisible" : "visible"}
            >
              <form onSubmit={sendForm}>
                <input id="chat" className="border-2 border-black"></input>
                <button className="ml-4 border-2 border-blue-700 bg-blue-300 px-2">
                  Send
                </button>
              </form>
            </span>
          </div> */}
      </div>
    </>
  );
};

export default ChatRoomPage;
