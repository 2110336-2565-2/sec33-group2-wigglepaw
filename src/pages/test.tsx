import { api } from "../utils/api";

export default function Test() {
  const freelancePetSitter = api.user.getForProfilePage.useQuery({
    username: "abc",
  });
  const petHotel = api.user.getForProfilePage.useQuery({
    username: "def",
  });
  const petOwner = api.user.getForProfilePage.useQuery({
    username: "ghi",
  });

  return (
    <div>
      <code className="w-full overflow-x-scroll border-2">
        {JSON.stringify(freelancePetSitter.data)}
      </code>
      <code className="w-full overflow-x-scroll border-2">
        {JSON.stringify(petHotel.data)}
      </code>
      <code className="w-full overflow-x-scroll border-2">
        {JSON.stringify(petOwner.data)}
      </code>
      {/* <code className="w-full overflow-x-scroll border-2">
        {JSON.stringify(freelancePetSitter.data)}
      </code> */}
    </div>
  );
}
