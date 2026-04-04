import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import styles from "./Reply.module.css";

const Reply = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        complaintId,
        complaintTitle,
        complaintContent,
        studentName,
        studentId,
        className,
        departmentName,
    } = location.state || {};

    const [replyText, setReplyText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!replyText) {
            alert("Enter reply");
            return;
        }

        try {
            await axios.put(
                `http://localhost:5000/complaint-reply/${complaintId}`,
                {
                    complaintReply: replyText,
                }
            );

            alert("Reply Sent Successfully ✅");

            navigate("/admin/viewcomplaint");
        } catch (err) {
            console.error(err);
            alert("Error sending reply");
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Reply To Complaint</h2>

            <div className={styles.card}>
                <p><strong>Student:</strong> {studentName}</p>
                <p><strong>Class:</strong> {className}</p>
                <p><strong>Department:</strong> {departmentName}</p>


                <div className={styles.complaintBox}>
                    <h3>{complaintTitle}</h3>
                    <p>{complaintContent}</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <textarea
                        placeholder="Write your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                    />

                    <button type="submit" className={styles.submitBtn}>
                        Send Reply
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Reply;