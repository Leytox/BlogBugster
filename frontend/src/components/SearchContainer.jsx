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
    <form className={"max-sm:hidden"}>
      <input
        type="text"
        placeholder={`${isFocused ? "Search for anything..." : "Click to search"} `}
        className={`h-10 rounded-sm w-full py-1 text-center text-black outline-0 outline`}
        onFocus={handleSearchFocused}
        onBlur={handleSearchBlurred}
      />
    </form>
  );
};

export default SearchContainer;
