import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  dispatch(setLocation("Profile"));
  return (
    <form className={"min-h-screen w-screen flex justify-center"}>
      <div></div>
    </form>
  );
};

export default Profile;
