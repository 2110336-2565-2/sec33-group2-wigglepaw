import { useEffect, useState } from "react";

export default function RegisterPetSitter() {
  const [editmode, setEditmode] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
    address: "",
    bankAccount: "",
    bankName: "",
    type: "",
    firstname: "", //if Freelancer
    lastname: "",
    businessLicense: "", //If PetHotel
    hotelName: "",
  });
  const [type, setType] = useState("");
  var test = 1;
  const [state, setState] = useState(0); //0=main info 1=freelance 2=hotelpet

  const sendProfileinfo = async (e: {
    target: any;
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    const studentinfo = {
      firstname: e.target.fname.value,
      lastname: e.target.lname.value,
      age: e.target.age.value,
      tel: e.target.phone.value,
      psub: e.target.psub.value,
      des: e.target.descrip.value,
      link: e.target.link.value,
    };
  };

  const FirstPage = () => {
    if (state === 1) {
      return (
        <>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <form className="w-4/5">
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Firstname
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Lastname
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="mx-3 flex flex-wrap content-end items-center justify-evenly">
                <button
                  type="button"
                  onClick={(e: { target: any }) => {
                    setState(0);
                  }}
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Back</p>
                </button>
                <button
                  type="button"
                  onClick={(e: { target: any }) => {
                    setState(3);
                  }}
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next</p>
                </button>
              </div>
            </div>
          </form>
        </>
      );
    } else if (state === 2) {
      return (
        <>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <form className="w-4/5">
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Hotel
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Lastname
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="mx-3 flex flex-wrap content-end items-center justify-evenly">
                <button
                  type="button"
                  onClick={(e: { target: any }) => {
                    setState(0);
                  }}
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Back</p>
                </button>
                <button
                  type="button"
                  onClick={(e: { target: any }) => {
                    setState(3);
                  }}
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next</p>
                </button>
              </div>
            </div>
          </form>
        </>
      );
    } else {
      return (
        <>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <form className="w-4/5">
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="mx-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="mx-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="mx-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Telephone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="mx-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Address
                </label>
                <input
                  type="text"
                  id="psub"
                  name="psub"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              {/* <div className=" mx-3 flex justify-between py-2 pb-6">
                <div className="flex flex-wrap content-center items-center">
                  <label className="mb-2 block text-sm font-medium text-gray-900 ">
                    Choose your role here
                  </label>
                  <select
                    id="choice"
                    name="choice"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                  >
                    <option value="petfreelance">Freelance Pet Sitter</option>
                    <option value="pethotel">Pet Hotel</option>
                  </select>
                </div>
              </div> */}

              <div className="mx-3 flex flex-wrap content-center items-center justify-evenly">
                <button
                  type="button"
                  onClick={() => {
                    setState(1);
                  }}
                  className=" rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next As Hotel Pet</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setState(2);
                  }}
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next As Freelance Pet</p>
                </button>
              </div>
            </div>
          </form>
        </>
      );
    }
  };

  return (
    <>
      <div className="content-star flex h-screen flex-col items-center  px-20 pt-20">
        <FirstPage />
      </div>
    </>
  );
}
