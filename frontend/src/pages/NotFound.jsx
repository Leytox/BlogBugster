import Button from "../components/Button.jsx";
import { useNavigate } from "react-router-dom";
import question from "../assets/question.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice.js";

const NotFound = () => {
  const dispatch = useDispatch();
  dispatch(setLocation(":("));
  const navigate = useNavigate();
  useGSAP(() => {
    gsap.fromTo(
      "#question-mark",
      { rotate: 0, y: -100 },
      {
        rotate: 360,
        duration: 6,
        repeat: -1,
        y: 100,
        yoyo: true,
        ease: "power1.inOut",
      },
    );
    gsap.fromTo(
      "#question-mark-2",
      { rotate: 0, y: 100 },
      {
        rotate: 360,
        duration: 6,
        repeat: -1,
        y: -100,
        yoyo: true,
        ease: "power1.inOut",
      },
    );
  }, []);
  return (
    <div className={"h-screen flex flex-row justify-center items-center gap-8"}>
      <div className={"max-sm:hidden block"} id={"question-mark"}>
        <img src={question} alt="question mark" width={80} />
      </div>
      <div
        className={
          "flex flex-col justify-center items-center gap-4 text-center"
        }
      >
        <h1 className={"text-6xl"}>404 Not Found</h1>
        <p className={"text-xl text-gray-500 italic"}>
          The page you are looking for does not exist.
        </p>
        <Button
          title={"Go Home"}
          handleClick={() => {
            navigate("/");
          }}
        />
      </div>
      <div className={"max-sm:hidden block"} id={"question-mark-2"}>
        <img src={question} alt="question mark" width={80} />
      </div>
    </div>
  );
};

export default NotFound;
