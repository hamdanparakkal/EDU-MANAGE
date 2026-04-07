import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Myprofile.module.css";
import { 
  FaEnvelope, 
  FaPhone, 
  FaCakeCandles, 
  FaLocationDot, 
  FaSchool, 
  FaCalendarDays, 
  FaChalkboardUser,
  FaIdCard
} from "react-icons/fa6";

const Myprofile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const sid = sessionStorage.getItem("sid");
    if (!sid) return;

    axios
      .get(`http://localhost:5000/student/${sid}`)
      .then((res) => setProfile(res.data.data))
      .catch(console.error);
  }, []);

  if (!profile) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Fetching your profile...</p>
      </div>
    );
  }

  const profileData = [
    { label: "Email Address", value: profile.studentEmail, icon: FaEnvelope },
    { label: "Contact Number", value: profile.studentContact, icon: FaPhone },
    { label: "Date of Birth", value: profile.studentDob ? new Date(profile.studentDob).toLocaleDateString() : "—", icon: FaCakeCandles },
    { label: "Address", value: profile.studentAddress, icon: FaLocationDot },
    { label: "Department / Class", value: profile.departmentName && profile.className ? `${profile.departmentName} / ${profile.className}` : profile.className || "—", icon: FaSchool },
    { label: "Academic Year", value: profile.academicYear || "—", icon: FaCalendarDays },
    { label: "Class Teacher", value: profile.classTeacher || "—", icon: FaChalkboardUser },
    { label: "Student ID", value: profile.studentRollno, icon: FaIdCard },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Student Profile</h1>
          <p>View and manage your personal and academic information</p>
        </div>
      </header>

      <div className={styles.profileGrid}>
        <div className={styles.idCard}>
          <div className={styles.cardHeader}>
            <div className={styles.chip}>STUDENT</div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.avatarWrapper}>
              <img
                src={`http://localhost:5000${profile.studentPhoto}`}
                alt="Student"
                className={styles.avatar}
              />
              <div className={styles.onlineStatus}></div>
            </div>
            <h2 className={styles.name}>{profile.studentName}</h2>
            <span className={styles.rollNo}>Roll No: {profile.studentRollno}</span>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.footerItem}>
              <span>Status</span>
              <strong>Active</strong>
            </div>
            <div className={styles.footerItem}>
              <span>Batch</span>
              <strong>{profile.academicYear || "2024-28"}</strong>
            </div>
          </div>
        </div>

        <div className={styles.detailsArea}>
          <div className={styles.detailsGrid}>
            {profileData.map((item, index) => (
              <div key={index} className={styles.detailCard}>
                <div className={styles.detailIcon}>
                  <item.icon />
                </div>
                <div className={styles.detailText}>
                  <label>{item.label}</label>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
