import { useRouter } from "next/router";

const SearchBox = () => {
  var router = useRouter();
  var petSitterType = router.query["petSitterType"];

  //TODO: Search Pet Sitter
  // Handles the submit event on form submit.
  const handleSearch = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      petType: event.target.petType.value,
      location: event.target.location.value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "/api/form";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    alert(`Data: ${result.data}`);
  };

  return (
    <div className="mx-auto w-3/5 min-w-fit bg-red-300">
      <h1>Search for {petSitterType}</h1>
      <div>
        <form onSubmit={handleSearch}>
          <label htmlFor="location">Location</label>
          <br />
          <input type="text" id="location" />
          <br />
          <label htmlFor="petType">Pet Type</label>
          <br />
          <input type="text" id="petType" list="petName" />
          <datalist id="petName">
            <option value="Cat">Cat</option>
            <option value="Dog">Dog</option>
            <option value="Bird">Bird</option>
          </datalist>
          <br />

          <input
            type="submit"
            value="Submit"
            className="rounded-full bg-sky-700 px-4 py-2 font-bold text-white hover:bg-sky-600"
          ></input>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;
