import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ViewFeedback.module.css";

const ViewFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/admin/feedback")
            .then((res) => setFeedbacks(res.data.data || []))
            .catch(console.error);
    }, []);

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}><i className="fa-solid fa-comments"></i> Platform Feedback</h2>
                <p className={styles.subtitle}>Insights and feedback provided by students and teachers about the LMS.</p>
            </header>

            <div className={styles.feedbackGrid}>
                {feedbacks.length === 0 ? (
                    <div className={styles.emptyState}>
                        <i className="fa-solid fa-message-slash"></i>
                        <p>No feedback messages available yet.</p>
                    </div>
                ) : (
                    feedbacks.map((f) => {
                        const isStudent = !!f.studentId;
                        const senderName = isStudent ? f.studentId?.studentName : f.teacherId?.teacherName;
                        const senderPhoto = isStudent ? f.studentId?.studentPhoto : f.teacherId?.teacherPhoto;
                        const senderRole = isStudent ? "Student" : "Teacher";
                        const imageUrl = senderPhoto ? `http://localhost:5000${senderPhoto}` : null;

                        return (
                            <div key={f._id} className={styles.glassCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.senderInfo}>
                                        <div className={styles.avatarWrapper}>
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={senderName} className={styles.avatar} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                            ) : null}
                                            <div className={styles.initials} style={{ display: imageUrl ? 'none' : 'flex' }}>
                                                {(senderName || 'T')[0]}
                                            </div>
                                        </div>
                                        <div className={styles.senderMeta}>
                                            <h4 className={styles.senderName}>{senderName || "Teacher"}</h4>
                                            <div className={styles.roleTag}>
                                                <span className={`${styles.roleBadge} ${isStudent ? styles.studentRole : styles.teacherRole}`}>
                                                    {senderRole}
                                                </span>
                                                {isStudent && <span className={styles.rollNo}>• Roll: {f.studentId?.studentRollno}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.quoteIcon}>
                                        <i className="fa-solid fa-quote-right"></i>
                                    </div>
                                </div>

                                <div className={styles.feedbackContent}>
                                    <p>{f.feedbackContent}</p>
                                </div>

                                <div className={styles.cardFooter}>
                                    <span className={styles.timestamp}><i className="fa-regular fa-clock"></i> Recent Feedback</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ViewFeedback;