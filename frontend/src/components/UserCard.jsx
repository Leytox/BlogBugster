import { Link } from "react-router-dom";

const UserCard = (user) => {
  return (
    <Link
      to={`/user/${user.id}`}
      className={
        "flex flex-col gap-4 items-center transition-transform duration-200 hover:scale-105 "
      }
    >
      <img
        src={import.meta.env.VITE_BACKEND_URI + "/" + user.avatar}
        alt={user.name + "'s avatar"}
        className={"rounded-full w-40 h-40 border-black border-[1px]"}
      />
      <h1>{user.name}</h1>
    </Link>
  );
};

export default UserCard;
