import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import styles from "./AddInternalmark.module.css";
import { Award, User, Hash, BookOpen, Calculator, Save } from "lucide-react";

const AddInternalmark = () => {
  const location = useLocation();
  const { studentId, studentName, studentRollno } = location.state || {};

  const [subjectId, setSubjectId] = useState("");
  const [internalmarkMark, setMark] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const internalmarkFull = "20";

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    axios.get(`http://localhost:5000/subjects-by-student/${studentId}`)
      .then((res) => { setSubjects(res.data.data || []); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectId || !internalmarkMark) { alert("Select subject and mark"); return; }
    try {
      await axios.post("http://localhost:5000/internalmark", { internalmarkMark, internalmarkFull, studentId, subjectId });
      alert("Internal mark saved successfully");
      setMark(""); setSubjectId("");
    } catch { alert("Error saving internal mark"); }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>
        <Award size={28} color="#4f46e5" /> Assessment Record
      </h2>

      <div className={styles.infoBox}>
        <span><User size={14} /> Student: <strong>{studentName}</strong></span>
        <span><Hash size={14} /> Roll: <strong>{studentRollno || "N/A"}</strong></span>
      </div>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label><BookOpen size={12} /> Academic Subject</label>
            <select className={styles.select} value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required disabled={loading}>
              <option value="">{loading ? "Loading subjects..." : "Select Subject"}</option>
              {subjects.map((s) => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label><Award size={12} /> Assessment Scale</label>
            <input type="text" className={styles.input} value="Max Marks: 20" readOnly />
          </div>

          <div className={styles.field}>
            <label><Calculator size={12} /> Score Obtained</label>
            <select className={styles.select} value={internalmarkMark} onChange={(e) => setMark(e.target.value)} required>
              <option value="">Select Score...</option>
              {[...Array(20)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} / 20</option>)}
            </select>
          </div>

          <button className={styles.button} type="submit" disabled={!subjectId || !internalmarkMark}>
            <Save size={18} style={{ marginRight: 8 }} /> Commit Assessment
          </button>
        </form>
      </div>

      {subjectId && internalmarkMark && (
        <div className={styles.summaryCard}>
          <h3>Record Preview</h3>
          <p><span>Subject</span> <strong>{subjects.find(s => s._id === subjectId)?.subjectName}</strong></p>
          <p><span>Final Score</span> <strong style={{ color: "#10b981", fontSize: 18 }}>{internalmarkMark} / 20</strong></p>
        </div>
      )}
    </div>
  );
};

export default AddInternalmark;