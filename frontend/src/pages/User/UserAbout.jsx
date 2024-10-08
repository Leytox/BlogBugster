import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faEdit,
  faFloppyDisk,
  faHeartCrack,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice.js";
import { useParams } from "react-router-dom";
import Editor from "../../components/Editor.jsx";
import { useEffect, useState } from "react";
import { useUpdateAccountMutation } from "../../features/account/accountApiSlice.js";
import { toast } from "react-toastify";
import { setLocation } from "../../features/location/locationSlice.js";

const UserAbout = ({ about, setAbout }) => {
  const [content, setContent] = useState(about);
  const [preview, setPreview] = useState(about.length > 0);
  const { id } = useParams();
  const { user } = useSelector(selectUser);
  const [updateAccount] = useUpdateAccountMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLocation("Profile > About"));
  }, [dispatch]);

  const handleUpdate = async () => {
    try {
      await updateAccount({ about: content });
      setContent(content);
      setPreview(true);
      setAbout(content);
      toast.success("About updated successfully");
    } catch (err) {
      toast.error("Failed to update");
      console.error("Failed to update about", err);
    }
  };

  return (
    <section className={"max-sm:px-2 gap-4 flex flex-col"}>
      {!preview ? (
        user?.id.toString() !== id ? (
          <h1 className="text-5xl text-center m-auto italic text-gray-400 ">
            <FontAwesomeIcon icon={faHeartCrack} /> No information about user
            yet...
          </h1>
        ) : (
          <>
            <Editor content={content} setContent={setContent} />
            <div className={"flex w-full gap-2"}>
              <button
                onClick={handleUpdate}
                className={"btn w-full"}
                disabled={content.length < 512 || content === about}
              >
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </button>
              <button onClick={() => setPreview(true)} className={"btn w-full"}>
                <FontAwesomeIcon icon={faCancel} /> Cancel
              </button>
            </div>
          </>
        )
      ) : (
        <>
          <div
            className={"break-words ck-content"}
            dangerouslySetInnerHTML={{ __html: content.toString() }}
          />
          {user?.id.toString() === id && (
            <button className={"btn"} onClick={() => setPreview(false)}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
          )}
        </>
      )}
    </section>
  );
};

UserAbout.propTypes = {
  about: PropTypes.string,
  setAbout: PropTypes.func.isRequired,
};

export default UserAbout;
