import logo from "/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faLocation,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer
      className={
        "gradient text-white py-12 flex flex-col justify-center 2xl:px-48 px-6 gap-12 z-50"
      }
    >
      <div className={"flex flex-row gap-4 items-center"}>
        <img src={logo} alt="logo" width={50} height={50} />
        <h1 className={"text-xl font-bold"}>BlogBugster</h1>
      </div>
      <div
        className={
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8"
        }
      >
        <div className="md:col-span-2 lg:col-span-1 flex flex-col gap-2">
          <p>Copyright © 2024 BlogBugster. All rights reserved.</p>
          <p>Powered by MERN stack.</p>
          <p>Website Design by Devder Ilya.</p>
        </div>
        <div className={"flex flex-col gap-2"}>
          <h5 className="font-bold">Contact Information</h5>
          <p className={"hover:underline flex gap-2"}>
            <FontAwesomeIcon icon={faEnvelope} />
            <a href="mailto:support@bugchronicles.com">
              support@bugchronicles.com
            </a>
          </p>
          <p className={"hover:underline flex gap-2"}>
            <FontAwesomeIcon icon={faPhone} />
            <a href="tel:+1 (123) 456-7890">+1 (123) 456-7890</a>
          </p>
          <p className={"hover:underline flex gap-2"}>
            <FontAwesomeIcon icon={faLocation} />
            <a href="https://maps.app.goo.gl/fzA35W2Fj8wthjgw5" target="_blank">
              123 Tech Street, Innovation City
            </a>
          </p>
        </div>
        <div>
          <h5 className="font-bold">Connect with Us</h5>
          <ul className="flex items-center space-x-4 mt-2">
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className={
                    "text-3xl hover:scale-110 transition-all duration-200"
                  }
                />
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faXTwitter}
                  className={
                    "text-3xl hover:scale-110 transition-all duration-200"
                  }
                />
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className={
                    "text-3xl hover:scale-110 transition-all duration-200"
                  }
                />
              </a>
            </li>
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className={
                    "text-3xl hover:scale-110 transition-all duration-200"
                  }
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
