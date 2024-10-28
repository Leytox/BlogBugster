import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { useGetUsersQuery } from "../../features/users/usersApiSlice.js";
import { Link } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce.js";
import Loader from "../../components/Loader.jsx";
import PropTypes from "prop-types";

const SearchUsers = ({ searchValue, setSearchValue }) => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className={"w-full flex items-center relative"}>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          className="w-full h-12 px-4 text-lg text-gray-800 border border-gray-300 rounded-md outline outline-0"
          placeholder="Search users..."
          maxLength={48}
        />
        {searchValue.length > 3 && (
          <div className={"flex items-center"}>
            <FontAwesomeIcon
              icon={faX}
              className={
                "text-xl absolute right-8 cursor-pointer duration-200 hover:text-red-500"
              }
              onClick={() => setSearchValue("")}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className={
                "text-xl absolute right-20 cursor-pointer duration-200 hover:text-blue-500"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

SearchUsers.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
};

const UserCardNew = ({ user }) => {
  return (
    <Link
      to={`/user/${user._id}`}
      className={
        "flex flex-col gap-4 items-center transition-transform duration-200 hover:scale-105"
      }
    >
      <img
        src={import.meta.env.VITE_BACKEND_URI + "/" + user.avatar}
        alt={`${user.name}'s avatar`}
        className={"rounded-full w-40 h-40 border-black border-[1px]"}
      />
      <h1>
        {user.name.substring(0, 16) + (user.name.length > 16 ? "..." : "")}
      </h1>
    </Link>
  );
};

UserCardNew.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

const UsersList = ({ users }) => {
  return users.length === 0 ? (
    <h1>No users found</h1>
  ) : (
    <div className="flex flex-wrap gap-12 justify-center items-center w-full p-4 mb-4 bg-white rounded-md shadow-md">
      {users.map((user) => (
        <UserCardNew key={user._id} user={user} />
      ))}
    </div>
  );
};

UsersList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const AdminUsers = () => {
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const { data, isError, isLoading, isFetching, refetch } = useGetUsersQuery({
    page,
    limit,
    search: debouncedSearchValue,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchValue]);

  useEffect(() => {
    refetch();
  }, [debouncedSearchValue, page, refetch]);

  if (isError) return <div>Error loading users</div>;

  const filteredUsers = data?.users || [];

  const handleNextPage = () => {
    if (data?.total / limit > page) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  console.log(data);

  return (
    <div className={"h-[calc(100vh-24rem)] flex justify-center items-center"}>
      <div className="w-full max-w-4xl">
        <SearchUsers
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        {isFetching || isLoading ? (
          <div className={"w-full flex items-center justify-center"}>
            <Loader />
          </div>
        ) : (
          <>
            <UsersList users={filteredUsers} />
            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faChevronLeft} /> Previous
              </button>
              <span>
                {Math.ceil(data?.total / limit) === 0
                  ? ""
                  : `${page} / ${Math.ceil(data?.total / limit)}`}
              </span>
              <button
                onClick={handleNextPage}
                disabled={data?.total / limit <= page}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
