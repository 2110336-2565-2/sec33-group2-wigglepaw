import { NextPage } from "next";
import { useRouter } from "next/router";

const ChatRoomPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  return <></>;
};

export default ChatRoomPage;
