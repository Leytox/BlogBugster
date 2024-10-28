import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchContainerMobile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length <= 2) return;
    navigate(
      `/posts?page=1&category=all&sortOrder=new&searchTerm=${searchTerm.trim()}`,
    );
    setIsExpanded(false);
  };

  return (
    <div className={"hidden max-md:block"}>
      {isExpanded ? (
        <form
          className={
            "top-0 fixed left-0 h-screen w-screen flex flex-row-reverse justify-center items-center gap-6 bg-black bg-opacity-50 backdrop-blur-md"
          }
          onSubmit={handleSubmit}
        >
          <div className={"flex items-center"}>
            <input
              type="text"
              placeholder="Search for anything..."
              className={`rounded-md p-4 text-black outline-0 outline w-72`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxLength={18}
            />
            {searchTerm.length >= 3 && (
              <div className={"text-xl flex items-center"}>
                <FontAwesomeIcon
                  className={"right-20 absolute text-black"}
                  icon={faSearch}
                />
                <FontAwesomeIcon
                  icon={faX}
                  className={"text-xl right-12 absolute text-black"}
                  onClick={() => {
                    setSearchTerm("");
                  }}
                />
              </div>
            )}
          </div>
          <FontAwesomeIcon
            className={"text-2xl"}
            icon={faArrowLeft}
            onClick={() => setIsExpanded(false)}
          />
        </form>
      ) : (
        <FontAwesomeIcon
          icon={faSearch}
          className="text-xl"
          onClick={() => setIsExpanded(true)}
        />
      )}
    </div>
  );
};

export default SearchContainerMobile;
