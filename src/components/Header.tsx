import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../utils/api";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const logout = () => signOut();
  const username = session?.user?.username;

  const [openRegister, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const toggleRegister = () => setOpen(!openRegister);
  const toggleProfile = () => setOpenProfile(!openProfile);

  const router = useRouter();
  const asPath = router.asPath;

  const userData = api.user.getByUsername.useQuery({
    username: username ? username : "",
  });

  const profileImageUri = userData?.data?.imageUri
    ? userData?.data?.imageUri
    : "/profiledummy.png";

  return (
    <span className="mb-4 flex h-fit w-screen bg-wp-blue md:pr-2">
      <nav className="flex w-full">
        <Link href={"/"} className="flex shrink-0">
          <div className="relative m-2 ml-6 flex h-[4rem] w-[5rem]">
            <Image src={"/logo_w.png"} alt={""} fill></Image>
          </div>
          <h1 className="my-auto mr-2 text-2xl font-bold text-white sm:text-3xl">
            WigglePaw
          </h1>
        </Link>
        <ul className="my-auto ml-auto hidden sm:block">
          <li className="header-li">
            <div className="header-li-div">
              <Link
                href="/about"
                className={
                  "header-a" +
                  `${asPath.includes("/about") ? " header-at-page" : ""}`
                }
              >
                About
              </Link>
            </div>
          </li>
          {!isLoggedIn && (
            <li className="header-li">
              <div className="header-li-div">
                <Link
                  href={{
                    pathname: "/login",
                    query: { previousPage: asPath },
                  }}
                  className={
                    "header-a" +
                    `${asPath.includes("/login") ? " header-at-page" : ""}`
                  }
                >
                  Login
                </Link>
              </div>
            </li>
          )}
          {isLoggedIn && (
            <li className="header-li">
              <div className="header-li-div">
                <Link
                  href="/help"
                  className={
                    "header-a" +
                    `${asPath.includes("/help") ? " header-at-page" : ""}`
                  }
                >
                  Help
                </Link>
              </div>
            </li>
          )}
        </ul>
      </nav>
      {!isLoggedIn && (
        <div className="relative my-auto hidden sm:flex">
          <button
            onClick={toggleRegister}
            className={
              "header-a my-auto h-fit" +
              `${
                asPath.includes("/registerPetOwner" || "/registerPetSitter")
                  ? " header-at-page"
                  : ""
              }`
            }
          >
            Register
          </button>
          <div
            className="absolute top-full right-0 z-30 rounded bg-slate-300 px-2 py-1"
            hidden={!openRegister}
          >
            <Link href="/registerPetOwner" className="header-register-link">
              Register Pet Owner
            </Link>
            <Link href="/registerPetSitter" className="header-register-link">
              Register Pet Sitter
            </Link>
          </div>
        </div>
      )}
      {!isLoggedIn && status != "loading" && (
        <div className="relative my-auto sm:hidden">
          <button onClick={toggleRegister} className="header-a my-auto h-fit">
            Menu
          </button>
          <div
            className="absolute top-full right-0 z-30 rounded bg-slate-300 px-2 py-1"
            hidden={!openRegister}
          >
            <Link
              href="/about"
              className={
                "header-register-link bg-wp-blue hover:bg-wp-light-blue" +
                `${asPath.includes("/about") ? " header-at-page" : ""}`
              }
            >
              About
            </Link>
            <Link
              href={{
                pathname: "/login",
                query: { previousPage: asPath },
              }}
              className={
                "header-register-link" +
                `${
                  asPath.includes("/login")
                    ? " header-at-page"
                    : " bg-wp-blue hover:bg-wp-light-blue"
                }`
              }
            >
              Login
            </Link>
            <Link
              href="/registerPetOwner"
              className={
                "header-register-link" +
                `${
                  asPath.includes("/registerPetOwner")
                    ? " header-at-page text-green-700"
                    : ""
                }`
              }
            >
              Register Pet Owner
            </Link>
            <Link
              href="/registerPetSitter"
              className={
                "header-register-link" +
                `${
                  asPath.includes("/registerPetSitter")
                    ? " header-at-page text-green-700"
                    : ""
                }`
              }
            >
              Register Pet Sitter
            </Link>
          </div>
        </div>
      )}
      {isLoggedIn && (
        <div className="relative my-auto ml-1">
          <div className="relative m-2 flex h-[4rem] w-[4rem]">
            <button onClick={toggleProfile} className="my-auto h-fit">
              <Image
                src={profileImageUri}
                alt={"Icon"}
                fill
                className="rounded-xl object-cover"
              ></Image>
            </button>
            <div
              className="absolute top-full right-0 z-30 rounded bg-slate-300 px-2 py-1"
              hidden={!openProfile}
            >
              <Link
                href={`/user/${username!}`}
                className={
                  "header-menu-link" +
                  `${
                    asPath.includes("/user/" + username!)
                      ? " header-at-page"
                      : ""
                  }`
                }
              >
                Profile
              </Link>
              <Link
                href="/about"
                className={
                  "header-menu-link sm:hidden" +
                  `${asPath.includes("/about") ? " header-at-page" : ""}`
                }
              >
                About
              </Link>
              <Link
                href="/help"
                className={
                  "header-menu-link sm:hidden" +
                  `${asPath.includes("/help") ? " header-at-page" : ""}`
                }
              >
                Help
              </Link>
              <button onClick={logout}>
                <Link href="/" className="header-menu-link">
                  Logout
                </Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};

export default Header;
