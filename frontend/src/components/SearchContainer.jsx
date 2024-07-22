import { useState } from "react";

const SearchContainer = () => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchFocused = () => {
    setIsFocused(true);
  };

  const handleSearchBlurred = () => {
    setIsFocused(false);
  };
  return (
    <form
      className={`flex-grow max-md:hidden ${isFocused ? " absolute w-full h-screen z-50 py-7 px-60 top-0 left-0 bg-black bg-opacity-50" : ""}`}
    >
      <input
        type="text"
        placeholder={`${isFocused ? "Search for the anything" : "Click to search"} `}
        className={`${isFocused ? "border-4 border-blue-600 outline-0 outline text-black" : ""} rounded-sm w-full py-1 text-center`}
        onFocus={handleSearchFocused}
        onBlur={handleSearchBlurred}
      />
    </form>
  );
};

export default SearchContainer;
