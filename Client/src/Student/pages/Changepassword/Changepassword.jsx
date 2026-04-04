import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./Changepassword.module.css";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldHalved,
  FaArrowLeft
} from "react-icons/fa6";
import Swal from "sweetalert2";

const Changepassword = () => {
    const nav = useNavigate();
    const sid = sessionStorage.getItem("sid");
    if (!sid) return null;

    const [studentPassword, setstudentPassword] = useState("");
    const [studentoldPassword, setstudentoldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/student/${sid}`).then((res) => {
            setstudentPassword(res.data.data.studentPassword);
        });
    }, [sid]);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        if (!studentoldPassword || !newPassword || !confirmPassword) {
            Swal.fire({ icon: "warning", title: "All fields are required" }); return;
        }
        if (studentoldPassword.length > 15 || newPassword.length > 15) {
            Swal.fire({ icon: "warning", title: "Password max length is 15" }); return;
        }
        if (studentPassword !== studentoldPassword) {
            Swal.fire({ icon: "error", title: "Current password is incorrect" }); return;
        }
        if (studentoldPassword === newPassword) {
            Swal.fire({ icon: "warning", title: "New password cannot be same as old" }); return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire({ icon: "error", title: "Passwords do not match" }); return;
        }

        try {
            setLoading(true);
            const res = await axios.put(
                `http://localhost:5000/student/change-password/${sid}`,
                { newPassword }
            );
            Swal.fire({ icon: "success", title: "Password Updated!", timer: 1500, showConfirmButton: false });
            setTimeout(() => nav("/student/myprofile"), 1600);
        } catch (err) {
            Swal.fire({ icon: "error", title: err.response?.data?.message || "Update failed" });
        } finally {
            setLoading(false);
        }
    };

    const strengthLevel = () => {
        if (!newPassword) return 0;
        let s = 0;
        if (newPassword.length >= 8) s++;
        if (/[A-Z]/.test(newPassword)) s++;
        if (/[0-9]/.test(newPassword)) s++;
        if (/[^A-Za-z0-9]/.test(newPassword)) s++;
        return s;
    };

    const strengthColors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
    const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
    const strength = strengthLevel();

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <button className={styles.backBtn} onClick={() => nav(-1)}>
                        <FaArrowLeft />
                    </button>
                    <div className={styles.headerIcon}>
                        <FaShieldHalved />
                    </div>
                    <div>
                        <h1 className={styles.title}>Account Security</h1>
                        <p className={styles.subtitle}>Update your password to keep your account safe</p>
                    </div>
                </div>

                <form className={styles.form} onSubmit={handleUpdatePassword}>
                    {/* Old Password */}
                    <div className={styles.inputGroup}>
                        <label><FaLock /> Current Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showOld ? "text" : "password"}
                                placeholder="Enter current password"
                                maxLength={15}
                                value={studentoldPassword}
                                onChange={(e) => setstudentoldPassword(e.target.value)}
                            />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowOld(!showOld)}>
                                {showOld ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className={styles.inputGroup}>
                        <label><FaLock /> New Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="Enter new password"
                                maxLength={15}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowNew(!showNew)}>
                                {showNew ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {newPassword && (
                            <div className={styles.strengthMeter}>
                                <div className={styles.strengthBars}>
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className={styles.bar} style={{ background: i <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)" }} />
                                    ))}
                                </div>
                                <span style={{ color: strengthColors[strength], fontSize: "12px" }}>
                                    {strengthLabels[strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className={styles.inputGroup}>
                        <label><FaLock /> Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm new password"
                                maxLength={15}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                <div className={styles.tips}>
                    <p className={styles.tipsTitle}>Password Tips</p>
                    <ul>
                        <li>Use at least 8 characters</li>
                        <li>Mix uppercase and lowercase letters</li>
                        <li>Include numbers and symbols</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Changepassword;