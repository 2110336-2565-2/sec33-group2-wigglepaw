import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const isLoggedIn = true;
  return (
    <span className="flex h-fit w-full bg-sky-900">
      <Image
        src={"/../public/logo_w.png"}
        alt={""}
        width={80}
        height={60}
      ></Image>
      <div>WigglePaw</div>
      <nav className=" flex w-full">
        <ul className="ml-auto">
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
        </ul>
      </nav>
      <div className="relative ml-2">
        <Image src={"/../public/profile_icon.png"} alt={"Icon"} fill></Image>
      </div>
    </span>
  );
};

export default Header;
