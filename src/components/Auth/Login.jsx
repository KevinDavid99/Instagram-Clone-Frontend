import React, {useState} from 'react'
import styles from '../Auth/Login.module.css'
import igLogo from '../Auth/Screenshot 2023.png'
import igLogoName from "../Auth/instagramlogo.png";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner} from "@fortawesome/free-solid-svg-icons";


function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username : '',
    password : ''
  })

  const [error, setError] = useState({});

  const formFieldChange = (event) => {
    setLoginForm({
      ...loginForm,
      [event.target.name]: event.target.value,
    });
  };
  
  const validateInputs = () => {
    const usernameValue = loginForm.username.trim();
    const passwordValue = loginForm.password.trim();

    const newErrors = {
      username: "",
      password: "",
    };

    if (usernameValue === "") {
      newErrors.username = "Username is required";
    } else if (usernameValue.indexOf(" ") >= 0) {
      newErrors.username = "Username should not have whitespace";
    }

    if (passwordValue === "") {
      newErrors.password = "Password is required";
    } else if (passwordValue.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setError(newErrors);
  };

  const onSubmitForm = (event) => {
    event.preventDefault();

    validateInputs();


    const errmsgs = document.querySelectorAll(".errmessage");
    if (validateInputs && errmsgs.length === 0) {
      setLoading(true);

      const signInForm = new FormData();

      signInForm.append("username", loginForm.username);
      signInForm.append("password", loginForm.password);

      fetch("https://instagram-clone-api-etqy.onrender.com/auth/login/", {
        method: "POST",
        body: signInForm,
      })
        .then((response) => {
          if (response.ok) {
            console.log("User Signed in!!");
            return response.json();
          } else {
            const errDetail = document.getElementById("invalid");
            errDetail.innerText = "Cross check your password and username";
            errDetail.style.fontSize = '12px'
            setLoading(false);
          }
        })
        .then((data) => {
          console.log(data);
          if (data) {
            localStorage.setItem("Token", data.token);
            localStorage.setItem("ExpiryToken", data.expiry);

            fetch(
              "https://instagram-clone-api-etqy.onrender.com/auth/user/",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${localStorage.getItem("Token")}`,
                },
              }
            )
              .then((response) => response.json())
              .then((data) => {
                localStorage.setItem("UserId", data.id);
                localStorage.setItem("Username", data.username);
              })
              .catch((err) => console.log("Error :", err));
            navigate("/feed");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error: ", err);
        });
    }
  };


  
  return (
    <>
      <section>
        <div className={styles.container}>
          <img src={igLogo} alt="ig-pic" className={styles.igimage} />
          <form action="" style={{ border: "none" }} onSubmit={onSubmitForm}>
            <div className={styles.center}>
              <div className={styles.header}>
                <img
                  src={igLogoName}
                  alt="instagramLogo"
                  className="instaLogo"
                />
              </div>
              <div className={styles.inputElement}>
                <input
                  type="text"
                  placeholder="Username"
                  className={styles.inputText}
                  id="username"
                  name="username"
                  value={loginForm.username}
                  onChange={formFieldChange}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.inputText}
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={formFieldChange}
                />
                <button
                  id="submitBtn"
                  type="sumit"
                  className={styles.inputButton}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin size="2xl" />
                  ) : (
                    "Log in"
                  )}
                </button>

                <div className={styles.line}>
                  <span className={styles.arrow}></span>
                  <span className={styles.content}>OR</span>
                  <span className={styles.arrow}></span>
                </div>
                <div className={styles.social__icon}>
                  <i className={styles.fab}></i>
                  <span className={styles.errmessage}>
                    {error.username}
                    <br/>
                    <p id="invalid"></p>
                    {error.password}
                    <br></br>
                  </span>
                </div>
                <div className={styles.forgetPassword}></div>
              </div>
              <div className={styles.footer}>
                <p style={{ marginRight: "3px" }}>
                  Don't have an accout?
                  <Link to="/signup">
                    <span>Sign Up</span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login
