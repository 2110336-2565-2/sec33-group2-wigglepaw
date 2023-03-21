import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import { useSession } from "next-auth/react";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

let socket;

const ChatRoomPage: NextPage = () => {
  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
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
      socket.emit("startChat", session?.user?.id.toString());
    }
  }, [sessionReady, socket]);

  const [msg, setMSG] = useState<string>();
  const [listmsg, Setlistmsg] = useState([]);

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

  const sendForm = (e) => {
    e.preventDefault();

    if (!started) {
      setStarted(true);
      socket.emit("startChat", session?.user?.id.toString());
    }

    const msg = e.target.chat.value;
    console.log(e.target.chat.value);

    Setlistmsg((prev) => [...prev, msg]);
    socket.emit("createdMessage", msg);
    e.target.chat.value = "";
  };

  return (
    <>
      <Header></Header>
      {msg}
      <div className=" h-[90vh]   ">
        <div className="h-[80%] px-32">
          <div className="bg-blue-100">
            {listmsg.map((data) => {
              return <li>{data}</li>;
            })}
          </div>
        </div>
        <div className="flex items-end justify-center">
          <span>
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

export default ChatRoomPage;
