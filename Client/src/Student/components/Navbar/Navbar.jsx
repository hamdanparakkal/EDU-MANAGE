import React from "react";
import { Link } from "react-router";
import styles from "./Navbar.module.css";
import { 
  FaGraduationCap, 
  FaUser, 
  FaBars, 
  FaXmark, 
  FaBell, 
  FaGear,
  FaBolt
} from "react-icons/fa6";

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.toggleWrapper}>
          <button 
            className={`${styles.toggleBtn} ${sidebarOpen ? styles.toggleActive : ""}`} 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Sidebar"
          >
            <div className={styles.hamburger}>
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
              <span className={styles.bar}></span>
            </div>
          </button>
        </div>
        
        <Link to="/student/dashboard" className={styles.logo}>
          <div className={styles.iconWrapper}>
            <FaGraduationCap className={styles.icon} />
          </div>
          <span className={styles.title}>Edu<span className={styles.highlight}>Manage</span></span>
        </Link>
      </div>

      <div className={styles.right}>
       

        <button className={styles.actionBtn}>
          <FaBell size={18} />
          <span className={styles.badge}></span>
        </button>
        
        
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Student</span>
            
          </div>
          <div className={styles.avatar}>
            <FaUser size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
