const SearchContainer = () => {
  return (
      <form className={"max-sm:hidden"}>
        <input
            type="text"
            placeholder="Search for anything..."
            className={`rounded-md p-2 text-black outline-0 outline`}
        />
      </form>
  );
};

export default SearchContainer;
