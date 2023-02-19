import type { NextPage } from "next";

const DemoSearchBoxComponent: NextPage = () => {
  return (
    <main className="">
      <div className="mx-auto h-screen w-[851px] border max-md:w-[330px]">
        <div id="search-box" className="flex flex-col border">
          <div id="header-search" className="border ">
            <p className="">Search for Pet Sitters</p>
          </div>
          <div id="search-params-wrapper" className="flex flex-col border">
            <div id="name-input-wrapper" className="flex flex-col border">
              <p className="">Name</p>
              <input className="border "></input>
            </div>
            <div id="pet-types-input-wrapper" className="flex flex-col border">
              <p className="">Pet Types</p>
              <div id="pet-types-selector" className="grid grid-cols-2 border">
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Dog</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Bird</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Cat</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Snake</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Hamster</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Iguana</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Fish</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Ferret</p>
                </div>
                <div className="flex flex-row border">
                  <input type="checkbox"></input>
                  <p className="">Mouse</p>
                </div>
              </div>
            </div>
            <div
              id="price-range-input-wrapper"
              className="flex flex-col border"
            >
              <p className="">Price Range</p>
              <div id="two-thumbs" className="border ">
                twoThumbs component & min max
              </div>
            </div>
          </div>

          <div id="search-button-wrapper" className="border ">
            <button className="border ">Search</button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DemoSearchBoxComponent;
