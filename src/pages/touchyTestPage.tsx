import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

import Header from "../components/Header";
const touchyTestPage = () => {
    const greet = api.touchy.greetings.useQuery({name:"Touchy69"});
    const user = api.user.getByUsername.useQuery({username:"touchy"});

    if (!greet.data) {
        return (
            <div style={styleCenter}>
                <h1>Loading...</h1>
            </div>
        );
    }
  return (
    <div style={styleCenter}>
        <h1>{greet.data.text}<br></br>{JSON.stringify(user.data)}</h1>
    </div>
);
}

const styleCenter = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

}

export default touchyTestPage;