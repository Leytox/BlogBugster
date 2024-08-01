import { Link } from "react-router-dom";
import facebook from "../assets/facebook.png";
import x from "../assets/x.png";
import github from "../assets/github.png";
import linkedin from "../assets/linkedin.png";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer
      className={
        "gradient text-white py-16 flex flex-col justify-center 2xl:px-48 px-6 gap-12"
      }
    >
      <div className={"flex flex-row gap-4 items-center"}>
        <img src={logo} alt="logo" width={50} height={50} />
        <h1 className={"text-xl font-bold"}>BlogBugster</h1>
      </div>

      <div
        className={
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        }
      >
        {/* Section 1: Quick Links */}
        <div className={"py-8 border-r-[1px] border-r-white max-lg:border-r-0"}>
          <h5 className="font-bold mb-4">Quick Links</h5>
          <ul>
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/explore" className="hover:underline">
                Explore Posts
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Become an Author
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        {/* Section 2: Connect with Us */}
        <div className={"py-8 border-r-[1px] border-r-white max-lg:border-r-0"}>
          <hr className={"hidden mb-4 max-sm:block"} />
          <h5 className="font-bold mb-4">Connect with Us</h5>
          <div>Social Media:</div>
          <ul className="flex items-center space-x-4 mt-2">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={"bg-white rounded-3xl"}
                  src={facebook}
                  alt="facebook"
                  width={40}
                  height={40}
                />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={"bg-white rounded-3xl"}
                  src={x}
                  alt="x"
                  width={40}
                  height={40}
                />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={"bg-white rounded-3xl"}
                  src={linkedin}
                  alt="linkedin"
                  width={40}
                  height={40}
                />
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={"bg-white rounded-3xl"}
                  src={github}
                  alt="github"
                  width={40}
                  height={40}
                />
              </a>
            </li>
          </ul>
        </div>
        {/* Section 3: Contact Information */}
        <div
          className={
            "py-8 flex flex-col gap-2 border-r-[1px] border-r-white max-lg:border-r-0"
          }
        >
          <hr className={"hidden mb-4 max-sm:block"} />
          <h5 className="font-bold mb-4">Contact Information</h5>
          <p className={"hover:underline"}>
            <a href="mailto:support@bugchronicles.com">
              support@bugchronicles.com
            </a>
          </p>
          <p className={"hover:underline"}>
            <a href="tel:+1 (123) 456-7890">+1 (123) 456-7890</a>
          </p>
          <p className={"hover:underline"}>
            <a href="https://maps.app.goo.gl/fzA35W2Fj8wthjgw5">
              123 Tech Street, Innovation City
            </a>
          </p>
        </div>
        {/* Section 4: Copyright and Credits */}
        <div className="py-8 md:col-span-2 lg:col-span-1 flex flex-col gap-2">
          <hr className={"hidden mb-4 max-sm:block"} />
          <p>Copyright © 2024 BlogBugster. All rights reserved.</p>
          <p>Powered by MERN stack.</p>
          <p>Website Design by Devder Ilya.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
