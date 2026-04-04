import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./MyStudents.module.css";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Icons are now FontAwesome strings

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [sems, setSems] = useState([]);
  const [selectedSem, setSelectedSem] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const tid = sessionStorage.getItem("tid");
    if (!tid) return;
    axios.get(`http://localhost:5000/teacher/students/${tid}`).then((res) => setStudents(res.data.data)).catch(console.error);
    axios.get("http://localhost:5000/sem").then((res) => setSems(res.data.data)).catch(console.error);
  }, []);

  const isSemSix = students.length > 0 && students[0].semName === "6";

  const handleUpdateSem = async () => {
    const teacherId = sessionStorage.getItem("tid");
    if (!selectedSem) { setMessage("Please select a semester"); return; }
    try {
      await axios.put("http://localhost:5000/students/update-sem", { teacherId, semId: selectedSem });
      setMessage("Semester updated successfully");
      setTimeout(() => window.location.reload(), 1200);
    } catch { setMessage("Semester update failed"); }
  };

  const handleFinish = async () => {
    const teacherId = sessionStorage.getItem("tid");
    try {
      await axios.put("http://localhost:5000/students/finish", { teacherId });
      setMessage("All students marked as completed");
      setTimeout(() => window.location.reload(), 1200);
    } catch { setMessage("Failed to finish students"); }
  };

  const downloadExcel = () => {
    const data = students.map((s, i) => ({ No: i + 1, Name: s.studentName, RollNo: s.studentRollno, Class: s.className, Year: s.yearName, Semester: s.semName }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "My_Students.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("My Students Report", 14, 15);
    autoTable(doc, {
      startY: 22, head: [["#", "Name", "Roll No", "Class", "Year", "Semester"]],
      body: students.map((s, i) => [i + 1, s.studentName, s.studentRollno, s.className, s.yearName, s.semName])
    });
    doc.save("My_Students_Report.pdf");
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageLeft}>
          <h1 className={styles.pageTitle}>My Students</h1>
          <p className={styles.pageSub}>Manage and track your assigned students</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnOutline} onClick={downloadExcel}><i className="fa-solid fa-file-excel" style={{ marginRight: 8 }}></i> Export Excel</button>
          <button className={styles.btnOutline} onClick={downloadPDF}><i className="fa-solid fa-file-pdf" style={{ marginRight: 8 }}></i> Export PDF</button>
          <button className={styles.btnPrimary} onClick={() => setShowUpdate(!showUpdate)}><i className="fa-solid fa-rotate" style={{ marginRight: 8 }}></i> Update Semester</button>
          {isSemSix && <button className={styles.btnDanger} onClick={handleFinish}><i className="fa-solid fa-graduation-cap" style={{ marginRight: 8 }}></i> Mark Graduate</button>}
        </div>
      </div>

      {message && (
        <div className={styles.message}>
          <i className="fa-solid fa-circle-check" style={{ marginRight: 8 }}></i> {message}
        </div>
      )}

      {showUpdate && (
        <div className={styles.semPanel}>
          <i className="fa-solid fa-graduation-cap" style={{ color: "#4f46e5", fontSize: 20 }}></i>
          <select className={styles.select} value={selectedSem} onChange={(e) => setSelectedSem(e.target.value)}>
            <option value="">Choose new semester...</option>
            {sems.map((s) => <option key={s._id} value={s._id}>{s.semName}</option>)}
          </select>
          <button className={styles.btnPrimary} onClick={handleUpdateSem}>Apply Update</button>
        </div>
      )}

      {students.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><i className="fa-solid fa-users" style={{ fontSize: 40 }}></i></div>
          <p className={styles.emptyText}>No students assigned</p>
          <p className={styles.emptySub}>Assigned students will appear in this directory once registered.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {students.map((s, i) => (
            <div key={s.studentId} className={styles.card} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={styles.photoWrap}>
                {s.studentPhoto ? (
                  <img
                    src={`http://localhost:5000${s.studentPhoto}`}
                    alt={s.studentName}
                    className={styles.photo}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://ui-avatars.com/api/?name=" + s.studentName + "&background=6366f1&color=fff&size=128";
                    }}
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <i className="fa-solid fa-user-tie" style={{ fontSize: 40 }}></i>
                  </div>
                )}
              </div>
              <div className={styles.info}>
                <h4>{s.studentName}</h4>
                <p>Roll No: {s.studentRollno}</p>
                <p>{s.className} • {s.yearName}</p>
                <div className={styles.chip}>Semester {s.semName}</div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.viewBtn} onClick={() => navigate(`/teacher/teacherviewattendance/${s.studentId}`)}>
                  View Attendance <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }}></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStudents;