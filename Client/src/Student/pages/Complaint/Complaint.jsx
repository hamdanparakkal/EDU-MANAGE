import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Complaint.module.css";
import {
  FaTriangleExclamation,
  FaPaperPlane,
  FaTrash,
  FaCircleCheck,
  FaClock,
  FaComment,
  FaInbox
} from "react-icons/fa6";
import Swal from "sweetalert2";

const Complaint = () => {
  const [complaintTitle, setTitle] = useState("");
  const [complaintContent, setContent] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const sid = sessionStorage.getItem("sid");

  const fetchComplaints = () => {
    if (!sid) return;
    axios
      .get(`http://localhost:5000/complaint-by-student/${sid}`)
      .then((res) => setComplaints(res.data.data || []))
      .catch(console.error);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintContent.trim()) {
      Swal.fire({ icon: "warning", title: "Please fill all fields" }); return;
    }
    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/complaint", {
        complaintTitle,
        complaintContent,
        complaintReply: "Pending",
        studentId: sid,
      });
      Swal.fire({ icon: "success", title: "Complaint Submitted!", timer: 1400, showConfirmButton: false });
      setTitle(""); setContent("");
      fetchComplaints();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Submission failed" });
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this complaint?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete",
      background: "#0f1115",
      color: "#e2e8f0",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`http://localhost:5000/complaint/${id}`);
      fetchComplaints();
    } catch (err) { console.error(err); }
  };

  const getStatus = (reply) => (!reply || reply === "Pending" ? "Pending" : "Replied");

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerIcon}><FaTriangleExclamation /></div>
        <div>
          <h1>Support Center</h1>
          <p>Submit issues or concerns to the administration</p>
        </div>
      </header>

      {/* Form */}
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>New Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Title <span>{complaintTitle.length}/20</span></label>
            <input
              className={styles.input}
              placeholder="Brief title of your complaint"
              value={complaintTitle}
              maxLength={20}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Description <span>{complaintContent.length}/200</span></label>
            <textarea
              className={styles.textarea}
              placeholder="Describe your complaint in detail..."
              value={complaintContent}
              maxLength={200}
              rows={4}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className={styles.submitBtn} disabled={submitting}>
            <FaPaperPlane /> {submitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>

      {/* Complaint List */}
      <div className={styles.listHeader}>
        <h2><FaInbox /> My Complaints</h2>
        <span className={styles.count}>{complaints.length} total</span>
      </div>

      {complaints.length === 0 ? (
        <div className={styles.empty}>
          <FaInbox />
          <p>No complaints submitted yet</p>
        </div>
      ) : (
        <div className={styles.list}>
          {complaints.map((c) => {
            const status = getStatus(c.complaintReply);
            return (
              <div key={c._id} className={styles.card}>
                <div className={styles.cardTop}>
                  <h3 className={styles.cardTitle}>{c.complaintTitle}</h3>
                  <span className={status === "Pending" ? styles.pendingBadge : styles.repliedBadge}>
                    {status === "Pending" ? <FaClock /> : <FaCircleCheck />} {status}
                  </span>
                </div>

                <p className={styles.cardContent}>{c.complaintContent}</p>

                <div className={styles.replyBox}>
                  <div className={styles.replyLabel}><FaComment /> Admin Reply</div>
                  <p>{c.complaintReply || "Awaiting response..."}</p>
                </div>

                {status === "Pending" && (
                  <button className={styles.deleteBtn} onClick={() => handleDelete(c._id)}>
                    <FaTrash /> Delete
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Complaint;