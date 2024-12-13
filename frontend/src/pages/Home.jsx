import heroImage from "../assets/computer-bug.jpg";
import Button from "../components/Button.jsx";
import FeatureCard from "../components/FeatureCard.jsx";
import { features } from "../constants/index.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice.js";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBug,
  faCircleQuestion,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollTrigger);
const Home = () => {
  const dispatch = useDispatch();
  useGSAP(() => {
    dispatch(setLocation("Home"));
    gsap.from("#blog-bugster-text", {
      text: "",
      duration: 2,
      ease: "power2",
    });
    gsap.to("#blog-bugster-text", {
      text: "BlogBugster",
      duration: 3,
      ease: "power4",
    });
    gsap.from("#feature-card", {
      y: 200,
      opacity: 0,
      duration: 0.6,
      stagger: 0.5,
      ease: "power2",
      scrollTrigger: {
        trigger: "#feature-card",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <main>
      <section
        className={
          "min-h-screen gap-24 flex lg:flex-row flex-col justify-center px-56 items-center shadow-2xl max-sm:px-12"
        }
      >
        <div className={"flex flex-col gap-12"}>
          <div className={"flex flex-col gap-2"}>
            <h1
              className={
                "text-6xl font-bold leading-normal max-sm:text-4xl max-sm:max-w-72 max-sm:leading-normal"
              }
            >
              Welcome to{" "}
              <span className={"overline"} id={"blog-bugster-text"}>
                BlogBugster
              </span>
            </h1>
            <h2 className={"text-2xl leading-normal"}>
              Unraveling the Mysteries of Software and Hardware Bugs{" "}
              <FontAwesomeIcon icon={faBug} />
            </h2>
            <p className={"text-lg text-gray-600 leading-normal"}>
              Dive into a world where developers and tech enthusiasts uncover
              the quirks, glitches, and fixes of the digital realm. Whether
              it&rsquo;s a baffling software issue or a pesky hardware
              malfunction.
            </p>
          </div>
          <div className={"flex flex-row gap-8 max-sm:flex-col"}>
            <Link to={"/posts?page=1&category=all&sortOrder=new&searchTerm="}>
              <Button title={"Latest Posts"} />
            </Link>
            <Link to={"/auth/register"}>
              <Button
                title={"Join Community"}
                styles={
                  "bg-transparent border-2 border-[#001B60] text-[#001B60] hover:bg-transparent hover:text-[#0037c4] hover:border-[#0037c4]"
                }
              />
            </Link>
          </div>
        </div>
        <div className={"hidden 2xl:block"}>
          <img
            src={heroImage}
            alt="computer filled with bugs"
            className={"rounded-md"}
            width={1000}
            height={1000}
          />
        </div>
      </section>
      <section className={"min-h-screen shadow-2xl py-8 bg-gray-100"}>
        <div
          className={
            "flex h-full gap-24 px-12 flex-col justify-center items-center 2xl:flex-row 2xl:justify-between"
          }
        >
          <h1
            className={
              "text-6xl font-bold text-center uppercase mt-20 overline block 2xl:hidden max-md:text-4xl"
            }
          >
            <FontAwesomeIcon icon={faStar} /> FEATURES{" "}
            <FontAwesomeIcon icon={faStar} />
          </h1>
          <FeatureCard
            title={features[0].title}
            icon={features[0].icon}
            description={features[0].description}
            image={features[0].image}
          />
          <div className={"flex-col justify-between gap-20 hidden 2xl:flex"}>
            <h1
              className={
                "text-6xl font-bold text-center uppercase mt-20 overline"
              }
            >
              <FontAwesomeIcon icon={faStar} /> FEATURES{" "}
              <FontAwesomeIcon icon={faStar} />
            </h1>
            <FeatureCard
              title={features[1].title}
              icon={features[1].icon}
              description={features[1].description}
              image={features[1].image}
            />
          </div>
          <FeatureCard
            title={features[1].title}
            icon={features[1].icon}
            description={features[1].description}
            image={features[1].image}
            styles={"hidden max-2xl:block"}
          />
          <FeatureCard
            title={features[2].title}
            icon={features[2].icon}
            description={features[2].description}
            image={features[2].image}
          />
        </div>
      </section>
      <section className="min-h-screen py-20 flex items-center">
        <div className="w-full max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold text-center uppercase mb-12 overline max-md:text-4xl">
            <FontAwesomeIcon icon={faCircleQuestion} /> About Us{" "}
            <FontAwesomeIcon icon={faCircleQuestion} />
          </h1>
          <p className="text-lg text-gray-600 leading-normal text-center">
            BlogBugster is a community-driven platform dedicated to unraveling
            the mysteries of software and hardware bugs. Our mission is to
            provide insightful, accurate, and engaging content that helps
            developers and tech enthusiasts navigate the complexities of the
            digital world. From in-depth articles and tutorials to community
            discussions and expert insights, we strive to be your go-to source
            for all things tech.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
