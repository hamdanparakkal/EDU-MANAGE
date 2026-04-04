import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyProfile.module.css";

const Myprofile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const aid = sessionStorage.getItem("aid");
    if (!aid) return;

    axios
      .get(`http://localhost:5000/admin/${aid}`)
      .then((res) => setProfile(res.data.data))
      .catch(console.error);
  }, []);

  if (!profile) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* Background decoration elements */}
      <div className={styles.bgDecor1}></div>
      <div className={styles.bgDecor2}></div>

      <div className={styles.profileCard}>
        {/* Banner Section */}
        <div className={styles.banner}>
          <div className={styles.bannerOverlay}></div>
        </div>

        {/* Profile Header with Avatar */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <div className={styles.statusDot}></div>
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.adminName}>{profile.adminName}</h1>
            <p className={styles.adminRoleLabel}>Full Access Administrator</p>
          </div>
        </div>

        {/* Information Section */}
        <div className={styles.contentSection}>
          <div className={styles.sectionTitle}>
            <i className="fa-solid fa-id-card"></i> Account Details
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className={styles.itemData}>
                <span>Email Address</span>
                <p>{profile.adminEmail}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div className={styles.itemData}>
                <span>Security Role</span>
                <p className={styles.roleBadge}>Administrator</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconBox}>
                <i className="fa-solid fa-key"></i>
              </div>
              <div className={styles.itemData}>
                <span>Account Status</span>
                <p className={styles.statusText}>Active & Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className={styles.footer}>
          <p>LMS Admin Management System • 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
