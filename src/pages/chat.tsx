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

  const [sessionReady, setSessionReady] = useState(false);

  //const alreadyChatroom = api.chat.checkChatroomid.useMutation();  No need to use anymore, since all chatroom in
  //here will be initialed no matter how

  const getAllChatroom = api.chat.getAllChatroom.useQuery(
    session?.user?.userType === "PetHotel" ||
      session?.user?.userType === "FreelancePetSitter"
      ? { petSitterid: session.user.userId }
      : { petOwnerid: session?.user?.userId }
  ); //beware some case that session is not yet finishing initialed, and this won't query anything

  const [currentChatroomid, setCurrentChatroomid] = useState<string>("");
  const [toid, setToid] = useState<string>("");

  // We just call it because we don't need anything else out of it

  return (
    <>
      <Header></Header>

      <div className=" flex h-[90vh]   ">
        <div className="h-full w-[20%] bg-blue-200">
          <div>
            {getAllChatroom.data?.map((data: DataAllchat) => {
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
