import { NextPage } from "next";
import { useRouter } from "next/router";

const ChatRoomPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  return (
    <div>
      <button>back</button>
      <h1>Theresaross</h1>
      <button>mute</button>
      <button>block</button>
    </div>
  );
};

export default ChatRoomPage;
