import React from "react";
import { Link, useLocation } from "react-router";
import { useNavigate } from "react-router";
import styles from "./Sidebar.module.css";
import {
  FaChartLine,
  FaUser,
  FaUserPen,
  FaUnlockKeyhole,
  FaBookOpen,
  FaClipboardCheck,
  FaCheckDouble,
  FaMessage,
  FaTriangleExclamation,
  FaFaceSmile,
  FaRightFromBracket,
  FaChevronRight
} from "react-icons/fa6";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("sid");
    navigate("/");
  };

  const menuItems = [
    { path: "/student/", label: "Dashboard", icon: FaChartLine },
    { path: "/student/myprofile", label: "My Profile", icon: FaUser },
    { path: "/student/editprofile", label: "Edit Profile", icon: FaUserPen },
    { path: "/student/changepassword", label: "Security", icon: FaUnlockKeyhole },
    { path: "/student/viewnotes", label: "Study Notes", icon: FaBookOpen },
    { path: "/student/viewattendance", label: "Attendance", icon: FaClipboardCheck },
    { path: "/student/Viewinternalmark", label: "Performance", icon: FaCheckDouble },
    { path: "/student/studentchat", label: "Messages", icon: FaMessage },
    { path: "/student/complaint", label: "Complaint", icon: FaTriangleExclamation },
    { path: "/student/studentFeedback", label: "Feedback", icon: FaFaceSmile },
  ];

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.menuContainer}>
        <nav className={styles.menu}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.item} ${isActive ? styles.active : ""}`}
                onClick={() => {
                  if (window.innerWidth < 768) onClose();
                }}
              >
                <div className={styles.iconWrapper}>
                  <Icon size={20} />
                </div>
                <span className={styles.text}>{item.label}</span>
                {isActive && <div className={styles.activeIndicator} />}
                <FaChevronRight size={14} className={styles.arrow} />
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <div className={styles.logoutIconWrapper}>
              <FaRightFromBracket size={18} />
            </div>
            <span className={styles.text}>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

