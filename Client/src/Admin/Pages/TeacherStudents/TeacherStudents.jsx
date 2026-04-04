import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import styles from "./TeacherStudents.module.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TeacherStudents = () => {

    const { state } = useLocation();
    const { teacherId, teacherName } = state;

    const [students, setStudents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        axios
            .get(`http://localhost:5000/teacher/students/${teacherId}`)
            .then((res) => setStudents(res.data.data))
            .catch(console.error);

    }, [teacherId]);

    /* ───────── Excel Download ───────── */

    const downloadExcel = () => {

        const data = students.map((s, i) => ({
            No: i + 1,
            Name: s.studentName,
            RollNo: s.studentRollno,
            Class: s.className,
            Year: s.yearName
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Students");

        const buf = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array"
        });

        saveAs(
            new Blob([buf], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }),
            "Teacher_Students.xlsx"
        );
    };

    /* ───────── PDF Download ───────── */

    const downloadPDF = () => {

        const doc = new jsPDF();

        doc.text(`Students Under ${teacherName}`, 14, 15);

        autoTable(doc, {
            startY: 22,
            head: [["#", "Name", "Roll No", "Class", "Year"]],
            body: students.map((s, i) => [
                i + 1,
                s.studentName,
                s.studentRollno,
                s.className,
                s.yearName
            ])
        });

        doc.save("Teacher_Students.pdf");
    };

    return (

        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h2 className={styles.title}><i className="fa-solid fa-graduation-cap"></i> Students Under {teacherName}</h2>
                    <p className={styles.subtitle}>Directly managed students and their academic records.</p>
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

            {students.length === 0 ? (
                <div className={styles.emptyState}>
                    <i className="fa-solid fa-user-slash"></i>
                    <p>No students assigned to this teacher yet.</p>
                </div>
            ) : (
                <div className={styles.studentGrid}>
                    {students.map((s) => (
                        <div key={s.studentId} className={styles.glassCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatarWrapper}>
                                    <img
                                        src={`http://localhost:5000${s.studentPhoto}`}
                                        alt={s.studentName}
                                        className={styles.avatar}
                                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + s.studentName; }}
                                    />
                                </div>
                                <div className={styles.studentMeta}>
                                    <h3 className={styles.studentName}>{s.studentName}</h3>
                                    <span className={styles.rollBadge}>Roll: {s.studentRollno}</span>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.infoRow}>
                                    <i className="fa-solid fa-chalkboard"></i>
                                    <span>{s.className}</span>
                                </div>
                                <div className={styles.infoRow}>
                                    <i className="fa-solid fa-calendar-alt"></i>
                                    <span>Batch {s.yearName}</span>
                                </div>
                            </div>

                            <button
                                className={styles.attendanceBtn}
                                onClick={() => navigate(`/admin/student-attendance/${s.studentId}`)}
                            >
                                <i className="fa-solid fa-chart-line"></i> View Attendance
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherStudents;