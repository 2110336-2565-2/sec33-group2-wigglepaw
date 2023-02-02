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
  const [page1, setPage1] = useState({
    username: "",
    password: "",
    phoneNumber: "",
    email: "",
    address: "",
    type: "",
  });
  const [page2hotel, setPage2hotel] = useState({
    hotelName: "",
    businessLicense: "",
  });
  const [page2free, setPage2free] = useState({
    firstname: "",
    lastname: "",
  });
  const [page3, setPage3] = useState({
    bankAccount: "",
    bankName: "",
    cvv: "",
    exp: "",
    cardno: "",
  });

  const [state, setState] = useState(0); //0=main info 1=freelance 2=hotelpet

  const onSubmitpage1 = (e: {
    target: any;
    preventDefault(): unknown;
    e: { preventDefault: any };
    cat: string;
  }) => {
    e.preventDefault();
    setPage1({
      username: e.target.username.value,
      password: e.target.password.value,
      phoneNumber: e.target.phone.value,
      email: e.target.email.value,
      address: e.target.ads.value,
      type: e.target.choice.value,
    });

    //console.log(page1);
    if (e.target.choice.value === "petfreelance") {
      setState(1);
    } else {
      setState(2);
    }
  };

  const onSubmitpage2 = (e: {
    target: any;
    preventDefault(): unknown;
    e: { preventDefault: any };
    cat: string;
  }) => {
    e.preventDefault();
    if (page1.type === "petfreelance") {
      setPage2free({
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
      });
    } else {
      setPage2hotel({
        hotelName: e.target.hotelname.value,
        businessLicense: e.target.blicense.value,
      });
    }
    //console.log(page2free, page2hotel);
    setState(3);
  };
  const onSubmitpage3 = (e: {
    target: any;
    preventDefault(): unknown;
    e: { preventDefault: any };
    cat: string;
  }) => {
    e.preventDefault();

    var data = {
      bankAccount: e.target.bankno.value,
      bankName: e.target.bankname.value,
      cvv: e.target.cvv.value,
      exp: e.target.exp.value,
      cardno: e.target.cardno.value,
    };

    var real = {};
    if (page1.type === "petfreelance") {
      real = Object.assign({}, page1, page2free, data);
    } else {
      real = Object.assign({}, page1, page2hotel, data);
    }
    alert(JSON.stringify(real)); //real data ready to be sent to backends

    setState(3);
  };

  const printData = () => {};

  const FirstPage = () => {
    if (state === 1) {
      return (
        <>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">2/3</h1>
          <form className="w-4/5" onSubmit={onSubmitpage2}>
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Firstname
                </label>
                <input
                  type="text"
                  id="firstname"
                  defaultValue={page2free.firstname}
                  placeholder="ทอมมี่"
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Lastname
                </label>
                <input
                  type="text"
                  id="lastname"
                  defaultValue={page2free.lastname}
                  placeholder="มานาบุญ"
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
                  type="submit"
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
          <h1 className="py-2 text-3xl">2/3</h1>
          <form className="w-4/5" onSubmit={onSubmitpage2}>
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Hotel
                </label>
                <input
                  type="text"
                  id="hotelname"
                  defaultValue={page2hotel.hotelName}
                  placeholder="Muse Hotel At Anatara Resort and Spa and Sport club and Therapy and University "
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Business License
                </label>
                <input
                  type="text"
                  id="blicense"
                  defaultValue={page2hotel.businessLicense}
                  placeholder="WUT DA FUCK IS THIS SLOT DO :<"
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
                  type="submit"
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next</p>
                </button>
              </div>
            </div>
          </form>
        </>
      );
    } else if (state === 3) {
      return (
        <>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">3/3</h1>
          <div className="flex w-2/3 justify-center">
            <form className=" h-full w-full pt-5 " onSubmit={onSubmitpage3}>
              <div className="mx-auto grid w-full grid-cols-2 grid-rows-6 gap-5 md:grid-cols-2 md:gap-2">
                <div className="col-span-4 flex items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <label>By Card</label>
                  <div className="ml-4 h-6 w-8 rounded  bg-blue-300"></div>
                  <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                  <div className="ml-2 h-6 w-8 rounded  bg-blue-300"></div>
                </div>
                <div className="col-span-2 flex w-full  flex-col">
                  <label>Card No*</label>
                  <input
                    id="cardno"
                    placeholder="xxxx xxxx xxxx xxxx"
                    type="number"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2"></div>

                <div className="flex w-full flex-col">
                  <label>Expiration Date*</label>
                  <input
                    id="exp"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    type="date"
                  />
                </div>
                <div className="flex w-full flex-col">
                  <label>CVV / CVN*</label>
                  <input
                    id="cvv"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    type="number"
                  />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-4 flex w-full items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <label>Mobile banking</label>
                  <div className="ml-4 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                  <div className="ml-2 h-7 w-7 rounded-full bg-blue-300"></div>
                </div>
                <div className="flex w-full flex-col">
                  <label>Bank No*</label>
                  <input
                    id="bankno"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                    placeholder="xxx-x-xxxxx-x"
                    type="number"
                  />
                </div>
                <div className=" flex w-full flex-col">
                  <label>Bank Name*</label>
                  <input
                    id="bankname"
                    placeholder="ABC"
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-2 flex items-center">
                  <input className="mr-2" type="checkbox"></input>
                  <div>
                    <label>I agree to the &nbsp;</label>
                    <label className="text-red-600 underline">
                      terms, conditions and privacy policy
                    </label>
                  </div>
                </div>

                <div className="flex gap-6"></div>
              </div>
              <div className="mt-5 flex w-full justify-evenly">
                <button
                  type="button"
                  onClick={() => {
                    setState(0);
                  }}
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  Back
                </button>
                <button className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16">
                  Register
                </button>
              </div>
            </form>
          </div>
        </>
      );
    } else {
      return (
        <>
          <h1 className="py-2 text-3xl">Register Pet Sitter</h1>
          <h1 className="py-2 text-3xl">1/3</h1>
          <form className="w-4/5" onSubmit={onSubmitpage1}>
            <div className="grid  grid-cols-1 grid-rows-6">
              <div className="m-3">
                <label className="mb-2 block text-sm font-medium text-gray-900 ">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="Kimmy"
                  defaultValue={page1.username}
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
                  placeholder="Jommy@gmail.com"
                  defaultValue={page1.email}
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
                  placeholder="0123456789"
                  defaultValue={page1.phoneNumber}
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
                  id="ads"
                  name="ads"
                  placeholder="Wat Gu Yang Soi 2 :)"
                  defaultValue={page1.address}
                  className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                />
              </div>
              <div className=" mx-3 flex justify-between py-2 pb-6">
                <div className="flex flex-wrap content-center items-center">
                  <label className="mb-2 block text-sm font-medium text-gray-900 ">
                    Choose your role here
                  </label>
                  <select
                    id="choice"
                    name="choice"
                    defaultValue={page1.type}
                    className="block w-full rounded border border-gray-100 bg-gray-100 p-1 px-2 text-sm text-gray-900 drop-shadow-md focus:border-blue-500 focus:bg-white focus:ring-blue-500"
                  >
                    <option value="petfreelance">Freelance Pet Sitter</option>
                    <option value="pethotel">Pet Hotel</option>
                  </select>
                </div>
              </div>

              <div className="mx-3 flex flex-wrap content-center items-center justify-evenly">
                <button
                  type="submit"
                  // onClick={() => {
                  //   console.log("??");
                  //   setState(1);
                  // }}
                  className=" rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next</p>
                </button>
                {/* <button
                  type="submit"
                  className="rounded bg-[#98AAB4] px-6  py-2.5 text-center text-sm font-semibold text-[#213951] drop-shadow-md hover:bg-[#8b9ba3] focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto md:px-16"
                >
                  <p>Next As Freelance Pet</p>
                </button> */}
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
