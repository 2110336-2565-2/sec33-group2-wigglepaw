import Header from "../components/Header";

import io from "socket.io-client";
import { useState, useEffect } from "react";
import { api } from "../utils/api";

const Chat = () => {
  api.chat.init.useQuery();
  // We just call it because we don't need anything else out of it

  return (
    <>
      <Header></Header>
      Chat la
    </>
  );
};

export default Chat;
