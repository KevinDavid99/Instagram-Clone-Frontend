import React, {useState} from 'react'
import styles from '../Auth/SignUp.module.css';
import igLogo from '../Auth/instagramlogo.png'
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";



function Signup() {
  const navigate = useNavigate
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password1: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleFormFieldChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const validateInputs = () => {
    const usernameValue = form.username.trim();
    const passwordValue = form.password1.trim();
    const confirmPasswordValue = form.confirmPassword.trim();

    const newErrors = {
      username: "",
      password1: "",
      confirmPassword: "",
    };

    if (usernameValue === "") {
      newErrors.username = "Username is required";
    } else if (usernameValue.indexOf(" ") >= 0) {
      newErrors.username = "Username should not have whitespace";
    }

    if (passwordValue === "") {
      newErrors.password1 = "Password is required";
    } else if (passwordValue.length < 6) {
      newErrors.password1 = "Password must be at least 6 characters";
    }

    if (confirmPasswordValue === "") {
      newErrors.confirmPassword = "Password Confirmation is required";
    } else if (passwordValue !== confirmPasswordValue) {
      newErrors.confirmPassword = "Password does not match";
    }
    setErrors(newErrors);
  };

  const onSubmitForm = (event) => {
    event.preventDefault();

    validateInputs();

    const errmsgs = document.querySelectorAll(".errmessage");

    if (validateInputs && errmsgs.length === 0) {

      setLoading(true);

      const signUpForm = new FormData();
    
      signUpForm.append("username", form.username);
      signUpForm.append("password", form.password1);
      console.log(form.username);
      console.log(form.password1);

      fetch("http://127.0.0.1:8000/auth/register/", {
        method: "POST",
        body: signUpForm,
      })
        .then((response) => {
          if (response.ok) {
            console.log("User created!!");
            navigate("/login");
            return response.json();
          } else {
            setLoading(false);
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) =>{
          setLoading(false);
           console.log("Error: ", err)
          });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form action="" style={{ border: "none" }} onSubmit={onSubmitForm}>
          <div className={styles.center}>
            <div className={styles.header}>
              <img src={igLogo} alt="instagramLogo" className="instaLogo" />
            </div>
            <p className={styles.text}>
              Sign up to see photos and videos from your friends
            </p>
            <div className={styles.inputElement}>
              <input
                type="text"
                placeholder="Username"
                id="username"
                name="username"
                value={form.username}
                className={styles.inputText}
                onChange={handleFormFieldChange}
              />
              {/* {errors.username && (
                <div className={styles.errmessage}>{errors.username}</div>
              )} */}
              <input
                type="password"
                id="password1"
                name="password1"
                value={form.password1}
                placeholder="Password"
                className={styles.inputText}
                onChange={handleFormFieldChange}
              />
              {/* {errors.password1 && (
                <div className={styles.errmessage}>{errors.password1}</div>
              )} */}
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm password"
                className={styles.inputText}
                onChange={handleFormFieldChange}
              />
              {/* {errors.confirmPassword && (
                <div className={styles.errmessage}>
                  {errors.confirmPassword}
                </div>
              )} */}
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
                <span className={styles.tandd}>
                  <div className={styles.errmessage}>
                    {errors.username}
                    <br></br>
                    {errors.password1}
                    <br></br>
                    {errors.confirmPassword}
                  </div>
                </span>
              </div>
            </div>
            <div className={styles.footer}>
              <p>
                Already have an accout?
                <Link to="/login">
                  <span>Log In</span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default Signup
