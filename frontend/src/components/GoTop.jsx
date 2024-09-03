import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const GoTop = () => {
  const [shown, setShown] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) setShown(true);
      else setShown(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={
        `${shown ? "" : "hidden"} ` +
        "fixed border-2 text-xl border-white z-50 bottom-6 right-6 w-16 h-16 gradient text-white" +
        " flex justify-center items-center rounded-full cursor-pointer transition-all duration-300" +
        " hover:bg-gray-300 hover:border-gray-300 hover:text-gray-300"
      }
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </div>
  );
};

export default GoTop;
