import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";

import Header from "../components/Header";
const touchyTestPage = () => {
    const result = api.touchy.greetings.useQuery({name:"Echidna"});

    if (!result.data) {
        return (
            <div style={styleCenter}>
                <h1>Loading...</h1>
            </div>
        );
    }
  return (
    <div style={styleCenter}>
        <h1>{result.data.text}</h1>
    </div>
);
}

const styleCenter = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'

}

export default touchyTestPage;