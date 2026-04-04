import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import GuestRouter from "../../../Router/GuestRouter";
import styles from "./GuestHome.module.css";

const GuestHome = () => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Navbar />
      </header>
      <main className={styles.content}>
        <GuestRouter />
      </main>
    </div>
  );
};

export default GuestHome;