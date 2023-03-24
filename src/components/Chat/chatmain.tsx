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
type ChatMessage = {
  data: string;
  sender: object;
  createdAt: Date;
};

type ChatMainProps = {
  chatroomid: string;
  toid: string;
  username: string;
};

export const Chatmain = (props: ChatMainProps) => {
  const { data: session } = useSession();

  const [listmsg, setListmsg] = useState([]);
  const [sessionReady, setSessionReady] = useState(false);

  const sendchat = api.chat.createMessage.useMutation();

  const getAllmessage = api.chat.getAllChatMessage.useMutation();

  useEffect(() => {
    if (props.chatroomid === "") {
    } else {
      void getAllmessage.mutateAsync(
        { chatroomid: props.chatroomid },
        {
          onSuccess: (data) => {
            setListmsg(data);
          },
        }
      );
    }
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
      sender: { username: session?.user?.username },
      createdAt: new Date(),
    };

    setListmsg((oldArray) => [...oldArray, obj127]);

    socket.emit("createdMessage", text);
    e.target.chat.value = "";
  };

  return (
    <div className="relative h-full w-full overflow-y-hidden">
      <div className=" flex w-full items-center border-b-2 border-[#F0A21F] py-1">
        <span className=" px-4 py-2">Current Username is:{props.username}</span>
      </div>

      <div className=" w-full px-10">
        <div className=" w-full">
          {listmsg.map((data: ChatMessage, index) => {
            let who = false;
            if (data.sender.username === props.username) {
              who = true;
            }
            return (
              <div key={index} className="grid grid-cols-3">
                <div
                  className={
                    who
                      ? "col-span-2 "
                      : "col-span-2 col-start-2  place-self-end"
                  }
                >
                  <div
                    className={
                      who
                        ? "my-1 inline-block  bg-[#E9E9E9] px-3"
                        : "my-1 inline-block  bg-[#F0A21F] px-3"
                    }
                  >
                    <span className={who ? "text-[#909090]" : "text-white"}>
                      {data.createdAt.toString()}
                    </span>
                    <br />
                    <span
                      className={
                        who ? "  text-black" : " break-all  text-white"
                      }
                    >
                      {data.data}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
          <div
            className={
              props.chatroomid
                ? "visible relative w-full"
                : "invisible relative w-full"
            }
          >
            <div className="mb-2 flex   ">
              <span className="relative ml-10 h-[40px] w-[40px]">
                <Image
                  src={"/icon-pic.png"}
                  alt={"Icon"}
                  fill
                  className="mt-0.5"
                ></Image>
              </span>
              <span className="relative mx-2 h-[40px] w-[40px]">
                {" "}
                <Image
                  src={"/icon-paperclip.png"}
                  alt={"Icon"}
                  fill
                  className=" p-0.5"
                ></Image>
              </span>

              <form className="center-thing w-full" onSubmit={sendForm}>
                <input
                  placeholder="What do you want to say?"
                  id="chat"
                  className="text- my-1 mr-5 w-[90%] rounded-xl border  border-[#CCCCCC] bg-[#F8F8F8] px-2 py-1"
                ></input>

                <button className="relative h-[40px] w-[40px]">
                  <Image
                    src={"/icon-send.png"}
                    alt={"Icon"}
                    fill
                    className=" p-0.5"
                  ></Image>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
