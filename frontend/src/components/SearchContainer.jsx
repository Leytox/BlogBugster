import {useState} from "react";

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
      <form className={"max-sm:hidden"} onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Search for anything..."
            className={"rounded-md p-2 text-black outline-0 outline"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
  );
};

export default SearchContainer;