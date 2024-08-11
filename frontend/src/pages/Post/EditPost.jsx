import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLocation } from "../../features/location/locationSlice.js";

const EditPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Edit Post"));
  }, [dispatch]);
  return <div className={"min-h-screen"}></div>;
};

export default EditPost;
