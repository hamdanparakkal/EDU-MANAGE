import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Viewcomplaint.module.css";
import { useNavigate } from "react-router";

const Viewcomplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const navigate = useNavigate();

    const fetchComplaints = () => {
        axios
            .get("http://localhost:5000/admin/complaint")
            .then((res) => setComplaints(res.data.data || []))
            .catch(console.error);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}>
                    <i className="fa-solid fa-headset"></i> Student Complaints
                </h2>
                <p className={styles.subtitle}>
                    Review and respond to issues raised by students across departments.
                </p>
            </header>

            <div className={styles.complaintGrid}>
                {complaints.length > 0 ? (
                    complaints.map((c) => (
                        <div key={c._id} className={styles.glassCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.studentInfo}>
                                    <div className={styles.avatarWrapper}>
                                        <img
                                            src={`http://localhost:5000${c.studentId?.studentPhoto}`}
                                            alt={c.studentId?.studentName}
                                            className={styles.avatar}
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://ui-avatars.com/api/?name=" +
                                                    c.studentId?.studentName;
                                            }}
                                        />
                                    </div>

                                    <div className={styles.studentMeta}>
                                        <h4 className={styles.studentName}>
                                            {c.studentId?.studentName}
                                        </h4>
                                        <span className={styles.studentId}>
                                            Roll: {c.studentId?.studentRollno} • Class{" "}
                                            {c.studentId?.classId?.className}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`${styles.statusBadge} ${c.complaintReply && c.complaintReply.trim() !== "" ? styles.resolved : styles.pending
                                        }`}
                                >
                                    {c.complaintReply && c.complaintReply.trim() !== "" ? "Resolved" : "Pending"}
                                </div>
                            </div>

                            <div className={styles.complaintBody}>
                                <h3 className={styles.complaintTitle}>
                                    {c.complaintTitle}
                                </h3>

                                <p className={styles.complaintText}>
                                    {c.complaintContent}
                                </p>

                                <div className={styles.departmentTag}>
                                    <i className="fa-solid fa-building-columns"></i>{" "}
                                    {c.studentId?.classId?.courseId?.departmentId?.departmentName}
                                </div>
                            </div>

                            <div className={styles.replySection}>
                                <div className={styles.replyContent}>
                                    <strong>Response:</strong>
                                    <p>
                                        {c.complaintReply ||
                                            "This complaint is currently awaiting a response from the administration."}
                                    </p>
                                </div>

                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.replyBtn}
                                        onClick={() =>
                                            navigate("/admin/reply", {
                                                state: {
                                                    complaintId: c._id,
                                                    complaintTitle: c.complaintTitle,
                                                    complaintContent: c.complaintContent,
                                                    studentName: c.studentId?.studentName,
                                                    studentId: c.studentId?._id,
                                                    className: c.studentId?.classId?.className,
                                                    departmentName:
                                                        c.studentId?.classId?.courseId?.departmentId
                                                            ?.departmentName,
                                                },
                                            })
                                        }
                                    >
                                        <i className="fa-solid fa-reply"></i>{" "}
                                        {c.complaintReply ? "Edit Response" : "Send Reply"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <i className="fa-solid fa-clipboard-check"></i>
                        <p>No active complaints found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Viewcomplaint;