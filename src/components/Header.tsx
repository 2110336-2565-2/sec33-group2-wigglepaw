import Link from "next/link";

const Header = () => {
  const isLoggedIn = true;
  return (
    <span className="flex h-fit w-full">
      <nav className=" flex w-full bg-sky-900">
        <div>WigglePaw</div>
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
        <div>ICON</div>
      </nav>
    </span>
  );
};

export default Header;
