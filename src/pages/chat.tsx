import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { messageFields } from "../schema/schema";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { z } from "zod";

let socket;

//THis is for PetHotel  (like all chat)

const ChatRoomPage: NextPage = () => {
  const router = useRouter();

  const { username } = router.query;
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  //const alreadyChatroom = api.chat.checkChatroomid.useMutation();  No need to use anymore, since all chatroom in
  //here will be initialed no matter how
  const sendchat = api.chat.createMessage.useMutation();
  const getAllmessage = api.chat.getAllChatMessage.useMutation();
  const getAllChatroom = api.chat.getAllChatroom.useQuery(
    session?.user?.userType === "PetHotel" ||
      session?.user?.userType === "FreelancePetSitter"
      ? { petSitterid: session.user.userId }
      : { petOwnerid: session?.user?.userId }
  ); //beware some case that session is not yet finishing initialed, and this won't query anything

  const [currentChatroomid, setCurrentChatroomid] = useState<string>("");
  const [currentMessage, setCurrentMessage] = useState([]);

  // We just call it because we don't need anything else out of it
  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    if (session) {
      setSessionReady(true);
    }
  }, [session]);

  useEffect(() => {
    if (sessionReady && socket && !started) {
      setStarted(true);
      const msg = {
        host: session?.user?.id.toString(),
        to: "clf5hrxrq002bpassbxledq37", //just for testing
      };
      socket.emit("startChat", msg);
    }
  }, [sessionReady, socket]);

  const [msg, setMSG] = useState<string>();
  const [listmsg, Setlistmsg] = useState(["fuck me", "no"]);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    if (!socket) {
      await fetch("/api/socket");
      socket = io();
    }

    //console.log("started connection");

    socket.on("newIncomingMessage", (msg1) => {
      // console.log(msg1);
      // console.log(socket.id);
      setMSG(msg1);
      Setlistmsg((prev) => [...prev, msg1]);
    });
  };

  const sendForm = async (e) => {
    e.preventDefault();

    if (!started) {
      setStarted(true);
      const msg = {
        host: session?.user?.id.toString(),
        to: petSitterData?.userId.toString(),
      };
      socket.emit("startChat", msg);
    }

    const packageja = {
      senderId: session?.user?.id.toString(),
      chatroomId: currentChatroomid,
      data: e.target.chat.value,
    };

    await sendchat.mutateAsync(packageja, {
      onSuccess: (data) => {
        console.log(data);
      },
    });

    const msg = e.target.chat.value;

    Setlistmsg((prev) => [...prev, msg]);
    socket.emit("createdMessage", msg);
    e.target.chat.value = "";
  };

  return (
    <>
      <Header></Header>
      {msg}
      {username}

      <div className=" flex h-[90vh]   ">
        <div className="h-full w-[20%] bg-blue-200">
          <div>
            {getAllChatroom.data?.map((data) => {
              return (
                <li
                  onClick={async () => {
                    setCurrentChatroomid(data.chatroomId);

                    const niceone = {
                      chatroomid: data.chatroomId,
                    };

                    await getAllmessage.mutateAsync(niceone, {
                      onSuccess: (data) => {
                        setCurrentMessage(data);
                      },
                    });
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
        <div className="h-full w-full px-32">
          <div>Current Chatroom is:{currentChatroomid}</div>
          <div className=" h-[80%] ">
            {currentMessage.map((data, index) => {
              return (
                <li key={index} className="bg-blue-100">
                  {data.data}
                </li>
              );
            })}
          </div>
          <div className="flex items-end justify-center">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoomPage;
