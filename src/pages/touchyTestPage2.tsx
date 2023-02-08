import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import React, { useState } from "react";
import Header from "../components/Header";

function fetchAPI() {
    // param is a highlighted word from the user before it clicked the button
    return api.user.post.useQuery("test");
}

const touchyTestPage2 = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    var state = { result: null };
    // api.user.post.useQuery("test");

    const handleClick = async () => {
      try {
        // const response = await api.user.getByUsername.useQuery({username:"touchy"});
        fetchAPI();
        console.log("CLICKED");
/*         const json = await JSON.stringify(response);
        setData(json); */
      } catch (err) {
        console.log(err)
      }
    };
  
    return (
      <div>
        <button onClick={handleClick}>Get Data</button>
        {data && <p>Data: {JSON.stringify(state.result)}</p>}
      </div>
    );
  };
  

export default touchyTestPage2;