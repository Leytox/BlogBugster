import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLocation } from "../features/location/locationSlice.js";
import { useNavigate } from "react-router-dom";
import { useGetAccountQuery } from "../features/account/accountApiSlice.js";
import Loader from "../components/Loader.jsx";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetAccountQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocation("Dashboard"));
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

export default Dashboard;
