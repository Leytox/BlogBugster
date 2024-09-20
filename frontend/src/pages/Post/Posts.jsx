import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLocation } from "../../features/location/locationSlice.js";
import { useGetPostsQuery } from "../../features/posts/postsApiSlice.js";
import Loader from "../../components/Loader.jsx";
import PostCard from "../../components/PostCard.jsx";
import { useSearchParams } from "react-router-dom";
import {
  faArrowLeft,
  faArrowRight,
  faCode,
  faEllipsis,
  faFire,
  faMicrochip,
  faScaleBalanced,
  faScroll,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Posts = () => {
  const limit = 10;
  const [category, setCategory] = useState("software");
  const [sortOrder, setSortOrder] = useState("new");
  const [searchParams, setSearchParams] = useSearchParams();
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
  }, [category, refetch]);

  useEffect(() => {
    if (data) {
      const totalPages = Math.ceil(data.total / limit);
      if (page < 1 || page > totalPages) setPage(1);
      else setSearchParams({ page });
    }
  }, [page, setSearchParams, data, limit]);

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
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
        <div className={"flex gap-8 flex-wrap max-lg:justify-center"}>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200`}
            onClick={() => setCategory("new")}
          >
            <FontAwesomeIcon icon={faSeedling} /> New
          </div>
          <div
            className={
              "rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200"
            }
            onClick={() => setCategory("popular")}
          >
            <FontAwesomeIcon icon={faFire} /> Popular
          </div>
          <div
            className={
              "rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200"
            }
            onClick={() => setCategory("relevance")}
          >
            <FontAwesomeIcon icon={faScaleBalanced} /> Relevance
          </div>
          <div
            className={
              "rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200"
            }
            onClick={() => setCategory("oldest")}
          >
            <FontAwesomeIcon icon={faScroll} /> Oldest
          </div>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200`}
            onClick={() => setCategory("software")}
          >
            <FontAwesomeIcon icon={faCode} /> Software
          </div>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200`}
            onClick={() => setCategory("hardware")}
          >
            <FontAwesomeIcon icon={faMicrochip} /> Hardware
          </div>
          <div
            className={`rounded py-2 bg-gray-300 px-4 border-[1px] cursor-pointer transition-all duration-200 hover:bg-gray-200`}
            onClick={() => setCategory("misc")}
          >
            <FontAwesomeIcon icon={faEllipsis} /> Misc
          </div>
        </div>
        <div className={"flex gap-4 flex-wrap justify-center xl:justify-start"}>
          {data?.posts.map((post) => (
            <PostCard post={post} key={post._id} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div className={"flex gap-8 items-center"}>
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="btn"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <span>
            {page} of {Math.ceil(data.total / limit)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={data.total < page * limit}
            className="btn"
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Posts;
