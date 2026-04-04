import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import styles from "./AddAttendance.module.css";
import { ClipboardCheck, User, Calendar, Clock, CheckCircle2, XCircle, Save } from "lucide-react";

const AddAttendance = () => {
  const location = useLocation();
  const { studentId, studentName, studentRollno, semId } = location.state || {};

  const [attendanceDate, setDate] = useState("");
  const [attendanceHour, setHour] = useState("");
  const [attendanceType, setType] = useState("");

  const [subjectId, setSubjectId] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    axios.get(`http://localhost:5000/subjects-by-student/${studentId}`)
      .then((res) => { setFilteredSubjects(res.data.data || []); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceType) { alert("Select Present or Absent"); return; }
    if (!subjectId) { alert("Please select a subject"); return; }
    try {
      const res = await axios.post("http://localhost:5000/attendance", {
        attendanceDate, attendanceHour, attendanceType, semId, studentId, subjectId,
      });
      alert(res.data.message);
      setHour(""); setType(""); setSubjectId("");
    } catch (err) { alert(err.response?.data?.message || "Error saving attendance"); }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>
        <ClipboardCheck size={28} color="#4f46e5" /> Record Attendance
      </h2>

      <div className={styles.infoBox}>
        <span><User size={14} /> Student: <strong>{studentName}</strong></span>
        <span><Calendar size={14} /> ID: <strong>{studentRollno || "N/A"}</strong></span>
      </div>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label><Calendar size={12} /> Date</label>
            <input type="date" className={styles.input} value={attendanceDate} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label><Clock size={12} /> Class Subject</label>
            <select className={styles.select} value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required disabled={loading}>
              <option value="">{loading ? "Loading subjects..." : "Select Subject"}</option>
              {filteredSubjects.map((s) => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label><Clock size={12} /> Select Period</label>
            <select className={styles.select} value={attendanceHour} onChange={(e) => setHour(e.target.value)} required>
              <option value="">Choose Period...</option>
              {[1, 2, 3, 4, 5, 6].map(num => <option key={num} value={num}>Period {num}</option>)}
            </select>
          </div>

          <div className={styles.toggleWrapper}>
            <button type="button" className={`${styles.toggleBtn} ${attendanceType === "Present" ? styles.activePresent : ""}`} onClick={() => setType("Present")}>
              <CheckCircle2 size={16} /> Present
            </button>
            <button type="button" className={`${styles.toggleBtn} ${attendanceType === "Absent" ? styles.activeAbsent : ""}`} onClick={() => setType("Absent")}>
              <XCircle size={16} /> Absent
            </button>
          </div>

          <button className={styles.button} type="submit" disabled={!subjectId || !attendanceHour || !attendanceType}>
            <Save size={18} style={{ marginRight: 8 }} /> Mark Recorded
          </button>
        </form>
      </div>

      {subjectId && attendanceHour && attendanceType && (
        <div className={styles.summaryCard}>
          <h3>Attendance Summary</h3>
          <p><span>Student</span> <strong>{studentName}</strong></p>
          <p><span>Subject</span> <strong>{filteredSubjects.find(s => s._id === subjectId)?.subjectName}</strong></p>
          <p><span>Status</span> <span className={attendanceType === "Present" ? styles.presentText : styles.absentText}>{attendanceType}</span></p>
        </div>
      )}
    </div>
  );
};

export default AddAttendance;