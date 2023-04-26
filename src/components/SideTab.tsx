import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Image from "next/image";
import Link from "next/link";

type SideTabProps = {
  user?: any;
  isPetOwner?: boolean;
  booking?: any;
  help?: any;
  admin?: any;
};

export default function SideTab(props: SideTabProps) {
  const [openTab, setOpenTab] = React.useState(false);

  if (props.booking) {
    return (
      <div>
        {/* TAB BUTTON */}
        {OpenSideTabButton()}
        {/* SIDE TAB */}
        <div
          className={`fixed top-0 z-20 h-screen w-[219px] bg-[#E5D4C2] pt-[30%] md:relative md:z-0 md:h-full ${
            !openTab ? "max-md:hidden" : ""
          }`}
        >
          {/* Close Button */}
          <div className="top-50 absolute right-0 block md:hidden">
            <button
              id="toggle-sidetab-button"
              className={`flex items-center justify-center`}
              onClick={() => {
                setOpenTab((prev) => !prev);
              }}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className={`rounded-full border ${openTab} bg-gray-400 p-1`}
              />
            </button>
          </div>
          <div className="relative mx-auto flex h-[135px] w-[135px]">
            <Image
              src={props.user?.imageUri ?? "/profiledummy.png"}
              alt={"Profile Picture"}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="mx-auto my-1 text-center text-2xl font-semibold">
            {props.user?.username}
          </div>
          <div className="my-16">
            <div className="flex flex-col border">
              {/*Profile Tab*/}
              <Link
                id="profile-sidetab-link"
                href={`/user/${props.user?.username}/profile`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
              >
                Profile
              </Link>
              {/*Booking Tab*/}
              {props.isPetOwner && (
                <Link
                  id="booking-sidetab-link"
                  href={`/user/${props.user?.username}/booking`}
                  className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
                >
                  Booking
                </Link>
              )}
              {/*Review Tab*/}
              <Link
                id="review-sidetab-link"
                href={`/user/${props.user?.username}/review`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
              >
                Review
              </Link>
              {/*Contact Tab*/}
              {props.isPetOwner && (
                <Link
                  id="chat-sidetab-link"
                  href={{
                    pathname: "/chat",
                    query: { username: props.user?.userId },
                  }}
                  className="flex h-[58px] w-[219px] items-center justify-center border bg-[#B77B59] text-lg font-medium hover:bg-[#A96037]"
                >
                  Chat
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.help) {
    return (
      <div>
        {/* TAB BUTTON */}
        {OpenSideTabButton()}
        {/* SIDE TAB */}
        <div
          className={`fixed top-0 z-20 h-screen w-[219px] bg-[#B6B6B6] pt-[30%] md:relative md:z-0 md:h-full ${
            !openTab ? "max-md:hidden" : ""
          }`}
        >
          {/* Close Button */}
          <div className="top-50 absolute right-0 block md:hidden">
            <button
              id="toggle-sidetab-button"
              className={`flex items-center justify-center`}
              onClick={() => {
                setOpenTab((prev) => !prev);
              }}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className={`rounded-full border ${openTab} bg-gray-400 p-1`}
              />
            </button>
          </div>
          <div className="mx-auto my-1 text-center text-2xl font-semibold">
            Help Center
          </div>
          <div className="my-16">
            <div className="flex flex-col">
              {/*Report problem Tab*/}
              <Link
                id="report-problem-sidetab-link"
                href={`/help/`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Help Page
              </Link>

              {/*Report problem Tab*/}
              <Link
                id="report-problem-sidetab-link"
                href={`/help/reports/new`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Report a Problem
              </Link>

              {/*View My Report Tab*/}
              <Link
                id="view-problem-sidetab-link"
                href={`/help/reports`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                View My Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.admin) {
    return (
      <div>
        {/* TAB BUTTON */}
        {OpenSideTabButton()}
        {/* SIDE TAB */}
        <div
          className={`fixed top-0 z-20 h-screen w-[219px] bg-[#B6B6B6] pt-[30%] md:relative md:z-0 md:h-full ${
            !openTab ? "max-md:hidden" : ""
          }`}
        >
          {/* Close Button */}
          <div className="top-50 absolute right-0 block md:hidden">
            <button
              id="toggle-sidetab-button"
              className={`flex items-center justify-center`}
              onClick={() => {
                setOpenTab((prev) => !prev);
              }}
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className={`rounded-full border ${openTab} bg-gray-400 p-1`}
              />
            </button>
          </div>
          <div className="mx-auto my-1 text-center text-2xl font-semibold">
            Welcome Admin
          </div>
          <div className="my-16">
            <div className="flex flex-col">
              {/*Dashboard Tab*/}
              <Link
                id="admin-dashboard-sidetab-link"
                href={`/admin/`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Dashboard
              </Link>
              {/*Pet Sitters Tab*/}
              <Link
                id="admin-verify-sidetab-link"
                href={`/admin/verification`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Pet Sitters
              </Link>
              {/*Review Tab*/}
              <Link
                id="admin-review-sidetab-link"
                href={`/admin/reviews`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                Reviews
              </Link>
              {/*User Reports Tab*/}
              <Link
                id="admin-reports-sidetab-link"
                href={`/admin/report`}
                className="flex h-[58px] w-[219px] items-center justify-center border bg-[#D9D9D9] text-lg font-medium hover:bg-[#A3A3A3]"
              >
                User Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }

  function OpenSideTabButton() {
    return (
      <div className="top-50 fixed left-0 z-10 block md:hidden">
        <button
          id="open-sidetab-button"
          className={`flex items-center justify-center`}
          onClick={() => {
            setOpenTab((prev) => !prev);
          }}
        >
          <FontAwesomeIcon
            icon={faUser}
            className={`rounded-full border ${openTab} bg-gray-400 p-1`}
          />
        </button>
      </div>
    );
  }
}
