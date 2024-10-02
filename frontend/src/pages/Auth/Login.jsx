import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useVerifyAccountMutation,
  useVerifyViaEmailMutation,
} from "../../features/auth/authApiSlice.js";
import { selectUser, setUser } from "../../features/auth/authSlice.js";
import { setLocation } from "../../features/location/locationSlice.js";
import GoogleOAuth from "../../components/GoogleOAuth.jsx";
import OverlayWindow from "../../components/OverlayWindow.jsx";
import VerificationInput from "react-verification-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faRepeat,
  faSquareArrowUpRight,
} from "@fortawesome/free-solid-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [verifyAccount] = useVerifyAccountMutation();
  const [verifyViaEmail] = useVerifyViaEmailMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const { user } = useSelector(selectUser);
  const [activationWindowShown, setActivationWindowShown] = useState(false);
  const [forgotPasswordWindowShown, setForgotPasswordWindowShown] =
    useState(false);
  const [is2FAWindowShown, setIs2FAWindowShown] = useState(false);
  useEffect(() => {
    dispatch(setLocation("Login"));
  }, [dispatch, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password, token }).unwrap();
      dispatch(setUser(res.user));
      navigate("/");
      toast.success("Successfully logged in");
    } catch (error) {
      console.log(error);
      if (error.data?.reason === "activation") {
        setActivationWindowShown(true);
        toast.info(error.data?.message || error.error);
      } else if (error.data?.reason === "2FA") {
        setIs2FAWindowShown(true);
        toast.info(error.data?.message || error.error);
      } else toast.error(error.data?.message || error.error);
    }
  };

  const handleSendActivationCodeToEmail = async () => {
    try {
      await verifyViaEmail({ email }).unwrap();
      toast.info(`Email was sent to ${email}`);
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || error.error);
    }
  };

  const handleSubmitActivationCode = async (e) => {
    try {
      await verifyAccount({ activationCode, email }).unwrap();
      setActivationWindowShown(false);
      setActivationCode("");
      await handleLogin(e);
      toast.success("Account verified");
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || error.error);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setRecoverEmail("");
      setForgotPasswordWindowShown(false);
      await forgotPassword({ email: recoverEmail }).unwrap();
      toast.success(`Reset link was sent to ${recoverEmail}`);
    } catch (error) {
      console.log(error);
      toast.error(error.data?.message || error.error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="h-screen justify-center items-center flex flex-col gap-4"
    >
      {activationWindowShown && (
        <OverlayWindow setIsOverlayWindowShown={setActivationWindowShown}>
          <h1 className={"text-center text-2xl font-bold"}>Activation</h1>
          <div
            className={
              "flex flex-col w-full h-full items-center justify-center gap-8"
            }
          >
            <VerificationInput
              placeholder={"X"}
              length={4}
              validChars={"1234567890"}
              id="activationCode"
              name="activationCode"
              required={true}
              onChange={(event) => setActivationCode(event)}
            />
            <button
              disabled={activationCode.length < 4}
              onClick={handleSubmitActivationCode}
              className={"btn-gradient w-2/3"}
              type={"button"}
            >
              Submit <FontAwesomeIcon icon={faSquareArrowUpRight} />
            </button>
          </div>
          <div className={"flex flex-col items-center gap-4"}>
            <h1 className={"text-xl"}>Get code from</h1>
            <div className={"flex gap-8"}>
              <a href="#" target={"_blank"}>
                <FontAwesomeIcon
                  icon={faTelegram}
                  className={
                    "text-4xl cursor-pointer transition-all duration-200 hover:scale-110"
                  }
                />
              </a>
              <FontAwesomeIcon
                onClick={handleSendActivationCodeToEmail}
                icon={faEnvelope}
                className={
                  "text-4xl cursor-pointer transition-all duration-200 hover:scale-110"
                }
              />
            </div>
          </div>
        </OverlayWindow>
      )}
      {forgotPasswordWindowShown && (
        <OverlayWindow setIsOverlayWindowShown={setForgotPasswordWindowShown}>
          <h1 className={"text-2xl text-center font-bold"}>Forgot Password</h1>
          <div
            className={
              "flex flex-col w-full h-full items-center justify-center gap-8"
            }
          >
            <input
              value={recoverEmail}
              onChange={(e) => setRecoverEmail(e.target.value)}
              type="email"
              className={"input-default"}
              placeholder={"example@example.com"}
            />
            <button
              onClick={handleForgotPassword}
              className={"btn w-2/3"}
              disabled={recoverEmail.length < 6}
            >
              Reset <FontAwesomeIcon icon={faRepeat} />
            </button>
          </div>
        </OverlayWindow>
      )}
      {is2FAWindowShown && (
        <OverlayWindow setIsOverlayWindowShown={setIs2FAWindowShown}>
          <div
            className={
              "flex flex-col w-full h-full items-center justify-center gap-8"
            }
          >
            <h1 className={"text-2xl"}>Verify your identity</h1>
            <div className={"flex gap-2 flex-col"}>
              <VerificationInput
                placeholder={"X"}
                length={6}
                validChars={"1234567890"}
                id="tokenCode"
                name="tokenCode"
                required={true}
                onChange={(event) => setToken(event)}
              />
              <h2 className={"text-sm text-gray-600"}>
                Input generated code from your auth app
              </h2>
              <button className={"btn"} onClick={handleLogin} type={"button"}>
                Submit <FontAwesomeIcon icon={faSquareArrowUpRight} />
              </button>
            </div>
          </div>
        </OverlayWindow>
      )}
      <h1 className={"text-4xl"}>Welcome back</h1>
      <div className={"flex flex-col"}>
        <label className={"text-md"}>Email</label>
        <input
          required={true}
          className="input-default"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={"example@example.org"}
        />
      </div>
      <div className={"flex flex-col"}>
        <label className={"text-md"}>Password</label>
        <input
          minLength={8}
          required={true}
          className="input-default"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"W:#$OICJW#P*"}
        />
      </div>
      <Button
        disabled={email.length < 6 || password.length < 8}
        title={"Login"}
        styles={"w-72"}
      />
      <div className={"flex items-center gap-2"}>
        <hr className={"border-[1px] w-32"} />
        <p>or</p>
        <hr className={"border-[1px] w-32"} />
      </div>
      <div className={"flex flex-col gap-2"}>
        <GoogleOAuth />
      </div>
      <p>
        Don&lsquo;t have an account?{" "}
        <Link to={"/auth/register"} className={"text-blue-500 hover:underline"}>
          Register
        </Link>
      </p>
      <p
        onClick={() => setForgotPasswordWindowShown(true)}
        className={"text-blue-500 cursor-pointer hover:underline"}
      >
        Forgot Password?
      </p>
    </form>
  );
};

export default Login;
