import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLocation } from "../features/location/locationSlice.js";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLocation("Dashboard"));
  }, [dispatch]);
  return <div className={"min-h-screen"}></div>;
};

export default Dashboard;
