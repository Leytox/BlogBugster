import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length <= 3) return;
    navigate(
      `/posts?page=1&category=all&sortOrder=new&searchTerm=${searchTerm.trim()}`,
    );
  };

  return (
    <form className={"max-sm:hidden flex relative"} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for anything..."
        className={`rounded-md p-2 text-black outline-0 outline`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        maxLength={25}
      />
      {searchTerm.length >= 3 && (
        <div
          className="absolute right-4 top-2 text-black cursor-pointer duration-200 hover:text-blue-500"
          onClick={handleSubmit}
        >
          <FontAwesomeIcon icon={faSearch} />
        </div>
      )}
      {searchTerm.length >= 3 && (
        <div
          className="absolute right-12 top-2 text-black cursor-pointer duration-200 hover:text-red-500"
          onClick={() => {
            setSearchTerm("");
          }}
        >
          <FontAwesomeIcon icon={faX} />
        </div>
      )}
    </form>
  );
};

export default SearchContainer;
