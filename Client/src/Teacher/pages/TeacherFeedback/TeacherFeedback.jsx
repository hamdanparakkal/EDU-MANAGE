import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TeacherFeedback.module.css";
// Icons are now FontAwesome strings

const TeacherFeedback = () => {
    const [feedbackContent, setContent] = useState("");
    const [feedbackList, setFeedbackList] = useState([]);
    const teacherId = sessionStorage.getItem("tid");

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const res = await axios.get("http://localhost:5000/feedback");
            const filtered = res.data.data.filter(f => String(f.teacherId) === String(teacherId));
            setFeedbackList(filtered.reverse());
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!feedbackContent) return;
        try {
            await axios.post("http://localhost:5000/feedback", { feedbackContent, teacherId });
            setContent("");
            fetchFeedback();
            alert("Feedback submitted successfully");
        } catch { alert("Submission failed"); }
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <div className={styles.pageLeft}>
                    <h1 className={styles.pageTitle}>Support & Feedback</h1>
                    <p className={styles.pageSub}>Share your suggestions or report issues with the administration</p>
                </div>
            </div>

            <div className={styles.layout}>
                {/* Left: Submit Form */}
                <div className={styles.formCard}>
                    <div className={styles.cardIcon}><i className="fa-solid fa-message" style={{ fontSize: 24 }}></i></div>
                    <h3>Submit Feedback</h3>
                    <p>Your input helps us improve the teaching experience.</p>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.field}>
                            <label>Message Content</label>
                            <textarea placeholder="Tell us what's on your mind..." value={feedbackContent} maxLength={200} onChange={e => setContent(e.target.value)} required />
                            <div className={styles.charCount}>{feedbackContent.length}/200</div>
                        </div>
                        <button type="submit" className={styles.submitBtn} disabled={!feedbackContent}>
                            <i className="fa-solid fa-paper-plane" style={{ marginRight: 8 }}></i> Send Feedback
                        </button>
                    </form>
                </div>

                {/* Right: History */}
                <div className={styles.historyCard}>
                    <div className={styles.historyHeader}>
                        <h3><i className="fa-solid fa-table-list" style={{ marginRight: 6 }}></i> Feedback History</h3>
                        <span className={styles.countBadge}>{feedbackList.length} total</span>
                    </div>

                    <div className={styles.scrollBox}>
                        {feedbackList.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}><i className="fa-solid fa-comment-slash" style={{ fontSize: 40 }}></i></div>
                                <p>No feedback history found.</p>
                            </div>
                        ) : (
                            <div className={styles.list}>
                                {feedbackList.map((f, i) => (
                                    <div key={f._id} className={styles.item} style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className={styles.itemTop}>
                                            <span className={styles.date}>{new Date(f.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            <span className={f.feedbackStatus === "Resolved" ? styles.statusResolved : styles.statusPending}>
                                                {f.feedbackStatus === "Resolved" ? <i className="fa-solid fa-circle-check" style={{ marginRight: 4, fontSize: 12 }}></i> : <i className="fa-solid fa-clock" style={{ marginRight: 4, fontSize: 12 }}></i>}
                                                {f.feedbackStatus}
                                            </span>
                                        </div>
                                        <p className={styles.content}>{f.feedbackContent}</p>
                                        {f.adminReply && (
                                            <div className={styles.replyBox}>
                                                <div className={styles.replyHeader}><i className="fa-solid fa-reply" style={{ marginRight: 6, fontSize: 12 }}></i> Admin Response</div>
                                                <p>{f.adminReply}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherFeedback;