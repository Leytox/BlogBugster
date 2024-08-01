import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice.js";
import { useEffect } from "react";

const Profile = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Profile"));
  }, [dispatch]);
  return (
    <form className={"min-h-screen w-screen flex justify-center"}>
      <div></div>
    </form>
  );
};

export default Profile;
