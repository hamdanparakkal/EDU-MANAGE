import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ViewTeacher.module.css";

const ViewTeacher = () => {

    const [teachers, setTeachers] = useState([]);

    const loadTeachers = async () => {

        const res = await axios.get(
            "http://localhost:5000/admin/teachers"
        );

        setTeachers(res.data.data);

    };

    useEffect(() => {
        loadTeachers();
    }, []);


    const approveTeacher = async (id) => {

        await axios.put(
            `http://localhost:5000/admin/approve-teacher/${id}`
        );

        loadTeachers();

    };

    const rejectTeacher = async (id) => {

        await axios.put(
            `http://localhost:5000/admin/reject-teacher/${id}`
        );

        loadTeachers();

    };


    const getStatus = (status) => {

        if (status === 0) return "Pending";
        if (status === 1) return "Approved";
        if (status === 2) return "Rejected";

    };


    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h2 className={styles.title}><i className="fa-solid fa-chalkboard-teacher"></i> Teacher Management</h2>
                <p className={styles.subtitle}>Review and manage teacher accounts, approvals, and status.</p>
            </header>

            <div className={styles.teacherGrid}>
                {teachers.map((t) => (
                    <div key={t._id} className={styles.glassCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.avatarWrapper}>
                                <img
                                    src={`http://localhost:5000${t.teacherPhoto}`}
                                    alt={t.teacherName}
                                    className={styles.avatar}
                                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + t.teacherName; }}
                                />
                            </div>
                            <div className={styles.teacherMeta}>
                                <h3 className={styles.teacherName}>{t.teacherName}</h3>
                                <div className={`${styles.statusBadge} ${t.teacherStatus === 1 ? styles.approved : t.teacherStatus === 2 ? styles.rejected : styles.pending}`}>
                                    {getStatus(t.teacherStatus)}
                                </div>
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.infoRow}>
                                <i className="fa-solid fa-envelope"></i>
                                <span>{t.teacherEmail}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <i className="fa-solid fa-phone"></i>
                                <span>{t.teacherContact}</span>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            {t.teacherStatus !== 1 && (
                                <button
                                    className={styles.approveBtn}
                                    onClick={() => approveTeacher(t._id)}
                                    title="Approve Teacher"
                                >
                                    <i className="fa-solid fa-check"></i> Approve
                                </button>
                            )}

                            {t.teacherStatus !== 2 && (
                                <button
                                    className={styles.rejectBtn}
                                    onClick={() => rejectTeacher(t._id)}
                                    title="Reject Teacher"
                                >
                                    <i className="fa-solid fa-xmark"></i> Reject
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {teachers.length === 0 && (
                    <div className={styles.emptyState}>
                        <i className="fa-solid fa-user-slash"></i>
                        <p>No teachers found in the system.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewTeacher;