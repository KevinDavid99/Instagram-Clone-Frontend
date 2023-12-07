import React from 'react'
import Background from './ComentModal/Background';
import '../Comments/comment.css'


function DeleteComent({ closeModal, commentId }) {
  const deletePost = () => {
    console.log(commentId);
    fetch(
      `https://instagram-clone-api-etqy.onrender.com/api/comments-delete/${commentId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      }
    )
      .then((response) => {
        window.location.reload();
        return response.json();
      })
      .catch((error) => console.log(`Error : ${error}`));
  };

  return (
    <Background closeModal={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: "18px", color: "black" }}>Delete Comment</h2>
        <p className="del-message">Sure you want to delete this comment?</p>
        <div className="select-btns">
          <button className="cancel" onClick={closeModal}>
            Cancel
          </button>
          <button onClick={() => deletePost()} className="delete">
            Delete
          </button>
        </div>
      </div>
    </Background>
  );
}

export default DeleteComent;

