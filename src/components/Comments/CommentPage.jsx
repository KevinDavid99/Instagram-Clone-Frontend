import React, {useState, useEffect} from 'react'
import '../Comments/ComentPage.css'
import { Link, useParams } from 'react-router-dom';
import remove from '../Comments/ComentModal/icons/x-regular-24.png'
import DeleteComent from './DeleteComent';
import { checkExpiryToken } from "../Allposts/PostFeed";

function CommentPage(username) {
    const [modalOpen, setModalOpen] = useState(null);
    const handleModal = (commentId) => { setModalOpen(commentId) };
    
    const [comments, setComments] = useState([]);
    const [commentPost, setCommentPost] = useState({ comment : " " });
    const [post, setPost] = useState();
    const {postID} = useParams()
        
    const userName = localStorage.getItem("Username");

    checkExpiryToken()


    
    useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/comments/${postID}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          setPost(data.post);
        })
        .catch((err) => console.log("Error", err));
    }, []);

    const handleCommentChange = (event) => {
      setCommentPost({
        comment: event.target.value,
      });
    };

    const onSumitComment = (event) => {
      event.preventDefault();

      const commentData = new FormData();

      commentData.append("body", commentPost.comment);

      fetch(`http://127.0.0.1:8000/api/comments/${postID}/`, {
        method: "POST",
        body: commentData,
        headers: {
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      })
        .then((response) => {
          response.json();
          window.location.reload();
        })
        .catch((err) => console.log("Error", err));
    };


  return (
    <>
      <div className="card-container">
        <div className="float-layout">
          <div className="card-image">
            {post && (
              <>
                {post.files.includes("image") ? (
                  <img src={post.files} alt="post_file" className="postFile" />
                ) : post.files.includes("video") ? (
                  <video src={post.files} controls className="postFile" />
                ) : null}
              </>
            )}

            <div className="card">
              <form
                style={{ border: "none" }}
                className="card-desc"
                onSubmit={onSumitComment}
              >
                <div className="card-desc">
                  {post && (
                    <>
                      <div className="comments-list">
                        <div className="comment">
                          <img
                            src={post.user.profile_image}
                            alt="profile image"
                          />
                          <div className="comment-content">
                            <h5 className="comment-username">
                              {post.user.user}
                            </h5>
                            <p className="comment-text">{post.description}</p>
                            <span>{post.created}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <hr />
                  {comments.map((message) => (
                    <div className="commments-list" key={message.id}>
                      <div className="comment">
                        <img
                          src={message.user.profile_image}
                          alt="profile image"
                        />
                        <div className="comment-content">
                          <Link
                            style={{
                              textDecoration: "none",
                              color: "black",
                              display: "inline-block",
                            }}
                            to={`/profile-for/${message.user.user}`}
                          >
                            <h5 className="comment-username">
                              {message.user.user}
                            </h5>
                          </Link>
                          <p className="comment-text">{message.body}</p>
                          <span>{message.created}</span>
                          {userName === message.user.user && (
                            <div
                              id={message.id}
                              style={{
                                display: "inline-block",
                                marginLeft: "9px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleModal(message.id)}
                            >
                              <img
                                style={{ width: "23px", height: "9px" }}
                                src={remove}
                              />
                              {modalOpen === message.id && (
                                <DeleteComent
                                  closeModal={() => setModalOpen(null)}
                                  commentId={message.id}
                                ></DeleteComent>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="comment-input">
                  <input
                    type="text"
                    id="comment"
                    name="comment"
                    placeholder="Add a
                      comment..."
                    value={commentPost.comment}
                    onChange={handleCommentChange}
                  />
                  <button>Post</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentPage
