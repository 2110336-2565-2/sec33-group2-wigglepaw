import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import React, { useState } from "react";

import Header from "../components/Header";
const touchyTestPage = () => {
    const greet = api.touchy.greetings.useQuery({name:"Touchy69"});
    const user = api.user.getByUsername.useQuery({username:"touchy"});
    const user2 = api.user.getByUserId.useQuery({userId:"cldpsw73e0000u5usuvisdw23"});
    const user3 = api.user.getByEmail.useQuery({email:"touch69@gmail.com"});
    const [x,setX] = useState(0);
    const postUserAPI = api.user.post.useMutation();
    if (!greet.data) {
        return (
            <div style={styleCenter}>
                <h1>Loading...</h1>
            </div>
        );
    }

    const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setX(x+1);
        console.log("CLICKED");
        postUserAPI.mutate("test");
      };

  return (
    <div style={styleCenter}>
        <h1>
        {greet.data.text}<br></br>
        {JSON.stringify(user.data)}<br></br>
        {JSON.stringify(user2.data)}<br></br>
        {JSON.stringify(user3.data)}<br></br>
        {x}
        </h1>

        <div>
        <button onClick={buttonHandler}>Click</button>
            
        </div>
        

    </div>
);
}

const styleCenter = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

}

export default touchyTestPage;