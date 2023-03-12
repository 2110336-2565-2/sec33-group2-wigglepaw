import { NextPage } from "next";
import { useRouter } from "next/router";

const BookingPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  return <></>;
};

export default BookingPage;
