import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../features/auth/authApiSlice.js";
import { selectUser, setUser } from "../../features/auth/authSlice.js";
import { setLocation } from "../../features/location/locationSlice.js";

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
      className="h-screen justify-center items-center flex flex-col gap-6"
    >
      <h1 className={"text-4xl"}>Welcome back</h1>
      <div className={"flex flex-col gap-2"}>
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
      <div className={"flex flex-col gap-2"}>
        <label className={"text-md"}>Password</label>
        <input
          minLength={6}
          required={true}
          className="input-default"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={"W:#$OICJW#P*"}
        />
      </div>
      <Button
        disabled={email.length < 6 || password.length < 6}
        title={"Login"}
        styles={"w-72"}
      />
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
