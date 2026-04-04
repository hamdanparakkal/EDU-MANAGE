import React from "react";
import styles from "./Guestdashboard.module.css";

 const Guestdashboard = () => {
  return (
    <section className={styles.hero}>

      <div className={styles.glow}></div>

      <div className={styles.heroContent}>
        <h1>
          Smart <span>Education</span> Management
        </h1>

        <p>
          EduManage helps institutions manage students, departments,
          attendance and communication in a simple and modern digital platform.
        </p>

        <button className={styles.cta}>
          Explore Platform
        </button>
      </div>

      <div className={styles.images}>

        <div className={`${styles.imgCard} ${styles.img1}`}></div>
        <div className={`${styles.imgCard} ${styles.img2}`}></div>
        <div className={`${styles.imgCard} ${styles.img3}`}></div>
        <div className={`${styles.imgCard} ${styles.img4}`}></div>

      </div>

    </section>
  );
};

export default Guestdashboard;