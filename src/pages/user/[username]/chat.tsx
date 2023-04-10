import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import { useSession } from "next-auth/react";
import { messageFields } from "../../../schema/schema";
import io from "socket.io-client";
import { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import { getServerAuthSession } from "../../../server/auth";

let socket;

const ChatRoomPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  const { data: session } = useSession();
  const [started, setStarted] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const { data: petSitterData } = api.user.getByUsername.useQuery(
    {
      username: typeof username === "string" ? username : "",
    },
    {
      onSuccess: (data) => {
        if (data) window.localStorage.setItem("id", data.userId); //on Success that return real Petsitter,
        //set localstorage to prevent data loss
      },
    }
  );
  const sendchat = api.chat.createMessage.useMutation();

  // We just call it because we don't need anything else out of it
  useEffect(() => {
    socketInitializer();
  }, []);

  useEffect(() => {
    //Notice when session become usable
    if (session) {
      setSessionReady(true);
    }
  }, [session]);

  useEffect(() => {
    //emit Startchat, so that client can enter the room
    if (sessionReady && socket && !started) {
      setStarted(true);

      const msg = {
        host: session?.user?.id.toString(),
        to: localStorage.getItem("id"),
      };
      socket.emit("startChat", msg);
    }
  }, [sessionReady, socket, petSitterData]);

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

  const sendForm = async (e) => {
    e.preventDefault();

    if (!started) {
      //if already emit startchat, don't do it again
      setStarted(true);
      const msg = {
        host: session?.user?.id.toString(),
        to: petSitterData?.userId.toString(),
      };
      socket.emit("startChat", msg); //There is a bug where first message won't send,
      //so I emit startchat here too, just in case
    }

    const msg = e.target.chat.value;
    //console.log(e.target.chat.value);

    const packageja = {
      petOwnerId: session?.user?.userId,
      petSitterId: window.localStorage.getItem("id"),
      data: e.target.chat.value,
      senderId: session?.user?.userId,
    };

    await sendchat.mutateAsync(packageja, {
      onSuccess: (data) => {
        console.log(data);
      },
    });

    Setlistmsg((prev) => [...prev, msg]);

    //send message
    socket.emit("createdMessage", msg);
    e.target.chat.value = "";
  };

  return (
    <>
      <Header></Header>
      HGGG
      {username}
      <div>{petSitterData?.userId}</div>
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  console.log("in server side props woiiii");

  if (!session || !session.user) {
    console.log("redirecting wooooooiiii");

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  console.log("normally render pagee no redirect woiii");

  return {
    props: { session }, // prefetched session on the serverside, no loading on the front
  };
};
