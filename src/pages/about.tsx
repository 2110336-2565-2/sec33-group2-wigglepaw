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
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const About: NextPage = () => {
  type Insid = { title: string; start: string; end: string };

  const [events, setEvents] = useState([]);
  const { ref: myRef, inView: myVis } = useInView({});
  const { ref: myRef2, inView: myVis2 } = useInView({});
  const { ref: myRef3, inView: myVis3 } = useInView({});

  const randcolor = [
    "#fde047",
    "#bef264",
    "#4ade80",
    "#67e8f9",
    "#38bdf8",
    "#a78bfa",
    "#e879f9",
    "#4c1d95",
    "#f472b6",
  ];
  const submitEvent = (e: { target: any; preventDefault: () => void }) => {
    e.preventDefault();
    console.log(events);
    const randcol = randcolor[Math.floor(Math.random() * randcolor.length)];
    setEvents([
      ...events,
      {
        title: e.target.title.value,
        start: e.target.start.value,
        end: e.target.end.value,
        color: randcol,
      },
    ]);
  };
  return (
    <>
      <Header />
      <div className="flex h-screen w-screen  items-center justify-start">
        <div className="mx-24 flex h-full w-full">
          <div className=" h-[80%] w-full overflow-scroll">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              contentHeight={600}
              stickyFooterScrollbar={true}
              headerToolbar={
                {
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
            />
          </div>
          <div className="ml-10 h-[90%] w-[70%] border-l-2 border-black">
            <div className="my-10 ml-4">
              {events.map((value, index) => {
                const bordercolor = " border-[" + value.color + "]";
                console.log(bordercolor);

                const style =
                  "mb-5  border-l-4 px-5 py-2 shadow-md hover:border-4  " +
                  bordercolor;

                const datetimeString = value.start;
                const datetimeString2 = value.end;
                const datetime = new Date(datetimeString);
                const datetime2 = new Date(datetimeString2);

                const options = {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                };

                options.hour = "numeric";
                options.minute = "numeric";
                options.hour12 = true;
                const timestart = datetime.toLocaleTimeString("en-US", options);
                const timeend = datetime2.toLocaleTimeString("en-US", options);

                return (
                  <div className={style}>
                    <div className="flex">
                      <div className="text-sm text-gray-500">
                        {timestart} &nbsp;-{" "}
                      </div>
                      <div className="text-sm text-gray-500">
                        {" "}
                        &nbsp; {timeend}
                      </div>
                    </div>
                    <div className="mt-1 flex">
                      <span className="mr-5">{value.title} </span>
                      <div
                        onClick={() => {
                          setEvents((current) =>
                            current.filter((events, i) => i !== index)
                          );
                        }}
                        className="hover:scale-[1.2]"
                      >
                        <FontAwesomeIcon size="sm" icon={faTrashCan} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="center-thing mb-40">
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
