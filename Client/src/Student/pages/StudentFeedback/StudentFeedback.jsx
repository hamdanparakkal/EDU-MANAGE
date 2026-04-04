import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StudentFeedback.module.css";
import { 
  FaMessage, 
  FaPaperPlane, 
  FaClockRotateLeft, 
  FaInbox,
  FaQuoteLeft
} from "react-icons/fa6";
import Swal from "sweetalert2";

const StudentFeedback = () => {
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = sessionStorage.getItem("sid");
  const teacherId = sessionStorage.getItem("tid");

  const fetchFeedback = () => {
    if (!studentId) return;
    axios
      .get(`http://localhost:5000/feedback-by-student/${studentId}`)
      .then((res) => setFeedbackList(res.data.data || []))
      .catch(console.error);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackContent.trim()) {
      Swal.fire("Wait!", "Please enter some feedback before submitting.", "warning");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/feedback", {
        feedbackContent,
        teacherId,
        studentId,
      });

      Swal.fire({
        title: "Submitted!",
        text: "Your feedback has been sent to your teacher.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
      setFeedbackContent("");
      fetchFeedback();
    } catch (err) {
      Swal.fire("Error", "Failed to submit feedback. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Share Feedback</h1>
          <p>Your suggestions and feedback help us improve the learning experience</p>
        </div>
      </header>

      <div className={styles.contentGrid}>
        <div className={styles.formSection}>
          <form onSubmit={handleSubmit} className={styles.feedbackForm}>
            <div className={styles.formHeader}>
              <FaMessage />
              <span>Compose Message</span>
            </div>
            <textarea
              placeholder="What's on your mind? Share your thoughts with your teacher..."
              value={feedbackContent}
              maxLength={200}
              onChange={(e) => setFeedbackContent(e.target.value)}
            />
            <div className={styles.formFooter}>
              <span className={styles.charCount}>{feedbackContent.length}/200</span>
              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? "Sending..." : <><FaPaperPlane /> Submit Feedback</>}
              </button>
            </div>
          </form>
        </div>

        <div className={styles.historySection}>
          <div className={styles.sectionHeader}>
            <FaClockRotateLeft />
            <span>Recent Feedback</span>
          </div>
          
          <div className={styles.feedbackList}>
            {feedbackList.length === 0 ? (
              <div className={styles.emptyState}>
                <FaInbox />
                <p>No feedback sent yet</p>
              </div>
            ) : (
              feedbackList.map((f) => (
                <div key={f._id} className={styles.feedbackCard}>
                  <div className={styles.cardDecoration}><FaQuoteLeft /></div>
                  <p className={styles.cardContent}>{f.feedbackContent}</p>
                  <div className={styles.cardMeta}>
                    <span>Sent via Student Portal</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeedback;