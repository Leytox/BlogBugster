import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLocation } from "../../features/location/locationSlice.js";
import { useGetPostsQuery } from "../../features/posts/postsApiSlice.js";
import Loader from "../../components/Loader.jsx";
import PostCard from "../../components/PostCard.jsx";
import { useSearchParams } from "react-router-dom";
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowDownShortWide,
  faArrowUpShortWide,
  faChevronLeft,
  faChevronRight,
  faCode,
  faEllipsis,
  faHeartCrack,
  faMicrochip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Posts = () => {
  const limit = 15;
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(
    searchParams.get("category") || "software",
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "new",
  );
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetPostsQuery({
    page,
    limit,
    category,
    sortOrder,
  });

  useEffect(() => {
    dispatch(setLocation("Posts"));
  }, [dispatch]);

  useEffect(() => {
    refetch();
  }, [category, sortOrder, refetch, page]);

  useEffect(() => {
    if (data) {
      const totalPages = Math.ceil(data.total / limit);
      if (page < 1 || page > totalPages) setPage(1);
      else setSearchParams({ page: page.toString(), category, sortOrder });
    }
  }, [page, setSearchParams, data, limit, category, sortOrder]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={
        "min-h-screen max-md:gap-12 p-4 flex flex-col justify-between px-28 max-md:px-0 max-lg:px-16 max-xl:px-24"
      }
    >
      <div
        className={
          "flex flex-col justify-start gap-4 max-sm:px-2 max-sm:justify-center max-sm:items-center"
        }
      >
        <div
          className={"flex gap-8 flex-wrap max-lg:justify-center items-center"}
        >
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200 ${category === "all" ? "border-black bg-white" : ""}`}
            onClick={() => setCategory("all")}
          >
            {" "}
            All
          </div>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200 ${category === "software" ? "border-black bg-white" : ""}`}
            onClick={() => setCategory("software")}
          >
            <FontAwesomeIcon icon={faCode} /> Software
          </div>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200 ${category === "hardware" ? "border-black bg-white" : ""}`}
            onClick={() => setCategory("hardware")}
          >
            <FontAwesomeIcon icon={faMicrochip} /> Hardware
          </div>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200 ${category === "miscellaneous" ? "border-black bg-white" : ""}`}
            onClick={() => setCategory("miscellaneous")}
          >
            <FontAwesomeIcon icon={faEllipsis} /> Misc
          </div>
          {data.total > 1 && (
            <div
              className={`cursor-pointer`}
              onClick={() =>
                sortOrder === "new" ? setSortOrder("old") : setSortOrder("new")
              }
            >
              <FontAwesomeIcon
                icon={
                  sortOrder === "new"
                    ? faArrowUpShortWide
                    : faArrowDownShortWide
                }
              />{" "}
              Sort
            </div>
          )}
        </div>
        <div className={"flex gap-4 flex-wrap justify-center xl:justify-start"}>
          {data?.posts.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
          {data?.posts.length === 0 && (
            <div
              className={"h-screen w-screen flex items-center justify-center"}
            >
              <h1 className="text-5xl text-center m-auto italic text-gray-400">
                <FontAwesomeIcon icon={faHeartCrack} /> No {category} posts
                yet...
              </h1>
            </div>
          )}
        </div>
      </div>
      {Math.ceil(data.total / limit) > 1 && (
        <div className="flex justify-center">
          <div className={"flex gap-4 items-center max-md:gap-2"}>
            <button
              onClick={() => {
                setPage(1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="btn w-24 max-md:w-16"
              disabled={page === 1}
            >
              <FontAwesomeIcon icon={faAnglesLeft} />{" "}
              <span className="hidden md:inline">First</span>
            </button>
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="btn w-24 max-md:w-16"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>
              {page} of {Math.ceil(data.total / limit)}
            </span>
            <button
              onClick={handleNextPage}
              disabled={data.total <= page * limit}
              className="btn w-24 max-md:w-16"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <button
              onClick={() => {
                setPage(Math.ceil(data.total / limit));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={data.total <= page * limit}
              className="btn w-24 max-md:w-16"
            >
              <FontAwesomeIcon icon={faAnglesRight} />{" "}
              <span className="hidden md:inline">Last</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
