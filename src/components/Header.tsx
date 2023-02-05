import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [openRegister, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const toggleRegister = () => setOpen(!openRegister);
  const toggleProfile = () => setOpenProfile(!openProfile);
  const logout = () => signOut();

  return (
    <span className="mb-4 flex h-fit w-full bg-sky-900 pr-2">
      <nav className=" flex w-full">
        <Link href={"/"} className="flex shrink-0">
          <div className="relative m-2 flex h-[4rem] w-[5rem]">
            <Image
              src={"/logo_w.png"}
              sizes="50vw,50vw,33vw"
              alt={""}
              fill
            ></Image>
          </div>
          <h1 className="my-auto mr-2 text-2xl font-bold text-white sm:text-3xl">
            WigglePaw
          </h1>
        </Link>
        {/* TODO Collapse buttons into user img if too small width */}
        <ul className="invisible my-auto ml-auto sm:visible">
          <li className="header-li">
            <div className="header-li-div">
              <Link href="/about" className="header-a">
                About
              </Link>
            </div>
          </li>
          {!isLoggedIn && (
            <li className="header-li">
              <div className="header-li-div">
                <Link href="/login" className="header-a">
                  Login
                </Link>
              </div>
            </li>
          )}
          {isLoggedIn && (
            <li className="header-li">
              <div className="header-li-div">
                <Link href="/help" className="header-a">
                  Help
                </Link>
              </div>
            </li>
          )}
        </ul>
      </nav>
      {!isLoggedIn && (
        <div className="relative my-auto">
          <button onClick={toggleRegister} className="header-a my-auto h-fit">
            Register
          </button>
          <div
            className="absolute top-full right-0 rounded bg-slate-300 px-2 py-1"
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
      {isLoggedIn && (
        <div className="relative my-auto">
          <div className="relative m-2 flex h-[4rem] w-[4rem]">
            <button onClick={toggleProfile} className="header-a my-auto h-fit">
              <Image
                src={"/../public/profile_icon.png"}
                alt={"Icon"}
                fill
              ></Image>
            </button>
            <div
              className="absolute top-full right-0 rounded bg-slate-300 px-2 py-1"
              hidden={!openProfile}
            >
              <Link href="/profile" className="header-register-link">
                Profile
              </Link>
              <button onClick={logout}>
                <Link href="/" className="header-register-link">
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
