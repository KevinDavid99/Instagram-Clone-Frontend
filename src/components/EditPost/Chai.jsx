import React, { useState, useEffect } from "react";
import Backdrop from "../PopUps/Backdrop";
import modalstyle from "../PopUps/Postcard.module.css";
import { useParams } from "react-router-dom";

function EditPost({ closeModal }) {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState({ description: "" });
  const [isVideo, setIsVideo] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prefilData, setPrefilData] = useState([]);

  const { postId } = useParams();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("Token")}`, // taking the authenticcated user token to access all data
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPrefilData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (prefilData) {
      setCaption({ description: prefilData.description || "" });
    }
  }, []);

  const handleDescriptionChange = (event) => {
    setCaption({
      description: event.target.value,
    });
  };

  const handleFileInputChange = (e) => {
    const fileselected = e.target.files[0];
    console.log("File type is : ", fileselected.type);

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
    } else if (!fileselected) {
      console.log("No file selected");
    }
  };
  const onSubmitPost = (e) => {
    e.preventDefault();
    const errfile = document.getElementById("fileerr");

    if (!selectedFile) {
      console.error("No file selected");
      errfile.style.color = "red";
      errfile.innerText = "No file selected";
      return;
    }

    const postData = new FormData();

    postData.append("description", caption.description);
    postData.append("files", selectedFile);

    fetch("http://127.0.0.1:8000/api/posts/", {
      method: "POST",
      body: postData,
      headers: {
        Authorization: `Token ${localStorage.getItem("Token")}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          window.location.href = "/feed";
        }
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.log("Error ", err));
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
          className={`${modalstyle.container}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className={modalstyle.heading}>Create A Post</h2>
          <div className={modalstyle.wrapper}>
            <div className={modalstyle.editor_panel}>
              <div className={modalstyle.filter}>
                <label className={modalstyle.title} htmlFor="description">
                  Description
                </label>
                <br></br>
                <textarea
                  cols={24}
                  rows={16}
                  type="text"
                  value={caption.description}
                  name="description"
                  id="description"
                  onChange={handleDescriptionChange}
                />
              </div>
            </div>
            <div className={modalstyle.preview_img}>
              {!file ? (
                <img src={prefilData.files} alt="files-uploaded" />
              ) : isVideo ? (
                <video controls>
                  <source src={file} />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : (
                <img src={file} alt="files-uploaded" />
              )}
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
