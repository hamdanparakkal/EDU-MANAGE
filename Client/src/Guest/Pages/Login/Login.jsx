import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import styles from "./Login.module.css";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please fill all fields");
      return;
    }

    try {

      const res = await axios.post("http://localhost:5000/login", {
        email,
        password
      });

      const { role, id, name } = res.data;

      // Admin login
      if (role === "admin") {
        sessionStorage.setItem("aid", id);
        sessionStorage.setItem("adminName", name);
        navigate("/admin/");
      }

      // Teacher login
      else if (role === "teacher") {
        sessionStorage.setItem("tid", id);
        sessionStorage.setItem("teacherName", name);
        navigate("/teacher/");
      }

      // Student login
      else if (role === "student") {
        sessionStorage.setItem("sid", id);
        sessionStorage.setItem("studentName", name);
        navigate("/student/");
      }

    } catch (err) {

      if (err.response) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Login failed. Please try again.");
      }

      console.error(err);
    }

  };

  return (
    <div className={styles.page}>
      <div className={styles.blurBlob}></div>
      <div className={styles.card}>


        <h2>Login</h2>
        <p className={styles.subtitle}>Please login to continue</p>

        {/* MESSAGE BOX */}
        {errorMessage && (
          <div className={styles.errorBox}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              maxLength={30}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              maxLength={15}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              required
            />
          </div>

          <button type="submit" className={styles.loginBtn}>
            Login
          </button>

        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <p className={styles.registerText}>
          Not registered as teacher?{" "}
          <Link to="/registration" className={styles.registerLink}>
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;