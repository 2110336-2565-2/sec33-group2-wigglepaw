import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { Menu } from "@headlessui/react";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = true; //status === "authenticated"
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

  return (
    <span className="mb-4 flex h-fit w-screen bg-wp-blue md:pr-2">
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
            <div className="my-auto h-fit">
              <Link
                href="/Help"
                className={`header-desktop-button
                ${asPath.includes("/help") ? "header-at-page" : ""}`}
              >
                Help
              </Link>
            </div>
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
                <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-[0.2rem] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                      className="rounded-full"
                    ></Image>
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-[0.2rem] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-[0.1rem]">
                    <Menu.Item>
                      <Link
                        href={`/user/${username}`}
                        className={`
                        header-dropdown group
                        ${
                          asPath.includes("/user/" + username)
                            ? "header-at-page"
                            : ""
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
                    className="rounded-full"
                  ></Image>
                </Menu.Button>
              ) : (
                <Menu.Button className={"header-mobile-menu my-auto h-fit"}>
                  Menu
                </Menu.Button>
              )}

              <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white p-[0.2rem] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                          href={`/user/${username}`}
                          className={`
                        header-dropdown group
                        ${
                          asPath.includes("/user/" + username)
                            ? "header-at-page"
                            : ""
                        }`}
                        >
                          Profile
                        </Link>
                      </Menu.Item>
                    </div>
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
    </span>
  );
};

export default Header;
