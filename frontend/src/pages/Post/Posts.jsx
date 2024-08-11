import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLocation } from "../../features/location/locationSlice.js";

const Posts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Posts"));
  }, [dispatch]);
  return <div className={"min-h-screen"}></div>;
};

export default Posts;
