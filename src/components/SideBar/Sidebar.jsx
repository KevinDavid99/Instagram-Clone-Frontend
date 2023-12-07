import React, {useState, useEffect} from 'react'
import { Outlet } from 'react-router-dom'
import { Link } from "react-router-dom";
import iglogotext from '../SideBar/Icons/logo.PNG'
import more from "../SideBar/Icons/hamburger-menu-filled-icon-in-transparent-background-basic-app-and-web-ui-bold-line-icon-eps10-free-vector.jpg";
import search from '../SideBar/Icons/search-svgrepo-com.png'
import home from "../SideBar/Icons/home.PNG";
import message from "../SideBar/Icons/messenger-logo-bold-svgrepo-com.svg";
import notification from "../SideBar/Icons/heart-svgrepo-com.svg";
import create from "../SideBar/Icons/add.PNG";
import iglogo from "../SideBar/Icons/instagram-logo-facebook-2-svgrepo-com.png"
import CreatePost from "../PopUps/CreatePost";
import '../SideBar/App.css'
import { fetchUserProfile } from "../Profile/ProfilePage";


function Sidebar() {

  const [openModal, setOpenModal] = useState(false);
  const [userImg, setUserImg] = useState([])

  const handleModal = ()=> setOpenModal(!openModal)

  const logOut = () =>{
    fetch("https://instagram-clone-api-etqy.onrender.com/auth/logout/", {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("Token")}`,
        "Content-Type": "application/json",
      },
    });
    console.log('Log out sucessfull!!');
    localStorage.removeItem('Token');
    localStorage.removeItem("UserId");
    localStorage.removeItem("Username");
    localStorage.removeItem("ExpiryToken");
    localStorage.removeItem("Liked");
  }

  useEffect(() => {
    fetchUserProfile(localStorage.getItem("Username"))
      .then((data) => {
        setUserImg([data]);
      })
      .catch((error) => console.log("Error:", error));
  }, []);




  return (
    <>
      <div className="side-bar">
        <Link to="/feed" style={{ textDecoration: "none", color: "black" }}>
          <div className="sidebar-links-logo">
            <img
              className="ig-text"
              src={iglogotext}
              style={{ width: "54%", marginLeft: "12px", marginTop: "14px" }}
            />
            <img className="ig-logo" src={iglogo} style={{ width: "40%" }} />
          </div>
        </Link>

        <Link to="/feed" style={{ textDecoration: "none", color: "black" }}>
          <div className="sidebar-links home">
            <img src={home} alt="" style={{ width: "43px", height: "24px" }} />
            <p>Home</p>
          </div>
        </Link>

        <div id="searchicon" className="sidebar-links search">
          <img src={search} style={{ width: "43px" }} alt="" />
          <p>Search</p>
        </div>

        <div className="sidebar-links message">
          <img src={message} alt="" style={{ width: "43px" }} />
          <p>Messages</p>
        </div>

        <div className="sidebar-links notification">
          <img src={notification} style={{ width: "43px" }} alt="" />
          <p>Notifications</p>
        </div>

        <div className="sidebar-links" onClick={handleModal}>
          <img src={create} alt="" style={{ width: "43px" }} />
          <p>Create</p>
          {openModal && (
            <CreatePost closeModal={() => setOpenModal(false)}></CreatePost>
          )}
        </div>

        <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
          {userImg.map((image) => (
            <div
              className="sidebar-profileImg image"
              style={{ paddingRight: 0 }}
              key={image.user_id}
            >
              <img
                src={image.profile_image}
                alt="pic"
                style={{
                  marginRight: "15px",
                  width: "29px",
                  height: "29px",
                  objectFit: "cover",
                  borderRadius: "100%",
                }}
              />
              <p style={{ fontWeight: "400" }}>Profile</p>
            </div>
          ))}
        </Link>
        <div className="sidebar-links logout">
          <Link to="/">
            <a onClick={logOut}>Log out</a>
          </Link>
        </div>

        <div
          className="sidebar-links menu  dropup"
          style={{ marginTop: "35px" }}
        >
          <img
            src={more}
            className="dropbtn"
            style={{
              width: "46px",
              height: "50px",
              padding: "0px",
            }}
          />
          <div className="dropup-content">
            <Link
              to="/profile"
              style={{ textDecoration: "none", color: "black", padding: "0" }}
            >
              <a href="#">Settings</a>
            </Link>

            <Link style={{ padding: "0" }} to="/">
              <a onClick={logOut}>Log out</a>
            </Link>

            <hr />
          </div>
          <p style={{ marginTop: "17px" }}>More</p>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Sidebar
