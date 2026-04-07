import React from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router";

const Navbar = () => {

const navigate = useNavigate();

return (

  <div className={styles.navWrapper}>
    <nav className={styles.container}>
      <div className={styles.logoGroup} onClick={() => navigate("/")}>
        <div className={styles.logoIcon}>
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <h2 className={styles.logoTitle}>Edu<span>Manage</span></h2>
      </div>

      <div className={styles.actions}>
        <button className={styles.navItem} onClick={() => navigate("/")}>Home</button>
        <button className={styles.loginBtn} onClick={() => navigate("/login")}>
          Sign In
        </button>
        <button className={styles.registerBtn} onClick={() => navigate("/registration")}>
          Join as Teacher <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

    </nav>
  </div>


);

};

export default Navbar;