import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { Menu } from "@headlessui/react";
import { UserType } from "../types/user";
import { BookingStatus } from "@prisma/client";

const Header = (props: any) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const logout = () => signOut();
  const username = session?.user?.username;

  const router = useRouter();
  const asPath = router.asPath;

  const previousPage = router.query.previousPage
    ? router.query.previousPage
    : asPath;

  const userData = api.user.getByUsername.useQuery({
    username: username ? username : "",
  });

  const profileImageUri = userData?.data?.imageUri
    ? userData?.data?.imageUri
    : "/profiledummy.png";

  const profileLink = username
    ? "/user/" + username.toString() + "/profile"
    : "";

  return (
    <span
      className={
        "flex h-fit w-screen flex-col bg-wp-blue md:pr-2 " + props.className
      }
    >
      <nav className="flex w-full justify-between">
        <Link href={"/"} className="flex shrink-0">
          <div className="relative m-2 flex h-[4rem] w-[5rem]">
            <Image src={"/logo_w.png"} alt={"WigglePaw"} fill></Image>
          </div>
          <h1 className="my-auto mr-2 text-2xl font-bold text-white sm:text-3xl">
            WigglePaw
          </h1>
        </Link>

        {/* ----------------------Desktop---------------------- */}
        <div className="hidden sm:flex">
          <div className="my-auto h-fit">
            <Link
              href="/about"
              className={`header-desktop-button
                ${asPath.includes("/about") ? "header-at-page" : ""}`}
            >
              About
            </Link>
          </div>
          {isLoggedIn && (
            <>
              <div className="my-auto h-fit">
                <Link
                  href="/help"
                  className={`header-desktop-button
                ${asPath.includes("/help") ? "header-at-page" : ""}`}
                >
                  Help
                </Link>
              </div>
              {session?.user?.userType == UserType.PetOwner && (
                <div className="my-auto h-fit">
                  <Link
                    href="/matching"
                    className={`header-desktop-button 
                ${asPath.includes("/matching") ? "header-at-page" : ""}`}
                  >
                    Find Pet Sitters
                  </Link>
                </div>
              )}
              {/* TODO: My Schedule Button for Pet Sitters */}
              {(session?.user?.userType == UserType.FreelancePetSitter ||
                session?.user?.userType == UserType.PetHotel) && (
                <div className="my-auto h-fit">
                  <Link
                    href="/schedule"
                    className={`header-desktop-button 
                ${asPath.includes("/schedule") ? "header-at-page" : ""}`}
                  >
                    My Schedule
                  </Link>
                </div>
              )}
            </>
          )}

          {!isLoggedIn && (
            <>
              <div className="my-auto h-fit">
                <Link
                  href={{
                    pathname: "/login",
                    query: { previousPage: previousPage },
                  }}
                  className={`header-desktop-button
                  ${
                    asPath.includes("/login")
                      ? "header-at-page pointer-events-none cursor-default"
                      : ""
                  }`}
                >
                  Login
                </Link>
              </div>

              <Menu>
                <div className="my-auto">
                  <Menu.Button className={"header-desktop-button my-auto"}>
                    Register
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 z-20 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-[0.2rem] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-[0.1rem]">
                    <Menu.Item>
                      <Link
                        href="/registerPetOwner"
                        className={`
                      header-dropdown group
                      ${
                        asPath.includes("/registerPetOwner")
                          ? "header-at-page border-green-700 text-green-700"
                          : "bg-green-700 hover:bg-green-500"
                      }`}
                      >
                        Register Pet Owner
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        href="/registerPetSitter"
                        className={`
                      header-dropdown group
                      ${
                        asPath.includes("/registerPetSitter")
                          ? "header-at-page border-green-700 text-green-700"
                          : "bg-green-700 hover:bg-green-500"
                      }`}
                      >
                        Register Pet Sitter
                      </Link>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </>
          )}

          {isLoggedIn && (
            <div className="relative my-auto">
              <Menu>
                <div className="my-auto">
                  <Menu.Button
                    className={"relative m-2 flex h-[4rem] w-[4rem]"}
                  >
                    <Image
                      src={profileImageUri}
                      alt={"Icon"}
                      fill
                      className="rounded-full object-cover"
                    ></Image>
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 z-20 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-[0.2rem] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-[0.1rem]">
                    <Menu.Item>
                      <Link
                        href={profileLink}
                        className={`
                        header-dropdown group
                        ${
                          asPath.includes(profileLink) ? "header-at-page" : ""
                        }`}
                      >
                        Profile
                      </Link>
                    </Menu.Item>
                  </div>
                  <div className="px-1 py-[0.1rem]">
                    <Menu.Item>
                      <button
                        onClick={logout}
                        className={`header-dropdown group`}
                      >
                        Logout
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          )}
        </div>

        {/* ----------------------Mobile---------------------- */}
        {status != "loading" && (
          <div className="relative my-auto sm:hidden">
            <Menu>
              {isLoggedIn ? (
                <Menu.Button className={"relative m-2 flex h-[4rem] w-[4rem]"}>
                  <Image
                    src={profileImageUri}
                    alt={"Icon"}
                    fill
                    className="rounded-full object-cover"
                  ></Image>
                </Menu.Button>
              ) : (
                <Menu.Button className={"header-mobile-menu my-auto h-fit"}>
                  Menu
                </Menu.Button>
              )}

              <Menu.Items className="absolute right-0 z-20 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-[0.2rem] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {!isLoggedIn && (
                  <>
                    <div className="px-1 py-[0.1rem]">
                      <Menu.Item>
                        <Link
                          href={{
                            pathname: "/login",
                            query: { previousPage: previousPage },
                          }}
                          className={`
                            header-dropdown group
                            ${
                              asPath.includes("/login")
                                ? "header-at-page pointer-events-none cursor-default"
                                : ""
                            }`}
                        >
                          Login
                        </Link>
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-[0.1rem]">
                      <Menu.Item>
                        <Link
                          href="/registerPetOwner"
                          className={`
                      header-dropdown group
                      ${
                        asPath.includes("/registerPetOwner")
                          ? "header-at-page border-green-700 text-green-700"
                          : "bg-green-700 hover:bg-green-500"
                      }`}
                        >
                          Register Pet Owner
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link
                          href="/registerPetSitter"
                          className={`
                      header-dropdown group
                      ${
                        asPath.includes("/registerPetSitter")
                          ? "header-at-page border-green-700 text-green-700"
                          : "bg-green-700 hover:bg-green-500"
                      }`}
                        >
                          Register Pet Sitter
                        </Link>
                      </Menu.Item>
                    </div>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <div className="px-1 py-[0.1rem]">
                      <Menu.Item>
                        <Link
                          href={profileLink}
                          className={`
                        header-dropdown group
                        ${
                          asPath.includes(profileLink) ? "header-at-page" : ""
                        }`}
                        >
                          Profile
                        </Link>
                      </Menu.Item>
                    </div>
                    {session?.user?.userType == UserType.PetOwner && (
                      <div className="px-1 py-[0.1rem]">
                        <Menu.Item>
                          <Link
                            href="/matching"
                            className={`
                        header-dropdown group
                        ${
                          asPath.includes("/matching") ? "header-at-page" : ""
                        }`}
                          >
                            Find Pet Sitters
                          </Link>
                        </Menu.Item>
                      </div>
                    )}
                    {/* TODO: My Schedule Button for Pet Sitters */}
                    {(session?.user?.userType == UserType.FreelancePetSitter ||
                      session?.user?.userType == UserType.PetHotel) && (
                      <div className="px-1 py-[0.1rem]">
                        <Menu.Item>
                          <Link
                            href="/schedule"
                            className={`
                        header-dropdown group
                        ${
                          asPath.includes("/schedule") ? "header-at-page" : ""
                        }`}
                          >
                            My Schedule
                          </Link>
                        </Menu.Item>
                      </div>
                    )}
                  </>
                )}
                <div className="px-1 py-[0.1rem]">
                  <Menu.Item>
                    <Link
                      href="/about"
                      className={`
                      header-dropdown group
                      ${asPath.includes("/about") ? "header-at-page" : ""}`}
                    >
                      About
                    </Link>
                  </Menu.Item>
                </div>
                <div className="px-1 py-[0.1rem]">
                  <Menu.Item>
                    <Link
                      href="/help"
                      className={`
                      header-dropdown group
                      ${asPath.includes("/help") ? " header-at-page" : ""}`}
                    >
                      Help
                    </Link>
                  </Menu.Item>
                </div>
                <div className="px-1 py-[0.1rem]">
                  <Menu.Item>
                    <button
                      onClick={logout}
                      className={`header-dropdown group`}
                    >
                      Logout
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        )}
      </nav>

      <ReminderBar />
    </span>
  );
};

const ReminderBar = () => {
  const booking = api.booking.getMyBooking.useQuery();

  // Filter out only bookings that are accepted and start within 24 hours
  const remindableBooking = booking.data?.filter((book) => {
    return (
      book.status === BookingStatus.accepted &&
      book.startDate.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 &&
      book.startDate.getTime() - new Date().getTime() > 0
    );
  });
  const nRemindable = (remindableBooking ?? []).length;

  return nRemindable > 0 ? (
    <Link
      href="/schedule"
      className="bg-green-500 p-1 text-center text-sm text-white"
    >
      FYI, there exists {nRemindable} upcoming appointment within the next 24
      hours, <span className="underline">check out your schedule!</span>
    </Link>
  ) : null;
};

export default Header;
