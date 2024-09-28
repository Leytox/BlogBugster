import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const OverlayWindow = ({ children, setIsOverlayWindowShown }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOverlayWindowShown(false), 300);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-25 flex justify-center items-center backdrop-blur-md transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (
          e.target.id === "overlay-window" ||
          e.target.closest("#overlay-window")
        )
          return;
        handleClose();
      }}
    >
      <div
        className={`w-[500px] h-96 bg-white rounded-xl flex flex-col justify-between p-8 pb-16 transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        id="overlay-window"
      >
        <FontAwesomeIcon
          icon={faX}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:scale-125 cursor-pointer"
          onClick={handleClose}
        />
        {children}
      </div>
    </div>
  );
};

OverlayWindow.propTypes = {
  children: PropTypes.node.isRequired,
  setIsOverlayWindowShown: PropTypes.func.isRequired,
};

export default OverlayWindow;
