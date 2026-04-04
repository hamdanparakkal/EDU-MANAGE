import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./ChangePassword.module.css";

const Changepassword = () => {
  const nav = useNavigate();
  const aid = sessionStorage.getItem("aid");
  if (!aid) return null;

  const [adminPassword, setadminPassword] = useState("");
  const [oldpassword, setoldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/admin/${aid}`).then((res) => {
      const u = res.data.data;
      console.log(u);

      setadminPassword(u.adminPassword);
    });
  }, [aid]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // ===== VALIDATIONS =====

    if (!oldpassword.trim()) {
      alert("Old password is required");
      return;
    }

    if (oldpassword.length > 15) {
      alert("Old password maximum length is 15");
      return;
    }

    if (!newpassword.trim()) {
      alert("New password is required");
      return;
    }

    if (newpassword.length > 15) {
      alert("New password maximum length is 15");
      return;
    }

    if (!confirmpassword.trim()) {
      alert("Confirm password is required");
      return;
    }

    if (confirmpassword.length > 15) {
      alert("Confirm password maximum length is 15");
      return;
    }

    if (adminPassword !== oldpassword) {
      alert("old password do not match");
      return;
    }

    if (newpassword === oldpassword) {
      alert("New password cannot be same as old password");
      return;
    }

    if (newpassword !== confirmpassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/admin/change-password/${aid}`,
        {
          newPassword: newpassword
        }
      );

      alert(res.data.message || "Password updated successfully");

      // clear fields
      setadminPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setoldPassword("");

      nav("/admin/myprofile");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to update password"
      );
    }
  };

  return (
    <div className={styles.editpage}>
      <header className={styles.header}>
        <h2 className={styles.title}>Update Security</h2>
        <p className={styles.subtitle}>Protect your account with a strong, unique password.</p>
      </header>

      <div className={styles.glassContainer}>
        <form className={styles.card} onSubmit={handleUpdatePassword}>
          <div className={styles.field}>
            <label><i className="fa-solid fa-lock"></i> Current Password</label>
            <input
              type="password"
              placeholder="Enter your current password"
              maxLength={15}
              onChange={(e) => setoldPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label><i className="fa-solid fa-key"></i> New Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters suggested"
              value={newpassword}
              maxLength={15}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label><i className="fa-solid fa-shield-check"></i> Confirm New Password</label>
            <input
              type="password"
              placeholder="Repeat your new password"
              value={confirmpassword}
              maxLength={15}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.save}>
              Update Password
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

export default Changepassword;