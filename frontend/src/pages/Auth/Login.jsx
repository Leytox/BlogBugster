import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../features/auth/authApiSlice.js";
import { selectUser, setUser } from "../../features/auth/authSlice.js";
import { setLocation } from "../../features/location/locationSlice.js";
import GoogleOAuth from "../../components/GoogleOAuth.jsx";
import AppleOAuth from "../../components/AppleOAuth.jsx";
import FacebookOAuth from "../../components/FacebookOAuth.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const { user } = useSelector(selectUser);

  useEffect(() => {
    dispatch(setLocation("Login"));
  }, [dispatch, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setUser(res.user));
      navigate("/");
      toast.success("Successfully logged in");
    } catch (error) {
      console.log(error.data?.message || error.error);
      toast.error(error.data?.message || error.error);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="h-screen justify-center items-center flex flex-col gap-4"
    >
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
        <AppleOAuth />
        <FacebookOAuth />
      </div>
      <p>
        Don&lsquo;t have an account?{" "}
        <Link to={"/auth/register"} className={"text-blue-500 hover:underline"}>
          Register
        </Link>
      </p>
    </form>
  );
};

export default Login;
