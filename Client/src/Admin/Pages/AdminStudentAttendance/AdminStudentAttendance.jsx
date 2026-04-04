import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import styles from "./AdminStudentAttendance.module.css";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminStudentAttendance = () => {

  const { id } = useParams();

  const [attendance, setAttendance] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {

    const loadData = async () => {

      const studentRes = await axios.get(`http://localhost:5000/student/${id}`);
      setStudent(studentRes.data.data);

      const attendanceRes = await axios.get(
        `http://localhost:5000/attendance-by-student/${id}`
      );

      setAttendance(attendanceRes.data.data);

    };

    loadData();

  }, [id]);

  /* SUMMARY */

  const total = attendance.length;
  const present = attendance.filter(a => a.attendanceType === "Present").length;
  const absent = attendance.filter(a => a.attendanceType === "Absent").length;
  const percent = total ? ((present / total) * 100).toFixed(1) : 0;

  /* PIE CHART */

  const pieData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: ["#4CAF50", "#F44336"]
      }
    ]
  };

  /* MONTHLY GRAPH */

  const monthlyMap = {};

  attendance.forEach(a => {

    const month = new Date(a.attendanceDate).toLocaleString("default", {
      month: "short"
    });

    if (!monthlyMap[month]) {
      monthlyMap[month] = { present: 0, absent: 0 };
    }

    if (a.attendanceType === "Present") monthlyMap[month].present++;
    else monthlyMap[month].absent++;

  });

  const barData = {
    labels: Object.keys(monthlyMap),
    datasets: [
      {
        label: "Present",
        data: Object.values(monthlyMap).map(m => m.present),
        backgroundColor: "#4CAF50"
      },
      {
        label: "Absent",
        data: Object.values(monthlyMap).map(m => m.absent),
        backgroundColor: "#F44336"
      }
    ]
  };

  /* SUBJECT WISE */

  const subjectMap = {};

  attendance.forEach(a => {

    const sub = a.subjectId?.subjectName || "Unknown";

    if (!subjectMap[sub]) {
      subjectMap[sub] = { present: 0, total: 0 };
    }

    subjectMap[sub].total++;

    if (a.attendanceType === "Present") subjectMap[sub].present++;

  });

  /* ───────── Excel Download ───────── */

  const downloadExcel = () => {

    const data = Object.keys(subjectMap).map(sub => {

      const s = subjectMap[sub];
      const percent = ((s.present / s.total) * 100).toFixed(1);

      return {
        Subject: sub,
        Present: s.present,
        Total: s.total,
        Percentage: percent + "%"
      };

    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    const buf = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(
      new Blob([buf], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }),
      "Student_Attendance.xlsx"
    );

  };

  /* ───────── PDF Download ───────── */

  const downloadPDF = () => {

    const doc = new jsPDF();

    doc.text("Student Attendance Report", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["Subject", "Present", "Total", "%"]],
      body: Object.keys(subjectMap).map(sub => {

        const s = subjectMap[sub];
        const percent = ((s.present / s.total) * 100).toFixed(1);

        return [
          sub,
          s.present,
          s.total,
          percent + "%"
        ];

      })
    });

    doc.save("Student_Attendance_Report.pdf");

  };

  return (

    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h2 className={styles.title}><i className="fa-solid fa-calendar-check"></i> Attendance Analytics</h2>
          <p className={styles.subtitle}>Detailed student attendance breakdown and subject-wise performance.</p>
        </div>

        <div className={styles.downloadGroup}>
          <button className={styles.excelBtn} onClick={downloadExcel}>
            <i className="fa-solid fa-file-excel"></i> Excel
          </button>
          <button className={styles.pdfBtn} onClick={downloadPDF}>
            <i className="fa-solid fa-file-pdf"></i> PDF
          </button>
        </div>
      </header>

      <div className={styles.gridContainer}>
        {/* STUDENT PROFILE CARD */}
        {student && (
          <div className={styles.glassCard + ' ' + styles.profileCard}>
            <div className={styles.profileBanner}></div>
            <div className={styles.profileContent}>
              <div className={styles.avatarWrapper}>
                <img
                  src={`http://localhost:5000${student.studentPhoto}`}
                  alt={student.studentName}
                  className={styles.avatar}
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + student.studentName; }}
                />
              </div>
              <div className={styles.studentMeta}>
                <h3 className={styles.studentName}>{student.studentName}</h3>
                <p className={styles.studentInfo}>Roll No: {student.studentRollno}</p>
                <div className={styles.badges}>
                  <span className={styles.badge}>{student.className}</span>
                  <span className={styles.badge}>{student.semesterName}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY STATS */}
        <div className={styles.summaryGrid}>
          <div className={`${styles.glassCard} ${styles.statCard} ${styles.totalStat}`}>
            <div className={styles.statIcon}><i className="fa-solid fa-layer-group"></i></div>
            <div className={styles.statInfo}>
              <span>Total Classes</span>
              <h3>{total}</h3>
            </div>
          </div>
          <div className={`${styles.glassCard} ${styles.statCard} ${styles.presentStat}`}>
            <div className={styles.statIcon}><i className="fa-solid fa-user-check"></i></div>
            <div className={styles.statInfo}>
              <span>Present</span>
              <h3>{present}</h3>
            </div>
          </div>
          <div className={`${styles.glassCard} ${styles.statCard} ${styles.absentStat}`}>
            <div className={styles.statIcon}><i className="fa-solid fa-user-xmark"></i></div>
            <div className={styles.statInfo}>
              <span>Absent</span>
              <h3>{absent}</h3>
            </div>
          </div>
          <div className={`${styles.glassCard} ${styles.statCard} ${styles.percentStat}`}>
            <div className={styles.statIcon}><i className="fa-solid fa-percent"></i></div>
            <div className={styles.statInfo}>
              <span>Attendance</span>
              <h3>{percent}%</h3>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION */}
        <div className={styles.chartsGrid}>
          <div className={styles.glassCard}>
            <h3 className={styles.sectionTitle}>Attendance Overview</h3>
            <div className={styles.chartWrapper}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className={styles.glassCard}>
            <h3 className={styles.sectionTitle}>Monthly Trends</h3>
            <div className={styles.chartWrapper}>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* SUBJECT TABLE */}
        <div className={styles.glassCard}>
          <h3 className={styles.sectionTitle}>Subject Wise Breakdown</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Present</th>
                  <th>Total</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(subjectMap).map(sub => {
                  const s = subjectMap[sub];
                  const p = ((s.present / s.total) * 100).toFixed(1);
                  return (
                    <tr key={sub}>
                      <td className={styles.subjectName}>{sub}</td>
                      <td>{s.present}</td>
                      <td>{s.total}</td>
                      <td>
                        <div className={styles.progressCell}>
                          <div className={styles.progressBar}>
                            <div
                              className={styles.progressFill}
                              style={{
                                width: `${p}%`,
                                background: p > 75 ? '#16a34a' : p > 50 ? '#fb923c' : '#f43f5e'
                              }}
                            ></div>
                          </div>
                          <span className={styles.percentText}>{p}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );

};

export default AdminStudentAttendance;