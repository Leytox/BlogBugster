import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OverlayWindow = ({ children, setIsOverlayWindowShown }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-25 flex justify-center items-center backdrop-blur-md"
      onClick={(e) => {
        if (
          e.target.id === "overlay-window" ||
          e.target.parentElement.id === "overlay-window" ||
          e.target.parentElement.parentElement.id === "overlay-window" ||
          e.target.parentElement.parentElement.parentElement.id ===
            "overlay-window"
        )
          return;
        setIsOverlayWindowShown(false);
      }}
    >
      <div
        className="w-[500px] h-96 bg-white rounded-xl flex flex-col justify-between p-8 pb-16"
        id="auth-window"
      >
        <FontAwesomeIcon
          icon={faX}
          className="absolute text-red-500 hover:text-red-700 hover:scale-125 cursor-pointer"
          onClick={() => setIsOverlayWindowShown(false)}
        />
        {children}
      </div>
    </div>
  );
};

export default OverlayWindow;
