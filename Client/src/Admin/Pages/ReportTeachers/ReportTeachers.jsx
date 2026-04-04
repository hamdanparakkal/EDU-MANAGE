import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ReportTeachers.module.css";
import { useNavigate } from "react-router";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ReportTeachers = () => {

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]); // NEW

  const navigate = useNavigate();

  const loadTeachers = async () => {
    const res = await axios.get("http://localhost:5000/approvedteacher");
    setTeachers(res.data.data);
  };

  const loadClasses = async () => {
    const res = await axios.get("http://localhost:5000/class");
    setClasses(res.data.data);
  };

  const loadDepartments = async () => {
    const res = await axios.get("http://localhost:5000/department");
    setDepartments(res.data.data);
  };

  useEffect(() => {
    loadTeachers();
    loadClasses();
    loadDepartments(); // NEW
  }, []);

  const viewStudents = (teacher) => {
    navigate("/admin/teacherstudents", {
      state: {
        teacherId: teacher.teacherId,
        teacherName: teacher.teacherName
      }
    });
  };

  /* GET DEPARTMENT NAME */

  const getDepartment = (teacherId) => {

    const cls = classes.find(c => c.teacherId === teacherId);

    if (!cls) return "Not Assigned";

    const dept = departments.find(d => d._id === cls.departmentId);

    return dept ? dept.departmentName : "Unknown";

  };

  /* ───────── Excel Download ───────── */

  const downloadExcel = () => {

    const data = teachers.map((t, i) => ({
      No: i + 1,
      Name: t.teacherName,
      Email: t.teacherEmail,
      Contact: t.teacherContact,
      Department: getDepartment(t.teacherId)
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Teachers");

    const buf = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      "Teacher_Report.xlsx"
    );

  };

  /* ───────── PDF Download ───────── */

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text("Teacher Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["#", "Name", "Email", "Contact", "Department"]],
      body: teachers.map((t, i) => [
        i + 1,
        t.teacherName,
        t.teacherEmail,
        t.teacherContact,
        getDepartment(t.teacherId)
      ])
    });

    doc.save("Teacher_Report.pdf");

  };

  return (

    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h2 className={styles.title}><i className="fa-solid fa-file-invoice"></i> Teacher Reports</h2>
          <p className={styles.subtitle}>View detailed performance reports and managed student assignments.</p>
        </div>

        <div className={styles.downloadGroup}>
          <button className={styles.excelBtn} onClick={downloadExcel}>
            <i className="fa-solid fa-file-excel"></i> Export Excel
          </button>
          <button className={styles.pdfBtn} onClick={downloadPDF}>
            <i className="fa-solid fa-file-pdf"></i> Export PDF
          </button>
        </div>
      </header>

      <div className={styles.teacherGrid}>
        {teachers.map((t) => (
          <div key={t.teacherId} className={styles.glassCard}>
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
                <span className={styles.departmentName}>{getDepartment(t.teacherId)}</span>
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

            <button
              className={styles.viewBtn}
              onClick={() => viewStudents(t)}
            >
              <i className="fa-solid fa-users"></i> View Students
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportTeachers;