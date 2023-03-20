import Header from "../components/Header";
import { useSession } from "next-auth/react";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

let socket;

const Chat = () => {
  // We just call it because we don't need anything else out of it
  useEffect(() => {
    socketInitializer();
  }, []);

  const { data: session } = useSession();

  const [msg, setMSG] = useState<string>();
  const [listmsg, Setlistmsg] = useState([]);

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg1) => {
      // console.log(msg1);
      // console.log(socket.id);
      setMSG(msg1);
      Setlistmsg((prev) => [...prev, msg1]);
    });
  };

  const sendForm = (e) => {
    e.preventDefault();
    console.log(e.target.chat.value);
    socket.emit("createdMessage", e.target.chat.value);
  };

  return (
    <>
      <Header></Header>
      {msg}

      <div className="pl-20">
        <span>
          <form onSubmit={sendForm}>
            <input id="chat" className="border-2 border-black"></input>
            <button className="ml-4 border-2 border-blue-700 bg-blue-300 px-2">
              Send
            </button>
          </form>
        </span>
      </div>
      <button
        onClick={() => {
          socket.emit("joinroom1", "room1");
          Setlistmsg((prev) => [
            ...prev,
            "User " + session?.user?.id.toString() + " has joined room1",
          ]);
        }}
        className="h-5 w-20 bg-red-300"
      >
        Room1
      </button>
      <button
        onClick={() => {
          socket.emit("joinroom2", "room2");
          Setlistmsg((prev) => [
            ...prev,
            "User " + session?.user?.id.toString() + " has joined room2",
          ]);
        }}
        className="h-5 w-20 bg-blue-300"
      >
        Room2
      </button>
      <div className="bg-blue-100">
        {listmsg.map((data) => {
          return <li>{data}</li>;
        })}
      </div>
    </>
  );
};

export default Chat;
