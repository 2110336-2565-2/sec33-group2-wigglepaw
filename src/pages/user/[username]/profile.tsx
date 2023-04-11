import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { lazy } from "react";
import superjson from "superjson";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { getServerAuthSession } from "../../../server/auth";
import type { UserProfile, UserProfileSubType } from "../../../types/user";
import { UserType } from "../../../types/user";

const FreelancePetSitterProfile = lazy(
  () => import("../../../components/Profile/FreelancePetSitterProfile")
);
const PetHotelProfile = lazy(
  () => import("../../../components/Profile/PetHotelProfile")
);
const PetOwnerProfile = lazy(
  () => import("../../../components/Profile/PetOwnerProfile")
);

// ssr, this function is run on server before page is sent to client
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Fetch user and profile data concurrently
  const [user, profile] = await Promise.all([
    getServerAuthSession(ctx).then((session) => session?.user),
    (async () => {
      const caller = appRouter.createCaller(
        createInnerTRPCContext({ session: null })
      );
      return await caller.user.getForProfilePage({
        username: ctx.query.username as string,
      });
    })(),
  ]);

  // if not logged in, redirect to login
  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // if profile not found, redirect to 404
  if (!profile) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      // use superjson to serialize complex data (such as Date).
      profile: superjson.stringify(profile),
      user: {
        username: user.username,
        userType: user.userType,
      },
    },
  };
};

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, profile }) => {
  // deserialize data back (see the return in getServerSideProps)
  const data = superjson.parse<(UserProfile & UserProfileSubType) | null>(
    profile
  );

  if (data === null) return <div>Not found</div>;

  const editable = user.username === data.username;
  const isPetOwner = user.userType === UserType.PetOwner;

  switch (data.userType) {
    case UserType.PetOwner:
      return <PetOwnerProfile user={data} editable={editable} />;

    case UserType.FreelancePetSitter:
      return (
        <FreelancePetSitterProfile
          user={data}
          editable={editable}
          isPetOwner={isPetOwner}
        />
      );

    case UserType.PetHotel:
      return (
        <PetHotelProfile
          user={data}
          editable={editable}
          isPetOwner={isPetOwner}
        />
      );

    default:
      return <div>Error จ้า</div>;
  }
};

export default ProfilePage;
