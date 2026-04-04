import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./EditProfile.module.css";

const Editprofile = () => {
  const nav = useNavigate();
  const aid = sessionStorage.getItem("aid");
  if (!aid) return null;

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  /* FETCH ADMIN PROFILE */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/admin/${aid}`)
      .then((res) => {
        const a = res.data.data;
        setAdminName(a.adminName);
        setAdminEmail(a.adminEmail);
      })
      .catch(console.error);
  }, [aid]);

  /* SAVE */
  const handleSave = async (e) => {
    e.preventDefault();

    /* VALIDATION */

    if (!adminName.trim()) {
      alert("Name is required");
      return;
    }

    const namePattern = /^[A-Za-z\s]+$/;
    if (!namePattern.test(adminName)) {
      alert("Name must contain letters only");
      return;
    }

    if (!adminEmail.trim()) {
      alert("Email is required");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(adminEmail)) {
      alert("Enter a valid email");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/admin/${aid}`, {
        adminName,
        adminEmail
      });

      alert("Profile updated");
      nav("/admin/myprofile");
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className={styles.editpage}>
      <header className={styles.header}>
        <h2 className={styles.title}>Account Settings</h2>
        <p className={styles.subtitle}>Update your profile information and public identity.</p>
      </header>

      <div className={styles.glassContainer}>
        <form className={styles.card} onSubmit={handleSave}>
          <div className={styles.field}>
            <label><i className="fa-solid fa-signature"></i> Full Name</label>
            <input
              value={adminName}
              maxLength={15}
              placeholder="e.g. John Doe"
              onChange={(e) => setAdminName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label><i className="fa-solid fa-envelope"></i> Email Address</label>
            <input
              value={adminEmail}
              maxLength={30}
              placeholder="admin@example.com"
              onChange={(e) => setAdminEmail(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.save}>
              Save Changes
            </button>
            <button type="button" className={styles.cancel} onClick={() => nav("/admin/myprofile")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editprofile;