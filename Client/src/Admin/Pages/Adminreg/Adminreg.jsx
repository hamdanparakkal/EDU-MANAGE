import React, { useEffect, useState } from "react";
import styles from "./Adminreg.module.css";
import Button from "@mui/material/Button";
import axios from "axios";

const Adminreg = () => {
    const [adminreg, setAdminreg] = useState("");
    const [adminregEmail, setAdminregEmail] = useState("");
    const [adminregPassword, setAdminregPassword] = useState("");
    const [adminregConformPassword, setAdminregConformPassword] = useState("");
    const [adminregRows, setAdminregRows] = useState([]);
    const [adminregEdit, setAdminregEdit] = useState(null);

    const handleSave = async () => {

        // ===== VALIDATIONS =====

        if (!adminreg.trim()) {
            alert("Admin name is required");
            return;
        }

        if (adminreg.length > 15) {
            alert("Admin name maximum length is 15");
            return;
        }

        if (!adminregEmail.trim()) {
            alert("Email is required");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(adminregEmail)) {
            alert("Enter a valid email");
            return;
        }

        if (adminregEmail.length > 30) {
            alert("Email maximum length is 30");
            return;
        }

        if (!adminregPassword) {
            alert("Password is required");
            return;
        }

        if (adminregPassword.length > 15) {
            alert("Password maximum length is 15");
            return;
        }

        if (!adminregConformPassword) {
            alert("Confirm password is required");
            return;
        }

        if (adminregPassword !== adminregConformPassword) {
            alert("Passwords do not match");
            return;
        }

        const data = {
            adminName: adminreg,
            adminEmail: adminregEmail,
            adminPassword: adminregPassword,
        };

        if (adminregEdit === null) {
            axios.post("http://localhost:5000/admin", data).then((res) => {
                setAdminreg("")
                setAdminregEmail("")
                setAdminregPassword("")
                setAdminregConformPassword("")
                setAdminregEdit("")
                fetchAdminreg();
                alert(res.data.message);
            });
        } else {
            axios
                .put(`http://localhost:5000/admin/${adminregEdit}`, data)
                .then((res) => {

                    setAdminreg("")
                    setAdminregEmail("")
                    setAdminregPassword("")
                    setAdminregConformPassword("")
                    setAdminregEdit("")
                    fetchAdminreg();
                    alert(res.data.message);
                })
                .catch((err) => console.error(err));
        }
    };

    const fetchAdminreg = async () => {
        try {
            const res = await axios.get("http://localhost:5000/admin");
            setAdminregRows(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditfetch = (row) => {

        setAdminregEdit(row.adminId);
        setAdminreg(row.adminName);
        setAdminregEmail(row.adminEmail);

    };

    const handleDelete = (id) => {
        axios
            .delete(`http://localhost:5000/admin/${id}`)
            .then((res) => {
                alert(res.data.message);
                fetchAdminreg();
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchAdminreg();
    }, []);

    const handleCancel = () => {
        setAdminreg("")
        setAdminregEmail("")
        setAdminregPassword("")
        setAdminregConformPassword("")
        setAdminregEdit("")
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}><i className="fa-solid fa-user-shield"></i> Admin Management</h2>
                <p className={styles.subtitle}>Create and manage administrator accounts for the LMS platform.</p>
            </header>

            <div className={styles.contentGrid}>
                {/* REGISTRATION FORM */}
                <div className={styles.glassCard}>
                    <h3 className={styles.cardTitle}>{adminregEdit ? "Modify Admin" : "Register Admin"}</h3>

                    <div className={styles.form}>
                        <div className={styles.field}>
                            <label>Full Name</label>
                            <div className={styles.inputWrapper}>
                                <i className="fa-solid fa-user"></i>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    value={adminreg}
                                    maxLength={15}
                                    onChange={(e) => setAdminreg(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Email Address</label>
                            <div className={styles.inputWrapper}>
                                <i className="fa-solid fa-envelope"></i>
                                <input
                                    type="email"
                                    placeholder="admin@lms.com"
                                    value={adminregEmail}
                                    maxLength={30}
                                    onChange={(e) => setAdminregEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.field}>
                                <label>Password</label>
                                <div className={styles.inputWrapper}>
                                    <i className="fa-solid fa-lock"></i>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        value={adminregPassword}
                                        maxLength={15}
                                        onChange={(e) => setAdminregPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Confirm</label>
                                <div className={styles.inputWrapper}>
                                    <i className="fa-solid fa-shield-check"></i>
                                    <input
                                        type="password"
                                        placeholder="********"
                                        value={adminregConformPassword}
                                        maxLength={15}
                                        onChange={(e) => setAdminregConformPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button className={styles.cancelBtn} onClick={handleCancel}>
                                Clear
                            </button>
                            <button className={styles.submitBtn} onClick={handleSave}>
                                {adminregEdit ? "Update Changes" : "Create Account"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ADMIN LIST */}
                <div className={styles.glassCard}>
                    <h3 className={styles.cardTitle}>System Administrators</h3>

                    <div className={styles.listWrapper}>
                        {adminregRows.length > 0 ? (
                            <div className={styles.listGrid}>
                                {adminregRows.map((row, index) => (
                                    <div key={row._id} className={styles.listRow}>
                                        <div className={styles.rowInfo}>
                                            <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                                            <div>
                                                <span className={styles.rowName}>{row.adminName}</span>
                                                <span className={styles.rowEmail}>{row.adminEmail}</span>
                                            </div>
                                        </div>

                                        <div className={styles.rowActions}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => handleEditfetch(row)}
                                                title="Edit Admin"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete(row.adminId)}
                                                title="Delete Admin"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.empty}>
                                <i className="fa-solid fa-users-slash"></i>
                                <p>No other admins found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adminreg;