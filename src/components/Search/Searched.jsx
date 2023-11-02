import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './search.css'
import PostFeed from '../Allposts/PostFeed';
import s from "../Allposts/PostFeed.module.css";
import { Link, useNavigate } from "react-router-dom";
import save from "../Allposts/icons/save.PNG";
import send from "../Allposts/icons/send.PNG";
import option from "../Allposts/icons/option.PNG";
import noContentImg from './image/no-web-content-found.png'
import like from "../Allposts/icons/heart-svgrepo-com.svg";
import redlike from "../Allposts/icons/red-heart-svgrepo-com (1).svg";
import comment from "../Allposts/icons/message-circle-svgrepo-com.svg";

function Searched() {
    const [posts, setPosts] = useState([]);
    const {searchedWord} = useParams()

    useEffect(()=>{

        fetch(
          `https://kem-instagram-clone.onrender.com/api/posts/search/?search=${searchedWord}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("Token")}`,
            },
          }
        )
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setPosts(data);
          })
          .catch((err) => {
            console.log(err);
          });
    }, [searchedWord])

  const hasPostsWithSearchedWord = posts.some(
    (post) =>
      post.description.includes(searchedWord) ||
      post.user.user.includes(searchedWord)
  );

if (hasPostsWithSearchedWord) {
  return (
    <div className="container">
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
            <div className="menu">
              <img src={option} className={s.option} />
            </div>
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
              {/* <div className="kkk" onClick={() => toggleButton(post.id)}>
                {islike[post.id] === false ? (
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
              </div> */}
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
            <div className="bookmark">
              <img style={{ width: "27px", color: "red" }} src={save} />
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
            <div
              className={s.comments}
              // onClick={() => {
              //   setSelectedPostId(post.id);
              // }}
            >
              <span>View all comments</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
} else {
  return (
    <div className="not-found-img">
      <img
        style={{ filter: "brightness(108%)", width: "770px" }}
        src={noContentImg}
        alt=""
      />
    </div>
  );
}
}

export default Searched
