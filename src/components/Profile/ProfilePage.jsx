import React, { useEffect, useState } from "react";
import pstyle from "../Profile/ProfilePage.module.css";
import { Link } from "react-router-dom";
import editicon from "../Profile/icons/bxs-edit.svg";
import deleteicon from "../Profile/icons/bx-trash.svg";
import DeletePost from "../DeletePost/DeletePost";
import { checkExpiryToken } from "../Allposts/PostFeed";

export async function fetchUserProfile(userName) {
  try {
    const response = await fetch(
      `https://kem-instagram-clone.onrender.com/api/${userName}-profile-settings/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
}

export async function fetchUserFollowUnfollow(userID) {
  try {
    const response = await fetch(
      `https://kem-instagram-clone.onrender.com/user/follow/${userID}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
}



function ProfilePage(props) {
  const [modalOpen, setModalOpen] = useState(null);
  const [userProfile, setUserProfile] = useState([]);
  const [follow, setFollow] = useState([]);

  const userName = props.username;
  const userId = localStorage.getItem("UserId");

  checkExpiryToken()

  const handleModal = (commentId) => {
    setModalOpen(commentId);
  };

  useEffect(() => {
    fetchUserProfile(userName)
      .then((data) => {
        setUserProfile([data]);
      })
      .catch((error) => console.log("Error:", error));
  }, [userName]);

  useEffect(() => {
    fetchUserFollowUnfollow(userId)
      .then((data) => {
        setFollow(data);
        console.log(data);
      })
      .catch((error) => error);
  }, []);

  return (
    <>
      <div className={pstyle.containerr}>
        {userProfile.map((profile) => (
          <>
            <div className={pstyle.profile} key={userId}>
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
                <Link
                  to="/edit-profile"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <button
                    className={`${pstyle.btn} ${pstyle.profile_edit_btn}`}
                  >
                    Edit Profile
                    <i
                      style={{ marginLeft: "10px" }}
                      className="fas fa-cog"
                      aria-hidden="true"
                    ></i>
                  </button>
                </Link>
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
                  </li>
                  {follow && (
                    <>
                      <li>
                        <span
                          style={{ marginRight: "3px" }}
                          className={pstyle.profile_stat_count}
                        >
                          {follow.num_of_followers}
                        </span>
                        followers
                      </li>
                      <li>
                        <span className={pstyle.profile_stat_count}>
                          {follow.num_of_users_following}
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
                      <div className={pstyle.gallery_image}>
                        <video
                          className={pstyle.gallery_video}
                          src={postfiles.files}
                          controls
                        />
                      </div>
                    ) : (
                      <>
                        <div className={pstyle.gallery_image}>Notin here</div>
                      </>
                    )}
                    {}
                    <div className={pstyle.gallery_item_info}>
                      <div className={pstyle.actions}>
                        <Link to={`/editpost/${postfiles.id}`}>
                          <div
                            style={{
                              marginRight: "5px",
                              backgroundColor: "white",
                              padding: "3px",
                            }}
                          >
                            <img src={editicon} alt="icon" />
                          </div>
                        </Link>
                        <div
                          style={{
                            backgroundColor: "rgb(255, 45, 45)",
                            padding: "3px",
                          }}
                          onClick={() => handleModal(postfiles.id)}
                        >
                          <img src={deleteicon} alt="icon" />
                          {modalOpen == postfiles.id && (
                            <DeletePost
                              closeModal={() => setModalOpen(null)}
                              postID={postfiles.id}
                            ></DeletePost>
                          )}
                        </div>
                      </div>
                    </div>
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

export default ProfilePage;
