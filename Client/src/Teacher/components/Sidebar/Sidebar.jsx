import React from "react";
import { Link, useLocation, useNavigate } from "react-router";
import styles from "./Sidebar.module.css";
// Icons are now FontAwesome strings

const navItems = [
  { to: "/teacher/", icon: "fa-house", label: "Dashboard", section: "Main" },
  { to: "/teacher/teacherprofile", icon: "fa-user-tie", label: "Profile", section: "Account" },
  { to: "/teacher/editprofile", icon: "fa-user-pen", label: "Edit Profile", section: "Account" },
  { to: "/teacher/changepassword", icon: "fa-shield-halved", label: "Security", section: "Account" },
  { to: "/teacher/studentregistration", icon: "fa-user-plus", label: "Registration", section: "Management" },
  { to: "/teacher/notes", icon: "fa-book-open", label: "Notes", section: "Management" },
  { to: "/teacher/mystudents", icon: "fa-users-viewfinder", label: "My Students", section: "Management" },
  { to: "/teacher/attendance", icon: "fa-clipboard-user", label: "Attendance", section: "Management" },
  { to: "/teacher/internalmark", icon: "fa-chart-column", label: "Internal Mark", section: "Academic" },
  { to: "/teacher/TeacherChatList", icon: "fa-comment-dots", label: "Chat", section: "Social" },
  { to: "/teacher/info", icon: "fa-circle-info", label: "Info", section: "Social" },
  { to: "/teacher/teacherFeedback", icon: "fa-message", label: "Feedback", section: "Social" },
];

const Sidebar = ({ isOpen, onOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("tid");
    navigate("/");
  };

  const sections = ["Main", "Account", "Management", "Academic", "Social"];

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <div className={styles.brand}>
        <div className={styles.brandIcon}>📚</div>
        {isOpen && <span className={styles.brandText}>Teacher Hub</span>}
      </div>

      <nav className={styles.nav}>
        {sections.map((section) => (
          <div key={section} className={styles.sectionGroup}>
            {isOpen && <div className={styles.sectionTitle}>{section}</div>}
            {navItems
              .filter((item) => item.section === section)
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`${styles.link} ${location.pathname === item.to ? styles.active : ""}`}
                  title={!isOpen ? item.label : ""}
                >
                  <span className={styles.icon}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </span>
                  {isOpen && <span className={styles.label}>{item.label}</span>}
                  {location.pathname === item.to && <div className={styles.activeIndicator} />}
                </Link>
              ))}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.logout} onClick={handleLogout} title={!isOpen ? "Logout" : ""}>
          <i className="fa-solid fa-right-from-bracket logoutIcon"></i>
          {isOpen && <span className={styles.label}>Sign Out</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
