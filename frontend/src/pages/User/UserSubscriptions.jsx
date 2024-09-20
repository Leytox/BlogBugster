import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../../features/location/locationSlice.js";
import { useParams } from "react-router-dom";
import { useGetUserSubscriptionsQuery } from "../../features/users/usersApiSlice.js";
import Loader from "../../components/Loader.jsx";
import UserCard from "../../components/UserCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken } from "@fortawesome/free-solid-svg-icons";

const UserSubscriptions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetUserSubscriptionsQuery(id);

  useEffect(() => {
    dispatch(setLocation("Profile > Subscriptions"));
  }, [dispatch]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <section
      className={
        "max-sm:px-2 gap-16 flex flex-row flex-wrap max-md:items-center max-md:justify-center max-sm:flex-col"
      }
    >
      {data?.subscriptions.length === 0 && (
        <h1 className="text-5xl text-center m-auto italic text-gray-400 ">
          <FontAwesomeIcon icon={faHeartBroken} /> User has no subscriptions
          yet...
        </h1>
      )}
      {data?.subscriptions.map((user) => (
        <UserCard
          key={user._id}
          avatar={user.avatar}
          name={user.name}
          id={user._id}
        />
      ))}
    </section>
  );
};

export default UserSubscriptions;
