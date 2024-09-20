import PostCard from "../../components/PostCard.jsx";
import { useGetUserPostsQuery } from "../../features/posts/postsApiSlice.js";
import Loader from "../../components/Loader.jsx";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faHeartCrack,
  faScroll,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { setLocation } from "../../features/location/locationSlice.js";
import { useDispatch } from "react-redux";

const UserPosts = ({ userid }) => {
  const [sortOrder, setSortOrder] = useState("New");
  const { data, isLoading } = useGetUserPostsQuery(userid);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Profile > Posts"));
  }, [dispatch]);

  const sortedPosts = useMemo(() => {
    if (!data || !data.posts) return [];
    return [...data.posts].sort((a, b) => {
      switch (sortOrder) {
        case "New":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Old":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "Popular":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });
  }, [data, sortOrder]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  return (
    <section className="max-sm:p-4 gap-4 flex flex-col max-md:items-center">
      {data.posts.length === 0 ? (
        <h1 className="text-5xl text-center m-auto italic text-gray-400 ">
          <FontAwesomeIcon icon={faHeartCrack} /> No posts yet...
        </h1>
      ) : (
        <>
          {data.posts.length > 1 && (
            <div className={"flex gap-4"}>
              <button
                className={`${sortOrder === "New" ? "btn" : "btn-transparent"}`}
                onClick={() => setSortOrder("New")}
              >
                <FontAwesomeIcon icon={faSeedling} /> New
              </button>
              <button
                className={`${sortOrder === "Popular" ? "btn" : "btn-transparent"}`}
                onClick={() => setSortOrder("Popular")}
              >
                <FontAwesomeIcon icon={faFire} /> Popular
              </button>
              <button
                className={`${sortOrder === "Old" ? "btn" : "btn-transparent"}`}
                onClick={() => setSortOrder("Old")}
              >
                <FontAwesomeIcon icon={faScroll} /> Old
              </button>
            </div>
          )}
          <div className="flex flex-wrap justify-start gap-4 max-md:items-center max-md:justify-center">
            {sortedPosts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

UserPosts.propTypes = {
  userid: PropTypes.string,
};

export default UserPosts;
