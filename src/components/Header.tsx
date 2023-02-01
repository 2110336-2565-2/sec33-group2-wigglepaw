import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const isLoggedIn = true;
  return (
    <span className="flex h-fit w-full bg-sky-900">
      <nav className=" flex w-full">
        <Link href={"/"} className="flex shrink-0">
          <div className="relative m-2 flex h-[4rem] w-[5rem]">
            <Image src={"/../public/logo_w.png"} alt={""} fill></Image>
          </div>
          <h1 className="my-auto text-2xl font-semibold text-white sm:text-3xl">
            WigglePaw
          </h1>
        </Link>
        {/* TODO Collapse buttons into user img if too small width */}
        <ul className="my-auto ml-auto">
          <li className="header-li">
            <div className="header-li-div">
              <Link href="/about" className="header-a">
                About
              </Link>
            </div>
          </li>
          {isLoggedIn && (
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
                <Link href="/register" className="header-a">
                  Register
                </Link>
              </div>
            </li>
          )}
          {!isLoggedIn && (
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
      <div className="relative m-2 flex h-[4rem] w-[4rem]">
        <Image src={"/../public/profile_icon.png"} alt={"Icon"} fill></Image>
      </div>
    </span>
  );
};

export default Header;
