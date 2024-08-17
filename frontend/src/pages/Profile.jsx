import { useDispatch } from "react-redux";
import { setLocation } from "../features/location/locationSlice.js";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { useGetUserQuery } from "../features/users/usersApiSlice.js";

const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, error, isLoading } = useGetUserQuery(id);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Profile"));
  }, [dispatch]);

  useEffect(() => {
    if (error) navigate("/not-found");
  }, [error, navigate]);

  if (isLoading)
    return (
      <div className={"h-screen flex justify-center items-center"}>
        <Loader />
      </div>
    );

  if (error) return null;
  console.log(data);

  return <main className={"min-h-screen"}></main>;
};

export default Profile;
