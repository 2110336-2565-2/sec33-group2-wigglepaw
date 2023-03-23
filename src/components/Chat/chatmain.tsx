import { faMessage, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import io from "socket.io-client";

import { api } from "../../utils/api";

let socket;

type ChatMainProps = {
  chatroomid: string;
  toid: string;
};

export const Chatmain = (props: ChatMainProps) => {
  const { data: session } = useSession();

  const [listmsg, setListmsg] = useState([]);
  const [sessionReady, setSessionReady] = useState(false);

  const sendchat = api.chat.createMessage.useMutation();

  const getAllmessage = api.chat.getAllChatMessage.useMutation();

  useEffect(() => {
    getAllmessage.mutateAsync(
      { chatroomid: props.chatroomid },
      {
        onSuccess: (data) => {
          setListmsg(data);
        },
      }
    );
  }, [props.chatroomid]);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    if (!socket) {
      await fetch("/api/socket");
      socket = io();
    }

    //console.log("started connection");

    socket.on("newIncomingMessage", (msg1) => {
      // console.log(msg1);
      console.log(socket.id);

      const obj127 = {
        data: msg1,
      };

      setListmsg((oldArray) => [...oldArray, obj127]);
    });
  };

  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    if (session) {
      setSessionReady(true);
    }
  }, [session]);

  useEffect(() => {
    if (sessionReady && socket) {
      const msg = {
        host: session?.user?.id.toString(),
        to: props.toid, //just for testing
      };
      socket.emit("startChat", msg);
    }
  }, [props.chatroomid]);

  const sendForm = async (e) => {
    e.preventDefault();

    const text = e.target.chat.value;

    const msg = {
      host: session?.user?.id.toString(),
      to: props.toid,
    };
    //socket.emit("startChat", msg);

    const packageja = {
      senderId: session?.user?.id.toString(),
      chatroomId: props.chatroomid,
      data: text,
    };

    await sendchat.mutateAsync(packageja);
    const obj127 = {
      data: text,
    };

    setListmsg((oldArray) => [...oldArray, obj127]);

    socket.emit("createdMessage", text);
    e.target.chat.value = "";
  };

  return (
    <>
      <div className="h-full w-full px-32">
        <div>Current Chatroom is:{props.chatroomid}</div>
        <div className=" h-[80%] ">
          {listmsg.map((data, index) => {
            return (
              <li key={index} className="bg-blue-100">
                {data.data}
              </li>
            );
          })}
        </div>
        <div className="flex items-end justify-center">
          <span className={props.chatroomid ? "visible" : "invisible"}>
            <form onSubmit={sendForm}>
              <input id="chat" className="border-2 border-black"></input>
              <button className="ml-4 border-2 border-blue-700 bg-blue-300 px-2">
                Send
              </button>
            </form>
          </span>
        </div>
      </div>
    </>
  );
};
