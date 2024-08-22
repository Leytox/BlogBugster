import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const GoTop = () => {
  const [shown, setShown] = useState(false);
  const { pathname } = useLocation();

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      onClick={goTop}
      className={
        `${shown ? "" : "hidden"} ` +
        "fixed border-2 text-xl border-white z-50 bottom-6 right-6 w-16 h-16 gradient text-white" +
        " flex justify-center items-center rounded-full cursor-pointer transition-all duration-300" +
        " hover:bg-gray-300 hover:text-black"
      }
    >
      👆
    </div>
  );
};

export default GoTop;
