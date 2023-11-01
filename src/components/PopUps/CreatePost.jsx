import React, { useState } from "react";
import Backdrop from "./Backdrop";
import picholder from "./image-placeholder.svg";
import modalstyle from "./Postcard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function CreatePost({ closeModal }) {
  const [file, setFile] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState({ description: "" });
  const [isVideo, setIsVideo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true)

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
      setIsDisabled(false)
    } else if (!fileselected) {
      console.log("No file selected");
    }
  };


  const onSubmitPost = (e) => {
    e.preventDefault();
    setIsDisabled(true)
    setLoading(true)
    // const errfile = document.getElementById("fileerr");

    // if (!selectedFile) {
    //   errfile.style.color = "red";
    //   errfile.innerText = "No file selected";
    //   setTimeout(() => {
    //     errfile.style.display = "none";
    //   }, 2000);
    //   return;
    // }

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
        }else {setLoading(false)}
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
          <h2 className={modalstyle.heading}>Create A Post</h2>
          <div className={modalstyle.wrapper}>
            <div className={modalstyle.preview_img}>
              {!file ? (
                <img src={picholder} alt="files-uploaded" />
              ) : isVideo ? (
                <video controls className={modalstyle.preview_imgx}>
                  <source src={file} />
                  Sorry, your browser doesn't support embedded videos.
                </video>
              ) : (
                <>
                  <img
                    src={file}
                    alt="files-uploaded"
                    className={modalstyle.preview_imgx}
                  />
                </>
              )}
              {loading ? (
                <div className={modalstyle.loadingIcon}>
                  Loading, please wait...<br></br>
                  <FontAwesomeIcon icon={faSpinner} spin size="2xl" />
                </div>
              ) : ''}
            </div>
            <div className={modalstyle.editor_panelx}>
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
              <h2 id="fileerr"> </h2>
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

export default CreatePost;





