import {
  faAngleLeft,
  faMessage,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useContext } from "react";
import io from "socket.io-client";

import { api } from "../../utils/api";
import { list } from "postcss";
import { ModeContext } from "../../pages/chat";

let socket;
type ChatMessage = {
  data: string;
  sender: object;
  createdAt: Date;
  read: boolean;
};

type ChatMainProps = {
  chatroomid: string;
  toid: string;
  username: string;
};

export const Chatmain = (props: ChatMainProps) => {
  const { data: session } = useSession();

  const { mode, togglemode } = useContext(ModeContext);

  const [listmsg, setListmsg] = useState([]);

  const [sessionReady, setSessionReady] = useState(false);

  const [lastmsgSender, setLastmsgSender] = useState(false);

  const messageEndRef = useRef(null);

  const sendchat = api.chat.createMessage.useMutation();
  const getAllmessage = api.chat.getAllChatMessage.useMutation();

  useEffect(() => {
    if (props.chatroomid === "") {
    } else {
      void getAllmessage.mutateAsync(
        { chatroomid: props.chatroomid, otheruser: props.toid },
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
        sender: { username: props.username || "Unknown" },
        createdAt: new Date(),
        read: true,
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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [listmsg]);

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
      read: false,
    };

    setListmsg((oldArray) => [...oldArray, obj127]);

    socket.emit("createdMessage", text);
    e.target.chat.value = "";
  };

  return (
    <div
      className={
        mode
          ? "relative h-full w-full md:w-full "
          : "relative h-full w-0 md:w-full"
      }
    >
      <div className=" flex w-full items-center border-b-2 border-[#F0A21F] py-1">
        <div className="ml-4 hidden w-5 md:visible" onClick={togglemode}>
          <FontAwesomeIcon className="" size="xl" icon={faAngleLeft} />
        </div>
        <span className=" px-4 py-2">{props.username}</span>
      </div>

      <div className=" h-[82%] w-full  px-10">
        <div className=" h-full w-full  overflow-y-scroll ">
          {listmsg.map((data: ChatMessage, index) => {
            let who = false; //let sender = other person

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

            let last = false;
            let newday: boolean = false;

            if (data.sender.username === session?.user?.username) {
              who = true;
            } //change sender to whoever using now

            const date = new Date(data.createdAt.toString());
            const formattedDate = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const formattedDate2 = date.toLocaleString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            if (index === listmsg.length - 1) {
              //console.log(data);
              last = true;
            }

            const date2: Date = listmsg[index].createdAt;

            if (index !== 0) {
              const date1: Date = listmsg[index - 1].createdAt;

              if (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
              ) {
                newday = false;
              } else {
                newday = true;
              }
            } else {
              newday = true;
            }

            return (
              <>
                {newday && (
                  <div className="center-thing relative">
                    <div className=" relative z-10 my-3 bg-white px-3 ">
                      <span className="z-10 text-[#909090]">
                        {formattedDate2}
                      </span>
                    </div>
                    <hr className="absolute z-[-10] h-0.5 w-[60%] bg-black"></hr>
                  </div>
                )}
                <div key={index} className="grid grid-cols-3">
                  <div
                    className={
                      who
                        ? "col-span-2 col-start-2  place-self-end"
                        : "col-span-2 "
                    }
                  >
                    <div
                      className={
                        who
                          ? "my-1 inline-block  bg-[#F0A21F] px-3"
                          : "my-1 inline-block  bg-[#E9E9E9] px-3"
                      }
                    >
                      <span className={who ? "text-white" : "text-[#909090]"}>
                        {formattedDate}
                      </span>
                      <br />
                      <span
                        className={
                          who
                            ? " break-all  text-white"
                            : "break-all  text-black"
                        }
                      >
                        {data.data}
                      </span>
                    </div>
                    {who && data.read && (
                      <div className="text-[0.7rem] text-[#909090] ">Read</div>
                    )}
                  </div>

                  {last && <div ref={messageEndRef} />}
                </div>
              </>
            );
          })}
        </div>
        <div className="absolute  inset-x-0 bottom-0 z-10 flex items-center justify-center">
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
