import React, { useState, useEffect } from "react";
import Backdrop from "../PopUps/Backdrop";
import modalstyle from "../PopUps/Postcard.module.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function EditPost({ closeModal }) {
  const [selectedFile, setSelectedFile] = useState(null); 
  const [caption, setCaption] = useState({ description: "" });
  const [isVideo, setIsVideo] = useState(false);
  const [file, setFile] = useState(null);
  const [prefilData, setPrefilData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { postId } = useParams();

  useEffect(() => {
    fetch(
      `https://instagram-clone-api-etqy.onrender.com/api/get-posts/${postId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`, // taking the authenticcated user token to access all data
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setPrefilData(data);
        if (prefilData.files) {
          if (prefilData.files.includes("image")) {
            setIsVideo(false);
          } else if (prefilData.files.includes("video")) {
            setIsVideo(true);
          }
          setFile(prefilData.files);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [prefilData.files]);

useEffect(() => {
  if (prefilData.description) {
    setCaption({ description: prefilData.description });
  }
}, [prefilData.description]);

  const handleDescriptionChange = (event) => {
    setCaption({
      description: event.target.value,
    });
  };
 
  const handleFileInputChange = (e) => {
    const fileselected = e.target.files[0];
    console.log(fileselected);

    if (fileselected) {
      if (fileselected.type.startsWith("image/")) {
        setIsVideo(false);
        setFile(URL.createObjectURL(fileselected));
        setSelectedFile(fileselected);
      } else if (fileselected.type.startsWith("video/")) {
        setIsVideo(true);
        setFile(URL.createObjectURL(fileselected));
        setSelectedFile(fileselected);
      }
      setIsDisabled(false);
    }
  };



  const onSubmitPost = (e) => {
    e.preventDefault();
    setIsDisabled(true);
    setLoading(true);

    const postData = new FormData();

    postData.append("description", caption.description);

    if(selectedFile){
        postData.append("files", selectedFile);
    }

    fetch(
      `https://instagram-clone-api-etqy.onrender.com/api/post-update/${postId}/`,
      {
        method: "PATCH",
        body: postData,
        headers: {
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      }
    )
      .then((response) => {
        console.log(response);
        if (response.ok) {
          window.location.href = `/comments/${postId}`;
        } else {
          setLoading(false);
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((err) => setLoading(false));
  };

  const handleChooseImageClick = (e) => {
    e.preventDefault();
    const fileInput = document.querySelector(".file_input");
    fileInput.click();
  };
  return (
    <Backdrop closeModal={closeModal}>
      <form style={{ border: "none" }} onSubmit={onSubmitPost}>
        <div
          className={`${modalstyle.container} ${
            isDisabled ? modalstyle.disable : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={modalstyle.heading}>Edit Post</h2>
          <div className={modalstyle.wrapper}>
            <div className={modalstyle.preview_img}>
              {!file ? (
                <></>
              ) : isVideo ? (
                <video controls className={modalstyle.preview_imgx}>
                  <source src={file} />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : (
                <img
                  src={file}
                  alt="files-uploaded"
                  className={modalstyle.preview_imgx}
                />
              )}
              {loading ? (
                <div className={modalstyle.loadingIcon}>
                  Loading, please wait...<br></br>
                  <FontAwesomeIcon icon={faSpinner} spin size="2xl" />
                </div>
              ) : (
                ""
              )}
            </div>

            {/* <div className={modalstyle.preview_img}>
              {!file ? (
                 isVideo ? (  
                  <video controls>
                    <source src={prefilData.files} />
                    Sorry, your browser doesn't support embedded videos.
                  </video>
                ) : (
                  <img src={prefilData.files} alt="files-uploaded" />
                )
              ) : file && isVideo ? (
                <video controls>
                  <source src={file} />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : file && !isVideo ?(
                <img src={file} alt="files-uploaded" />
              ) :(
                <h2>No content</h2>
              )}
            </div> */}
            <div className={modalstyle.editor_panel}>
              <div className={modalstyle.filter}>
                <label className={modalstyle.title} htmlFor="description">
                  Description
                </label>
                <br></br>
                <textarea
                  cols={30}
                  type="text"
                  value={caption.description}
                  name="description"
                  id="description"
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>
          </div>

          <div className={modalstyle.controls}>
            {/* <button className={modalstyle.reset_filter}>Reset Filters</button> */}
            <div className={modalstyle.row}>
              <h2 id="fileerr"></h2>
              <input
                type="file"
                className="file_input"
                hidden
                onChange={handleFileInputChange}
              />
              <button
                onClick={handleChooseImageClick}
                className={modalstyle.choose_img}
              >
                Choose File
              </button>
              <button className={modalstyle.save_img}>Share</button>
            </div>
          </div>
        </div>
      </form>
    </Backdrop>
  );
}

export default EditPost;
