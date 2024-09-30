import { useEffect, useState } from "react";
import { setLocation } from "../../features/location/locationSlice.js";
import { useDispatch } from "react-redux";
import {
  useIsValidTokenQuery,
  useResetPasswordMutation,
} from "../../features/auth/authApiSlice.js";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [resetPassword] = useResetPasswordMutation();
  const { token } = useParams();
  const { isLoading, error } = useIsValidTokenQuery({ token });
  useEffect(() => {
    if (!isLoading && error) {
      navigate("/");
      toast.error("Invalid token");
    }
    dispatch(setLocation("Reset Password"));
  }, [dispatch, error, isLoading, navigate]);

  const handlePasswordReset = async () => {
    if (newPassword !== repeatNewPassword) {
      toast.error("Passwords doesn't match");
      return;
    }
    try {
      await resetPassword({ token, newPassword }).unwrap();
      toast.success("Password changed successfully");
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      toast.error(error.data?.message || error.error);
    }
  };
  return (
    <main
      className={"h-screen justify-center items-center flex flex-col gap-4"}
    >
      <h1 className={"text-2xl"}>Create new password</h1>
      <input
        onChange={(e) => setNewPassword(e.target.value)}
        value={newPassword}
        type="password"
        className={"input-default"}
        placeholder={"New Password"}
      />
      <input
        onChange={(e) => setRepeatNewPassword(e.target.value)}
        value={repeatNewPassword}
        type="password"
        className={"input-default"}
        placeholder={"Old Password"}
      />
      <button
        onClick={handlePasswordReset}
        className={"btn w-72"}
        disabled={newPassword.length < 8 || repeatNewPassword.length < 8}
      >
        Reset <FontAwesomeIcon icon={faRepeat} />
      </button>
    </main>
  );
};

export default ResetPassword;
