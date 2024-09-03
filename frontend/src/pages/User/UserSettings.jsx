import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {setLocation} from "../../features/location/locationSlice.js";
import {selectUser} from "../../features/auth/authSlice.js";
import {useNavigate, useParams} from "react-router-dom";

const UserSettings = () => {
  const {id} = useParams();
  const {user} = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.id.toString() !== id) navigate("/");
    dispatch(setLocation("Settings"));
  }, [dispatch, id, navigate, user, user.id]);
  const handleUpdateSettings = (e) => {
    e.preventDefault();
  }
  return (
      <section className={"min-h-screen"}>
        <form onSubmit={handleUpdateSettings}>
          
        </form>
      </section>
  );
};

export default UserSettings;