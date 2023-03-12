import { NextPage } from "next";
import { useRouter } from "next/router";

const ReviewPage: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;

  return <></>;
};

export default ReviewPage;
