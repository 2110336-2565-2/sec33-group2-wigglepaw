import { type NextPage } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Header from "../components/Header";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { text } from "stream/consumers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import SessionsmallCard from "../components/Calendar/Sessionsmallcard";
import Image from "next/image";
import SessionmediumCard from "../components/Calendar/Sessionmediumcard";

const About: NextPage = () => {
  type Insid = { title: string; start: string; end: string };

  const [events, setEvents] = useState([
    {
      title: "Username1",
      start: "2023-03-03T16:04",
      end: "2023-03-05T16:04",
      color: "#f87171",
    },
    {
      title: "Username2",
      start: "2023-02-03T16:04",
      end: "2023-02-05T16:04",
      color: "#a3e635",
    },
    {
      title: "Username3",
      start: "2023-02-19T16:04",
      end: "2023-03-05T16:04",
      color: "#fde047",
    },
  ]);
  const [upcoming, setUpcoming] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [finished, setFinished] = useState([]);
  const [showUp, setShowup] = useState(false);
  const [showOn, setShowon] = useState(false);
  const [showFin, setShowfin] = useState(false);

  const [mode, setMode] = useState(false);

  useEffect(() => {
    filter();
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

  const submitEvent = (e: { target: any; preventDefault: () => void }) => {
    e.preventDefault();
    console.log(events);
    let randcol = "";
    //console.log(new Date());
    //console.log("vs  ", new Date(e.target.start.value));
    if (new Date() > new Date(e.target.end.value)) {
      randcol = "#a3e635";
    } else if (new Date() < new Date(e.target.start.value)) {
      randcol = "#f87171";
    } else {
      randcol = "#fde047";
    }

    const data = {
      title: e.target.title.value,
      start: e.target.start.value,
      end: e.target.end.value,
      color: randcol,
    };

    setEvents([...events, data]);

    filtertemp(data);
  };

  //filter type of events, this would be very effective with use Quary,
  const filter = () => {
    events.forEach((value) => {
      const datetimeString = value.start;
      const datetimeString2 = value.end;
      const datetime = new Date(datetimeString);
      const datetime2 = new Date(datetimeString2);

      const options = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };

      const timestart = datetime.toLocaleDateString("en-US", options);
      const timeend = datetime2.toLocaleDateString("en-US", options);
      const data = {
        timestart: timestart,
        timeend: timeend,
        title: value.title,
      };

      if (
        //ongoing
        new Date(value.start) < new Date() &&
        new Date(value.end) > new Date()
      ) {
        setOngoing([...ongoing, data]);
      } else if (new Date(value.end) < new Date()) {
        //already finished
        setFinished([...finished, data]);
      } else {
        //upcoming
        setUpcoming([...upcoming, data]);
      }
    });
  };

  const changemode = () => {
    setMode(true);
  };

  //temp function use with form for test only, must remove this for the real version
  const filtertemp = (value) => {
    const datetimeString = value.start;
    const datetimeString2 = value.end;
    const datetime = new Date(datetimeString);
    const datetime2 = new Date(datetimeString2);

    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const timestart = datetime.toLocaleDateString("en-US", options);
    const timeend = datetime2.toLocaleDateString("en-US", options);
    const data = {
      timestart: timestart,
      timeend: timeend,
      title: value.title,
    };

    if (
      //ongoing
      new Date(value.start) < new Date() &&
      new Date(value.end) > new Date()
    ) {
      setOngoing([...ongoing, data]);
    } else if (new Date(value.end) < new Date()) {
      //already finished
      setFinished([...finished, data]);
    } else {
      //upcoming
      setUpcoming([...upcoming, data]);
    }
  };

  return (
    <>
      <Header />

      <div className="relative w-screen items-center justify-start  md:flex md:h-screen">
        <Image src="/calendarbg.png" alt="bg" fill />
        <div className="mx-4 h-full w-full md:ml-20 md:mr-10 md:flex">
          <div className="z-10 h-[80%] w-full overflow-scroll bg-white">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              contentHeight={600}
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
          <div className="z-10 overflow-scroll border-2 border-[#E7E7E7] bg-white md:ml-5 md:h-[90%] md:w-[50%]">
            {mode === false ? (
              <div className="center-thing mb-5 bg-[#7B7B7B] py-2 text-2xl text-white">
                {" "}
                My Sessions
              </div>
            ) : (
              <div className="center-thing relative mb-5 bg-[#7B7B7B] py-2 text-2xl text-white">
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
                <div className="center-thing relative mb-1 border-b-4 border-red-600 bg-red-300 bg-opacity-50 px-10 py-2 text-center shadow-md ">
                  Upcoming
                  {!showUp && (
                    <button
                      onClick={() => {
                        setShowup((prev) => !prev);
                        console.log(showUp);
                      }}
                      className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl  "
                    >
                      +
                    </button>
                  )}
                  {showUp && (
                    <button
                      onClick={() => {
                        setShowup((prev) => !prev);
                        console.log(showUp);
                      }}
                      className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl  "
                    >
                      -
                    </button>
                  )}
                </div>
                {showUp &&
                  upcoming.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div onClick={changemode}>
                        <SessionsmallCard data={value} />
                      </div>
                    );
                  })}
                <div className="center-thing relative mt-5 border-b-4 border-yellow-400 bg-yellow-200 bg-opacity-50 py-2 text-center shadow-md ">
                  Ongoing
                  {!showOn && (
                    <button
                      onClick={() => {
                        setShowon((prev) => !prev);
                      }}
                      className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl  "
                    >
                      +
                    </button>
                  )}
                  {showOn && (
                    <button
                      onClick={() => {
                        setShowon((prev) => !prev);
                      }}
                      className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl  "
                    >
                      -
                    </button>
                  )}
                </div>
                {showOn &&
                  ongoing.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div onClick={changemode}>
                        <SessionsmallCard data={value} />
                      </div>
                    );
                  })}
                <div className="center-thing relative mt-5 border-b-4 border-lime-400 bg-lime-300 bg-opacity-50 py-2 text-center shadow-md ">
                  Finished
                  {!showFin && (
                    <button
                      onClick={() => {
                        setShowfin((prev) => !prev);
                      }}
                      className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl  "
                    >
                      +
                    </button>
                  )}
                  {showFin && (
                    <button
                      onClick={() => {
                        setShowfin((prev) => !prev);
                      }}
                      className="center-thing absolute right-[10%] h-5 w-5 rounded-full text-xl  "
                    >
                      -
                    </button>
                  )}
                </div>
                {showFin &&
                  finished.map((value) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <div onClick={changemode}>
                        <SessionsmallCard data={value} />
                      </div>
                    );
                  })}
              </div>
            ) : (
              <SessionmediumCard />
            )}
          </div>
        </div>
      </div>
      <div className="center-thing md:mb-40">
        <form onSubmit={submitEvent}>
          <label>Add Event Title</label>
          <input type="text" id="title" className="mx-2 bg-gray-100"></input>
          <label>Start Date</label>
          <input
            type="datetime-local"
            id="start"
            className="mx-2 bg-gray-100"
          ></input>
          <label>End Date</label>
          <input
            type="datetime-local"
            id="end"
            className="mx-2 bg-gray-100"
          ></input>
          <button className="ml-2 rounded-xl bg-sky-200 px-3 py-2">
            Submit
          </button>
        </form>
      </div>

      {/* <div className="absolute z-[-20] h-[200%] w-[100%] bg-[#EAE7DC] ">
        <section className="h-full">
          <Header />
          <div className="h-full">
            <div className="center-thing">
              <h1 className="text-bold mt-3 text-4xl">With Us, Worry Not</h1>
            </div>
            <div className="center-thing mt-8">
              <p className="text-2xl"> Find you best pet-sitter</p>
            </div>
            <div className="center-thing mt-10">
              <div className="h-[25rem] w-[70%]  ">
                <img
                  src="/about1.png"
                  className="rounded-3xl border-2 border-bg-box-main object-cover "
                ></img>
              </div>
            </div>

            <div className=" relative top-[-1%] z-[-10] h-[60%] w-[30%] border-r-4 border-black  "></div>
            <div className="center-thing absolute top-[60%] left-[26.1%] h-16 w-24 bg-[#EAE7DC]">
              <div className=" h-7 w-7 rounded-full bg-black"></div>
            </div>
            <div className=" absolute top-[57%] left-[5%] h-[10%] w-[20%] rounded-3xl border-2 border-bg-box-main bg-white bg-opacity-50 text-center ">
              <h1 className="mt-8 text-2xl">Explore Their Profile</h1>
              <div className="center-thing h-[50%] ">
                <p>Find who is right for your pets!</p>
              </div>
            </div>
            <div className="absolute top-[52%] left-[35%] h-[20%] w-[50%] rounded-3xl  ">
              <img
                src="/about2.png"
                className="rounded-3xl border-2 border-bg-box-main object-cover "
              ></img>
            </div>
            <div className="center-thing absolute top-[87%] left-[26.1%] h-16 w-24 bg-[#EAE7DC]">
              <div className=" h-7 w-7 rounded-full bg-black"></div>
            </div>
            <div className=" absolute top-[84%] left-[5%] h-[10%] w-[20%] rounded-3xl border-2 border-bg-box-main bg-white bg-opacity-50 text-center ">
              <h1 className="mt-8 text-2xl">Book Them!</h1>
              <div className="center-thing h-[50%] ">
                <p>Ready to ...</p>
              </div>
            </div>
            <div className="absolute top-[80%] left-[35%] h-[20%] w-[50%] rounded-3xl ">
              <img
                src="/about2.png"
                className="rounded-3xl border-2 border-bg-box-main object-cover "
              ></img>
            </div>
          </div>
        </section>
      </div>
      <div className="absolute top-[200%] z-[-20] h-[200%] w-[100%] bg-[#EAE7DC]">
        <div className=" relative z-[-10] h-[10%] w-[30%] border-r-4 border-black  "></div>
        <hr className="relative left-[29.7%] h-[4px] w-[20.1%]  border-t-0  bg-gradient-to-r from-black via-violet-800 to-purple-500"></hr>
        <div className=" relative  h-[4%] w-[49.8%] bg-gradient-to-b from-purple-700 to-red-700  ">
          <div className=" h-full w-[99.4%] bg-[#EAE7DC]"></div>
        </div>
        <div className=" relative left-[48.7%] top-[0.8%] z-[-10] h-6 w-6 rotate-45 bg-gradient-to-br from-red-700 to-pink-400">
          <div className=" absolute top-[15%] left-[15%] h-[70%] w-[70%]  bg-[#EAE7DC]"></div>
        </div>
        <div className="center-thing pt-10">
          <h1
            ref={myRef2}
            className={
              "bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text py-4 text-5xl text-transparent opacity-0 " +
              (myVis2 ? "animate-showing" : "")
            }
          >
            {" "}
            Make Everything Easier With Scheulde
          </h1>
        </div>
        <div className="mt- relative left-[15%] mt-6 h-[30%] w-[70%] ">
          <img
            src="/about3.png"
            className="opacity=0 h-[100%] w-full rounded-3xl border-2 border-bg-box-main object-cover "
          ></img>
        </div>

        <div className="relative mt-6  h-[8%] w-[49.8%] bg-gradient-to-b from-pink-400 to-sky-500  ">
          <div className="h-full w-[99.4%] bg-[#EAE7DC]"></div>
        </div>
        <div className="relative left-[48.7%] top-[0.8%] z-[-10]  h-6 w-6 rotate-45 bg-gradient-to-br from-sky-500 to-blue-700">
          <div className=" absolute top-[15%] left-[15%] h-[70%] w-[70%]  bg-[#EAE7DC]"></div>
        </div>
        <div className="center-thing pt-10">
          <h1
            ref={myRef}
            className={
              "bg-gradient-to-r from-blue-500 to-indigo-800 bg-clip-text py-4 text-5xl text-transparent opacity-0 " +
              (myVis ? "animate-showing" : "")
            }
          >
            {" "}
            Clear All Confusion With Chat
          </h1>
        </div>
        <div className="mt- relative left-[15%] mt-6 h-[30%] w-[70%] ">
          <img
            src="/about4.png"
            className="h-[100%] w-full rounded-3xl border-2 border-bg-box-main object-cover "
          ></img>
        </div>
        <div
          ref={myRef}
          className={
            "relative flex items-center justify-center text-[5rem] "
            //+(myVis ? "animate-[wiggle_3s_ease-in-out_]" : "")
          }
        ></div>
      </div>
      <div className="absolute top-[400%] z-[-30] h-[200%] w-[100%] bg-[#EAE7DC]"></div> */}
    </>
  );
};
export default About;
