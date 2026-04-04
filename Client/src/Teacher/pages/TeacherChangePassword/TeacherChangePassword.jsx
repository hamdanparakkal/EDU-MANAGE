import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import styles from "./TeacherChangePassword.module.css";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const TeacherChangePassword = () => {
  const nav = useNavigate();
  const tid = sessionStorage.getItem("tid");
  if (!tid) return null;

  const [teacherpassword, setTeacherPassword] = useState("");
  const [teacheroldpassword, setTeacheroldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState({ old: false, new: false, confirm: false });

  useEffect(() => {
    axios.get(`http://localhost:5000/teacher/${tid}`).then((res) => {
      setTeacherPassword(res.data.data.teacherPassword);
    });
  }, [tid]);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!teacheroldpassword || !newpassword || !confirmpassword) { alert("All fields are required"); return; }
    if (teacherpassword !== teacheroldpassword) { alert("Old password does not match"); return; }
    if (newpassword !== confirmpassword) { alert("New password and confirm password do not match"); return; }

    try {
      const res = await axios.put(`http://localhost:5000/teacher/change-password/${tid}`, { newPassword: newpassword });
      alert(res.data.message || "Password updated successfully");
      setTeacheroldPassword(""); setNewPassword(""); setConfirmPassword("");
      nav("/teacher/teacherprofile");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  const toggle = (field) => setShow(p => ({ ...p, [field]: !p[field] }));

  const fields = [
    { key: "old", label: "Current Password", value: teacheroldpassword, setter: setTeacheroldPassword, placeholder: "Enter current password" },
    { key: "new", label: "New Password", value: newpassword, setter: setNewPassword, placeholder: "Enter new password" },
    { key: "confirm", label: "Confirm Password", value: confirmpassword, setter: setConfirmPassword, placeholder: "Re-enter new password" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Change Password</h1>
        <p className={styles.pageSub}>Keep your account secure with a strong password</p>
      </div>

      <div className={styles.layout}>
        {/* Security tips card */}
        <div className={styles.tipsCard}>
          <div className={styles.tipsIcon}><ShieldCheck size={28} /></div>
          <h3 className={styles.tipsTitle}>Security Tips</h3>
          <ul className={styles.tipsList}>
            <li>Use at least 8 characters</li>
            <li>Mix letters, numbers & symbols</li>
            <li>Don't reuse old passwords</li>
            <li>Never share your password</li>
          </ul>
        </div>

        {/* Form card */}
        <form className={styles.formCard} onSubmit={handleUpdatePassword}>
          {fields.map(f => (
            <div key={f.key} className={styles.fieldGroup}>
              <label className={styles.label}><Lock size={11} /> {f.label}</label>
              <div className={styles.inputWrap}>
                <input
                  className={styles.input}
                  type={show[f.key] ? "text" : "password"}
                  value={f.value}
                  maxLength={15}
                  placeholder={f.placeholder}
                  onChange={e => f.setter(e.target.value)}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => toggle(f.key)}>
                  {show[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          {/* strength indicator (visual only) */}
          <div className={styles.strengthWrap}>
            <div className={styles.strengthLabel}>Password Strength</div>
            <div className={styles.strengthBars}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} className={styles.strengthBar}
                  style={{ background: newpassword.length >= n * 3 ? (n <= 2 ? "#f59e0b" : "#10b981") : "#e2e8f0" }} />
              ))}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            <ShieldCheck size={15} style={{ marginRight: 8 }} /> Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherChangePassword;