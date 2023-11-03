import React from 'react'
import Background from './Background';
import "../Comments/comment.css";
import { checkExpiryToken } from "../Allposts/PostFeed";

function DeletePost({ closeModal, postID }) {
  console.log(postID);
  checkExpiryToken()

  const deletingPost = () => {
    fetch(
      `https://instagram-clone-api-etqy.onrender.com/api/posts/${postID}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      }
    )
      .then((response) => {
        console.log(response);
        window.location.reload();
        return response.json();
      })
      .catch((error) => console.log(`Error : ${error}`));
  };

  return (
    <Background closeModal={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: "18px", color: "black" }}>Delete Post</h2>
        <p className="del-message">Sure you want to delete this Post?</p>
        <div className="select-btns">
          <button className="cancel" onClick={closeModal}>
            Cancel
          </button>
          <button onClick={() => deletingPost()} className="delete">
            Delete
          </button>
        </div>
      </div>
    </Background>
  );
}

export default DeletePost
