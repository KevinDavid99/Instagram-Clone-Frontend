import React, { useEffect, useState } from "react";
import pstyle from "../Profile/ProfilePage.module.css";
import { Link, json, useParams } from "react-router-dom";
import { fetchUserFollowUnfollow } from "../Profile/ProfilePage";
import {checkExpiryToken} from '../Allposts/PostFeed'

export function fetchUserProfile(userName) {
  return fetch(`http://127.0.0.1:8000/api/${userName}-profile-settings/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${localStorage.getItem("Token")}`,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Error:", error);
      throw error;
    });
}




function FriendProfile(props) {
  const userName = props
  const userId= localStorage.getItem("UserId");

  const [userProfile, setUserProfile] = useState([]);
  const [userFollow, setUserFollow] = useState([]);
  const [isFollowing, setIsFollowing] = useState({})
  const { username, user_id } = useParams();


  checkExpiryToken()

  useEffect(() => {
    fetchUserProfile(username)
      .then((data) => {
        setUserProfile([data]);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  useEffect(() => {
    fetchUserFollowUnfollow(user_id)
      .then((data) => {
      console.log(data);
      setUserFollow(data);
    });
  }, []);


  useEffect(()=>{
    const saveIsFollows = localStorage.getItem("isFollowing");
    if(saveIsFollows){
      setIsFollowing(JSON.parse(saveIsFollows))
    }
  }, [])
  
  const toggleButton = (userID) =>{
    fetch(`http://127.0.0.1:8000/user/follow/${userID}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("Token")}`, // taking the authenticcated user token to access all data
      }
    }).then((response)=> response.json()).then((data)=>{
      console.log(data);
      const updateFollow = {...isFollowing}
      updateFollow[userID] = data.Followed
      setIsFollowing(updateFollow)
      localStorage.setItem('isFollowing', JSON.stringify(updateFollow))
      window.location.reload()
    })
  }

  return (
    <>
      <div className={pstyle.containerr}>
        {userProfile.map((profile) => (
          <>
            <div className={pstyle.profile} key={username}>
              <div className={pstyle.profile_image}>
                <img
                  src={profile.profile_image}
                  alt="ee"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div className={pstyle.profile_user_settings}>
                <h1 className={pstyle.profile_user_name}>{profile.username}</h1>
              </div>

              <div className={pstyle.profileStats}>
                <ul>
                  <li>
                    <span
                      className={pstyle.profile_stat_count}
                      style={{ marginRight: "4px" }}
                    >
                      {profile.number_of_user_post}
                    </span>
                    posts
                    {/* <h5>{userFollow.following.following}</h5> */}
                  </li>
                  {userFollow && (
                    <>
                      <li>
                        <span
                          style={{ marginRight: "3px" }}
                          className={pstyle.profile_stat_count}
                        >
                          {userFollow.num_of_followers}
                        </span>
                        followers
                      </li>
                      <li>
                        <span className={pstyle.profile_stat_count}>
                          {userFollow.num_of_users_following}
                        </span>
                        following
                      </li>
                    </>
                  )}
                </ul>
              </div>

              <div className={pstyle.profile_bio}>
                <p>
                  <span className={pstyle.profile_real_name}>
                    {profile.username} <br></br>
                  </span>
                  {profile.bio}
                </p>
                {userId !== user_id ? (
                  <div
                    onClick={() => toggleButton(user_id)}
                    style={{ display: "inline" }}
                  >
                    {isFollowing[user_id] === false ? (
                      <button className={pstyle.follow_btn}>Follow</button>
                    ) : (
                      <button className={pstyle.follow_btn}>Unfollow</button>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <hr style={{ width: "100%", marginBottom: "24px" }} />
            <main>
              <div className={pstyle.gallery}>
                {profile.posts.map((postfiles) => (
                  <div
                    key={postfiles.id}
                    className={pstyle.gallery_item}
                    tabIndex="0"
                    id={postfiles.id}
                  >
                    {/* <img
                      src={postfiles.files}
                      alt="333"
                      className={pstyle.gallery_image}
                    /> */}
                    {postfiles.files === null ? (
                      <>
                        <div>Notin here</div>
                      </>
                    ) : postfiles.files.includes("image") ? (
                      <img
                        src={postfiles.files}
                        alt="files-uploaded"
                        className={pstyle.gallery_image}
                      />
                    ) : postfiles.files.includes("video") ? (
                      <video
                        className={pstyle.gallery_image}
                        src={postfiles.files}
                        controls
                      />
                    ) : (
                      <>
                        <div>Notin here</div>
                      </>
                    )}
                    <Link
                      to={`/comments/${postfiles.id}`}
                      style={{ textDecoration: "none", color: "red" }}
                    >
                      <div className={pstyle.gallery_item_info}>
                        {/* <ul>
                        {authUserName === username ? (
                            <li
                                className="gallery_item_comments"
                                onClick={() => deletingPost(postfiles.id)}
                            >
                                <span className={pstyle.visually_hidden}>
                                Delete :
                                </span>
                                <i
                                className="fas fa-comment"
                                aria-hidden="true"
                                ></i>
                                Delete
                            </li>
                            ) : null}
                            </ul> */}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </main>
          </>
        ))}
      </div>
    </>
  );
}

export default FriendProfile;
