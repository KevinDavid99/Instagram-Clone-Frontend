import React, { useEffect, useState } from 'react'
import styled from './/EditProfile.module.css'
import { fetchUserProfile } from "../Profile/ProfilePage";
import { checkExpiryToken } from "../Allposts/PostFeed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function EditProfile(props) {
  const [profilePicture, setProfilePicture] = useState();
  const [editProfileData, setEditProfileData] = useState({ bio: " " });
  const [preLoadedPic, setPreLoadedPic] = useState();
  const [prefillData, setPrefillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const userName = props.username

  checkExpiryToken()

  useEffect(() => {
    fetchUserProfile(userName).then((data) => {
      console.log(data);
      setPrefillData(data);
    });
  }, [userName]);

  useEffect(() => {
    if (prefillData) {
      setEditProfileData({ bio: prefillData.bio || "" });
    }
  }, [prefillData]);

  const handleBioChange = (event) => {
    setEditProfileData({
      bio: event.target.value,
    });
  };

  const handleImageInputChange = (event) => {
    const imageSelected = event.target.files[0];

    if (imageSelected) {
      if (imageSelected.type.startsWith("image/")) {
        setPreLoadedPic(URL.createObjectURL(imageSelected));
        setProfilePicture(imageSelected);
      } else {
        console.log("Not valid");
      }
      // setIsDisabled(false);
    }
    // setProfilePicture(event.target.files[0]);
  };

  const onSubmitProfile = (event) => {
    event.preventDefault();
    setIsDisabled(true);
    setLoading(true);

    const profileData = new FormData();

    if (profilePicture) {
      profileData.append("profile_image", profilePicture);
    }
    profileData.append("bio", editProfileData.bio);

    fetch(
      `https://instagram-clone-api-etqy.onrender.com/api/${userName}-profile-settings/`,
      {
        method: "PATCH",
        body: profileData,
        headers: {
          Authorization: `Token ${localStorage.getItem("Token")}`,
        },
      }
    )
      .then((response) =>
        response.status !== 200 ? setLoading(false) : response.json()
      )
      .then((data) => {
        console.log(data);
        window.location.href = "/profile";
      })
      .catch((error) => setLoading(false));
  };

  const handleChooseImage = (e) => {
    e.preventDefault();
    const fileInput = document.querySelector(".image_input");
    fileInput.click();
  };

  return (
    <>
      <form
        className={styled.edit_profile_container}
        onSubmit={onSubmitProfile}
        style={{ border: "none" }}
      >
        <div className={`${styled.edit_profile_card} ${isDisabled ? styled.disable : ''}`}>
          <h2>Edit Your Profile</h2>
          <div className={`${styled.profile_image}`}> 
            {!preLoadedPic ? (
              <img src={prefillData.profile_image} alt="Profile" />
            ) : (
              <img src={preLoadedPic} alt="" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageInputChange}
              className="image_input"
            />
            {loading ? (
              <div className={styled.loading_icon}>
                Loading, please wait...<br></br>
                <FontAwesomeIcon icon={faSpinner} spin size="2xl" />
              </div>
            ) : (
              ""
            )}
            <button className={styled.chooseBtn} onClick={handleChooseImage}>Choose Image</button>
          </div>
          <div className={styled.bio}>
            <br />
            <br />
            <h4>Current Bio: "{prefillData.bio}" </h4>
            <textarea
              rows="4"
              placeholder="Add a bio..."
              value={editProfileData.bio}
              onChange={handleBioChange}
            />
            <input className={styled.submitbtn} type="submit" value="Update" />
          </div>
        </div>
      </form>
    </>
  );
}

export default EditProfile
