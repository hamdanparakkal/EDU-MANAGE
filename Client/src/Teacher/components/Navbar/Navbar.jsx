import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.container}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6l-9-4z" /></svg>
        </div>
        <span className={styles.title}>Teacher Portal</span>
        <span className={styles.badge}>LMS</span>
      </div>

      <div className={styles.right}>
        <div className={styles.iconBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.dot}></span>
        </div>

        <div className={styles.sep} />

        <div className={styles.user}>
          {/* <div className={styles.avatarWrap}>
            <img src={img}  alt="Teacher" className={styles.avatar} />
          </div> */}
          <div className={styles.userInfo}>
            <div className={styles.uname}>Teacher User</div>
            <div className={styles.urole}>Instructor</div>
          </div>
          <svg className={styles.chev} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
