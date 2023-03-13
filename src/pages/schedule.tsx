import { type NextPage } from "next";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import "react-calendar/dist/Calendar.css";
import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import SessionSmallCard from "../components/Calendar/Sessionsmallcard";
import SessionMediumCard from "../components/Calendar/Sessionmediumcard";
import Image from "next/image";
import { api } from "../utils/api";

const Scheulde: NextPage = () => {
  type Insid = { title: string; start: string; end: string };

  interface help {
    title: string;
    start: string;
    end: string;
    color: string;
    mode: string;
  }

  const [passing, setPassing] = useState<help[]>([]);

  const [events, setEvents] = useState([]);

  const [pending, setpending] = useState<help[]>([]);
  const [accepted, setaccepted] = useState<help[]>([]);
  const [finished, setfinished] = useState<help[]>([]);
  const [cancelled, setcancelled] = useState<help[]>([]);
  const [showUp, setShowup] = useState(false);
  const [showOn, setShowon] = useState(false);
  const [showFin, setShowfin] = useState(false);
  const [showCan, setShowcan] = useState(false);
  const [savelen, setSavelen] = useState(-2);

  const [mode, setMode] = useState(false);

  api.booking.getMyBooking.useQuery([], {
    onSuccess: (gg) => {
      const updatedPending = [];
      const updatedAccepted = [];
      const updatedCancelled = [];
      const updatedFinished = [];
      if (gg.length === savelen) {
      } else {
        setEvents([]);
        setSavelen(gg.length);
        gg.forEach((value) => {
          //console.log(value);

          const date1 = new Date(value.startDate.toString());
          value.startDate = date1.toDateString();

          const date2 = new Date(value.endDate.toString());
          value.endDate = date2.toDateString();

          const colorbg = (status) => {
            if (status === "requested") {
              return "#fdba74";
            } else if (status === "accepted") {
              return "#a5f3fc";
            } else if (status === "canceled") {
              return "#bef264";
            } else {
              return "#cbd5e1";
            }
          };

          const add = {
            title: value.petOwner.firstName,
            start: date1,
            end: date2,
            color: colorbg(value.status),
          };
          //console.log(events);

          setEvents((prevevents) => [...prevevents, add]);

          if (value.status === "requested") {
            updatedPending.push(value);
          } else if (value.status === "accepted") {
            updatedAccepted.push(value);
          } else if (value.status === "rejected") {
            updatedCancelled.push(value);
          } else {
            updatedFinished.push(value);
          }
        });

        setpending(updatedPending);
        setaccepted(updatedAccepted);
        setcancelled(updatedCancelled);
        setfinished(updatedFinished);
      }
    },
  });

  useEffect(() => {
    // api.booking.getMyBooking.useQuery({
    //   onSuccess: (data) => {
  }, []);

  const eventContent = ({ event, view }) => {
    // Create a new div element for the event
    const eventEl = document.createElement("div");
    // Set the font size of the event
    eventEl.style.fontSize = "11px";
    eventEl.style.color = "black";

    eventEl.style.borderColor = "black";
    eventEl.style.borderStyle = "solid";
    eventEl.style.borderWidth = "1px";

    eventEl.style.paddingLeft = "5px";

    // Set the innerHTML of the event element
    eventEl.innerHTML = event.title;
    // Return the new event element as a React component
    return (
      <>
        {React.createElement("div", {
          dangerouslySetInnerHTML: { __html: eventEl.outerHTML },
        })}
      </>
    );
  };

  //filter type of events, this would be very effective with use Quary,

  const changemode = (data) => {
    setPassing(data);
    console.log(passing);
    setMode(true);
  };

  return (
    <>
      <Header />

      <div className="relative w-screen items-center justify-start  md:flex md:h-screen">
        <Image
          src="/calendarbg.png"
          className="hidden md:visible"
          alt="bg"
          fill
        />
        <div className="mx-4 h-full w-full md:ml-20 md:mr-10 md:flex">
          <div className="z-10 h-[90%] w-[92%] overflow-y-scroll  bg-white md:w-full">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              contentHeight={"auto"}
              stickyFooterScrollbar={true}
              weekNumbers={true}
              headerToolbar={
                {
                  //hi
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek",
                } // user can switch between the two
              }
              eventClick={function (arg) {
                console.log(arg.event.title);
                console.log("Start: ", arg.event.start, "End: ", arg.event.end);
              }}
              events={events}
              eventColor={"#378006"}
              eventContent={eventContent}
            />
          </div>
          <div className="relative z-10 mt-10 w-[90%] overflow-x-hidden overflow-y-scroll border-2 border-[#E7E7E7] bg-white md:mt-0 md:ml-5 md:h-[90%] md:w-[50%]">
            {mode === false ? (
              <div className="center-thing mb-5 bg-[#7B7B7B] py-5 text-2xl text-white">
                {" "}
                My Sessions
              </div>
            ) : (
              <div className="center-thing relative mb-5 bg-[#7B7B7B] py-5 text-2xl text-white">
                {" "}
                Session Details
                <button
                  onClick={() => {
                    setMode(false);
                  }}
                  className="absolute left-0 ml-2 bg-transparent p-3  text-white"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
              </div>
            )}
            {mode === false ? (
              <div className=" px-5">
                <div
                  className="center-thing relative mb-1 border-b-4 border-orange-600 bg-orange-300 bg-opacity-50 px-10 py-2 text-center font-semibold text-orange-600 shadow-md "
                  onClick={() => {
                    //console.log(events, "Mine");
                    setShowup((prev) => !prev);
                  }}
                >
                  Pending
                  <p className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl font-semibold">
                    {showUp ? "-" : "+"}
                  </p>
                  <div className="ml-5 h-6 w-6 rounded-full bg-white ">
                    {pending.length}
                  </div>
                </div>
                {showUp &&
                  pending.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div
                        onClick={() => {
                          changemode(value);
                        }}
                      >
                        <SessionSmallCard data={value} />
                      </div>
                    );
                  })}
                <div
                  className="center-thing relative mt-5 border-b-4 border-blue-400 bg-cyan-200 bg-opacity-50 py-2 text-center font-semibold text-blue-400 shadow-md"
                  onClick={() => {
                    setShowon((prev) => !prev);
                  }}
                >
                  Accepted
                  <p className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl font-semibold">
                    {showOn ? "-" : "+"}
                  </p>
                  <div className="ml-5 h-6 w-6 rounded-full bg-white ">
                    {accepted.length}
                  </div>
                </div>
                {showOn &&
                  accepted.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div
                        onClick={() => {
                          changemode(value);
                        }}
                      >
                        <SessionSmallCard data={value} />
                      </div>
                    );
                  })}
                <div
                  className="center-thing relative mt-5 border-b-4 border-green-500 bg-lime-300 bg-opacity-50 py-2 text-center font-semibold text-green-500 shadow-md"
                  onClick={() => {
                    setShowfin((prev) => !prev);
                  }}
                >
                  Finished
                  <p className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl font-semibold">
                    {showFin ? "-" : "+"}
                  </p>
                  <div className="ml-5 h-6 w-6 rounded-full bg-white ">
                    {finished.length}
                  </div>
                </div>
                {showFin &&
                  finished.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div
                        onClick={() => {
                          changemode(value);
                        }}
                      >
                        <SessionSmallCard data={value} />
                      </div>
                    );
                  })}
                <div
                  className="center-thing relative mt-5 border-b-4 border-gray-600 bg-slate-300 bg-opacity-50 py-2 text-center font-semibold text-gray-600 shadow-md"
                  onClick={() => {
                    setShowcan((prev) => !prev);
                  }}
                >
                  Cancelled & Declined
                  <p className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl font-semibold">
                    {showCan ? "-" : "+"}
                  </p>
                  <div className="ml-5 h-6 w-6 rounded-full bg-white ">
                    {cancelled.length}
                  </div>
                </div>
                {showCan &&
                  cancelled.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div
                        onClick={() => {
                          changemode(value);
                        }}
                      >
                        <SessionSmallCard data={value} />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <SessionMediumCard data={passing} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Scheulde;
