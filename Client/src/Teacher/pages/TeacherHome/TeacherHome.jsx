import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TeacherRouter from "../../../Router/TeacherRouter";
import styles from "./TeacherHome.module.css";

const TeacherHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Navbar />
      </header>

      <div className={styles.bottomArea}>
        <Sidebar
          isOpen={sidebarOpen}
          onOpen={() => setSidebarOpen(true)}
          onClose={() => setSidebarOpen(false)}
        />

        <main
          className={`${styles.main} ${sidebarOpen ? styles.expanded : styles.collapsed
            }`}
        >
          <div className={styles.contentWrapper}>
            <TeacherRouter />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherHome;
