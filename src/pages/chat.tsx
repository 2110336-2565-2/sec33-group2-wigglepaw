import Header from "../components/Header";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

let socket;

const Chat = () => {
  // We just call it because we don't need anything else out of it
  useEffect(() => {
    socketInitializer();
  }, []);

  const [msg, setMSG] = useState<string>();

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg1) => {
      console.log(msg1);
      console.log(socket.id);
      setMSG(msg1);
    });
  };

  const sendMessage = async () => {
    console.log("to");
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
      <div onClick={sendMessage} className="h-8 w-8 bg-black "></div>
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
        }}
        className="h-5 w-20 bg-red-300"
      >
        Room1
      </button>
      <button
        onClick={() => {
          socket.emit("joinroom2", "room2");
        }}
        className="h-5 w-20 bg-blue-300"
      >
        Room2
      </button>
    </>
  );
};

export default Chat;
