import { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { useSession } from "next-auth/react";

import io from "socket.io-client";
import { useState, useEffect } from "react";

let socket;

//THis is for PetHotel  (like all chat)

const ChatRoomPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
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
      const msg = {
        host: session?.user?.id.toString(),
        to: "clf5hrxrq002bpassbxledq37", //just for testing
      };
      socket.emit("startChat", msg);
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
      const msg = {
        host: session?.user?.id.toString(),
        to: petSitterData?.userId.toString(),
      };
      socket.emit("startChat", msg);
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
      {username}

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
