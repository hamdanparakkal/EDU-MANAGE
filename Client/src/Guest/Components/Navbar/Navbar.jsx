import React from "react";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router";

const Navbar = () => {

const navigate = useNavigate();

return (

<div className={styles.navWrapper}>

<nav className={styles.container}>

<h2 className={styles.logo}>EduManage</h2>

<div className={styles.actions}>

<button onClick={() => navigate("/")}>Home</button>

<button onClick={() => navigate("/login")}>Login</button>

<button className={styles.teacher}
onClick={() => navigate("/registration")}>
Teacher
</button>

</div>

</nav>

</div>

);

};

export default Navbar;