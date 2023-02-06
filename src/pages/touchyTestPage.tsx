import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import React, { useState } from "react";

import Header from "../components/Header";
const touchyTestPage = () => {
  const greet = api.touchy.greetings.useQuery({ name: "Touchy69" });
  const user = api.user.getByUsername.useQuery({ username: "touchy" });
  const user2 = api.user.getByUserId.useQuery({
    userId: "cldpsw73e0000u5usuvisdw23",
  });
  const user3 = api.user.getByEmail.useQuery({ email: "kawin69@gmail.com" });
  const [x, setX] = useState(0);
  const postUserAPI = api.user.post.useMutation();
  const deleteUserAPI = api.user.deleteByUsername.useMutation();
  if (!greet.data) {
    return (
      <div style={styleCenter}>
        <h1>Loading...</h1>
      </div>
    );
  }

  const buttonHandlerPostUser = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    postUserAPI.mutate([
      { username: "touchy", email: "touch69@gmail.com" },
      { username: "Son", email: "kawin69@gmail.com" },
    ]);
  };
  const buttonHandlerDeleteUser = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    deleteUserAPI.mutate({ username: ["touchy", "Son"] });
  };

  return (
    <div style={styleCenter}>
      <h1>
        get username<br></br>
        {JSON.stringify(user.data)}
        <br></br>
        get id <br></br>
        {JSON.stringify(user2.data)}
        <br></br>
        get email <br></br>
        {JSON.stringify(user3.data)}
        <br></br>
        {x}
      </h1>

      <div>
        <button onClick={buttonHandlerPostUser}>Post</button> <br></br>
        <button onClick={buttonHandlerDeleteUser}>Delete</button>
      </div>
    </div>
  );
};

const styleCenter = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

export default touchyTestPage;
