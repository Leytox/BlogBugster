import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../features/auth/authApiSlice.js";
import { selectUser, setUser } from "../../features/auth/authSlice.js";
import { toast } from "react-toastify";
import { setLocation } from "../../features/location/locationSlice.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  dispatch(setLocation("Register"));

  const [register] = useRegisterMutation();
  const { user } = useSelector(selectUser);

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate, user]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        document.getElementById("confirmPassword").focus();
        return toast.error("Passwords do not match");
      }
      const res = await register({ name, email, password }).unwrap();
      dispatch(setUser(res.user));
      navigate("/login");
      toast.success("Successfully signed up");
    } catch (error) {
      console.log(error.data?.message || error.error);
      toast.error(error.data?.message || error.error);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="font-oswald h-screen justify-center items-center flex flex-col gap-6"
    >
      <h1 className={"text-4xl"}>Welcome</h1>
      <div className={"flex flex-col"}>
        <label className={"text-md"}>Name</label>
        <input
          required={true}
          className="input-default"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={"John Doe"}
        />
      </div>
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
          placeholder={"W:#$OICJW#P*("}
        />
      </div>
      <div className={"flex flex-col"}>
        <label className={"text-md"}>Confirm Password</label>
        <input
          id={"confirmPassword"}
          minLength={8}
          required={true}
          className="input-default"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          placeholder={"Same as password"}
        />
      </div>
      <Button
        title={"Register"}
        disabled={!name || !email || !password || !confirmPassword}
      />
      <p>
        Have an account already?{" "}
        <Link to={"/login"} className={"text-blue-500 hover:underline"}>
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
