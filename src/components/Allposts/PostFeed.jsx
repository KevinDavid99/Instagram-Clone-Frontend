import React, { useState, useEffect } from "react";
import s from "../Allposts/PostFeed.module.css";
import { Link } from "react-router-dom";
import save from "./icons/save.PNG";
import send from "./icons/send.PNG";
import like from "./icons/heart-svgrepo-com.svg";
import redlike from "./icons/red-heart-svgrepo-com (1).svg";
import comment from "./icons/message-circle-svgrepo-com.svg";
import Status from "../Status/Status";
import downld from "./icons/download-icon1.jpg";
import Searchbar from "../Search/Searchbar";

export function checkExpiryToken() {
  const newDate = new Date();
  const userTokenDate = new Date(localStorage.getItem("ExpiryToken"));
  // comparing the current date and token expiry date values to check if the token is expired
  // then redirect the user to the login page
  if (newDate.getTime() >= userTokenDate.getTime()) {
    window.location.href = "/";
    localStorage.removeItem("Token");
    localStorage.removeItem("UserId");
    localStorage.removeItem("Username");
    localStorage.removeItem("ExpiryToken");
  }
}

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [islike, setIslike] = useState({});

  useEffect(() => {
    const savedIsLike = localStorage.getItem("islike");
    if (savedIsLike) {
      setIslike(JSON.parse(savedIsLike));
    }
  }, []);

  const toggleButton = (postID) => {
    const userID = localStorage.getItem("UserId");

    fetch(
      `https://instagram-clone-api-etqy.onrender.com/like/unlike/${postID}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`, // taking the authenticcated user token to access all data
        },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const updateIslike = { ...islike };
        updateIslike[postID] = data.liked; //updates the updatedIsLike object with the new like status (true or false)
        setIslike(updateIslike);

        localStorage.setItem("Liked", JSON.stringify(updateIslike));

        setPosts((prevPost) =>
          prevPost.map((post) => {
            if (post.id === data.liked_post.id) {
              return { ...post, likes_count: data.likes_count };
            }
            return post;
          })
        );
      })
      .catch((err) => console.log("ERROR", err));
  };

  // Function to download files to the device
  const downloadFile = (postFileUrl) => {
    console.log(postFileUrl);
    fetch(postFileUrl)
      .then((res) => res.blob())
      .then((file) => {
        let tempUrl = URL.createObjectURL(file); //Tempoary url
        const aTag = document.createElement("a");
        aTag.href = tempUrl;
        aTag.download = postFileUrl.replace(/^.*[\\\/]/, "");/* extract the filename from the full URL.*/
        document.body.appendChild(aTag);
        aTag.click();
        URL.revokeObjectURL(tempUrl);
        aTag.remove();
      })
      .catch(() => {
        alert("Failed to download file!");
      });
  };

  checkExpiryToken();

  useEffect(() => {
    fetch("https://instagram-clone-api-etqy.onrender.com/api/posts/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("Token")}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Searchbar />
      <Status />
      <div className="containerx">
        {posts.map((post) => (
          <div className={s.postcard} key={post.id}>
            <div className={s.header}>
              <div className={s.userinfo}>
                <img
                  src={post.user.profile_image}
                  alt="pic"
                  className={s.avatar}
                />

                <Link
                  to={`/profile-for/${post.user.user}/${post.user.user_id}/`}
                  style={{ textDecoration: "none" }}
                >
                  <h2 className={s.username}>{post.user.user}</h2>
                </Link>
                <span className={s.posttime}>{post.created}</span>
              </div>
              <img
                onClick={() => downloadFile(post.files)}
                src={downld}
                className={s.option}
              />
            </div>

            <div className={s.imageContainerDiv}>
              {post.files.includes("image") ? (
                <img
                  src={post.files}
                  alt="files-uploaded"
                  className={s.postImage}
                />
              ) : post.files.includes("video") ? (
                <video className={s.postVideo} src={post.files} controls />
              ) : null}
            </div>
            <div className={s.actions}>
              <div className={s.likeComment}>
                {/* Likke and unlike */}
                <div className="kkk" onClick={() => toggleButton(post.id)}>
                  {post.likes_count === 0 ? (
                    <img
                      style={{
                        width: "30px",
                        marginRight: "10px",
                      }}
                      src={like}
                    />
                  ) : islike[post.id] === false ? (
                    <img
                      style={{
                        width: "30px",
                        marginRight: "10px",
                      }}
                      src={like}
                    />
                  ) : (
                    <img
                      style={{
                        width: "30px",
                        marginRight: "10px",
                      }}
                      src={redlike}
                    />
                  )}
                </div>
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/comments/${post.id}`}
                >
                  <img
                    style={{
                      width: "28px",
                      marginRight: "7px",
                    }}
                    src={comment}
                  />
                </Link>
                <img style={{ width: "30px", marginTop: "2px" }} src={send} />
              </div>
              <div
                className="bookmark"
                onClick={() => downloadFile(post.files)}
              >
                <img style={{ width: "27px", cursor: "pointer" }} src={save} />
              </div>
            </div>

            <div className={s.likes}>{post.likes_count}</div>

            <div className={s.caption}>
              <strong>{post.user.username}</strong> {post.description}
              #instagram #IG Clone
            </div>

            <Link
              to={`/comments/${post.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className={s.comments}>
                <span>View all comments</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default PostFeed;
