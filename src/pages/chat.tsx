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

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch("/api/socket");

    socket = io();

    socket.on("newIncomingMessage", (msg) => {
      console.log(msg);
    });
  };

  const sendMessage = async () => {
    console.log("to");
    socket.emit("createdMessage", "hi2");
  };

  return (
    <>
      <Header></Header>
      Chat la
      <div onClick={sendMessage} className="h-8 w-8 bg-black "></div>
    </>
  );
};

export default Chat;
