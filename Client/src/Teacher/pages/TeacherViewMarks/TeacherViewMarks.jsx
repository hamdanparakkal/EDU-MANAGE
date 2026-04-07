import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import styles from "./TeacherViewMarks.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  FileText, 
  Award, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  GraduationCap
} from "lucide-react";

const TeacherViewMarks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marksList, setMarksList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const fetchMarks = async () => {
      if (!id) {
        setError("No student ID found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/internalmark-by-student/${id}`);
        const data = response.data.data || [];
        setMarksList(data);
        if (data.length > 0) {
          setStudentName(data[0].studentId?.studentName || "Student");
        }
      } catch (err) {
        setError("Failed to load internal marks.");
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [id]);

  const totalSubjects = marksList.length;
  const totalObtained = marksList.reduce((acc, m) => acc + Number(m.internalmarkMark), 0);
  const totalFull = marksList.reduce((acc, m) => acc + Number(m.internalmarkFull), 0);
  const averagePercentage = totalFull > 0 ? ((totalObtained / totalFull) * 100).toFixed(1) : 0;

  const getGrade = (mark) => {
    const m = Number(mark);
    if (m >= 18) return { label: "A", color: "#10b981" };
    if (m >= 15) return { label: "B", color: "#6366f1" };
    if (m >= 10) return { label: "C", color: "#f59e0b" };
    return { label: "D", color: "#f43f5e" };
  };

  const downloadExcel = () => {
    const data = marksList.map((m, i) => ({
      No: i + 1,
      Subject: m.subjectId?.subjectName || "N/A",
      "Marks Obtained": m.internalmarkMark,
      "Full Marks": m.internalmarkFull,
      Percentage: ((Number(m.internalmarkMark) / Number(m.internalmarkFull)) * 100).toFixed(1) + "%"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Internal Marks");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `${studentName}_Marks_Report.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Internal Marks Report - ${studentName}`, 14, 15);
    doc.setFontSize(11);
    doc.text(`Overall Average: ${averagePercentage}%`, 14, 22);
    
    autoTable(doc, { 
      startY: 28, 
      head: [["#", "Subject", "Obtained", "Full", "%"]], 
      body: marksList.map((m, i) => [
        i + 1, 
        m.subjectId?.subjectName || "N/A", 
        m.internalmarkMark, 
        m.internalmarkFull,
        ((Number(m.internalmarkMark) / Number(m.internalmarkFull)) * 100).toFixed(1) + "%"
      ]) 
    });
    doc.save(`${studentName}_Marks_Report.pdf`);
  };

  if (loading) return (
    <div className={styles.loading}>
      <div className={styles.spinner}></div>
      <p>Loading performance data...</p>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className={styles.title}>Marks Registry</h2>
            <p className={styles.subtitle}>{studentName} • Academic Performance</p>
          </div>
        </div>
        <div className={styles.downloadGroup}>
          <button className={styles.excelBtn} onClick={downloadExcel}>
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button className={styles.pdfBtn} onClick={downloadPDF}>
            <FileText size={16} /> PDF
          </button>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.iconCircle}>
            <BookOpen size={20} color="#6366f1" />
          </div>
          <span>Subjects</span>
          <h3>{totalSubjects}</h3>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.iconCircle} style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
            <Award size={20} color="#10b981" />
          </div>
          <span>Total Score</span>
          <h3 style={{ color: '#10b981' }}>{totalObtained} / {totalFull}</h3>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.iconCircle} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
            <TrendingUp size={20} color="#f59e0b" />
          </div>
          <span>Average</span>
          <h3 style={{ color: '#f59e0b' }}>{averagePercentage}%</h3>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.iconCircle} style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
            <GraduationCap size={20} color="#a855f7" />
          </div>
          <span>Standing</span>
          <h3 style={{ color: '#a855f7' }}>
            {averagePercentage >= 75 ? "Excellent" : averagePercentage >= 60 ? "Good" : averagePercentage >= 40 ? "Average" : "Needs Improvement"}
          </h3>
        </div>
      </div>

      <div className={styles.marksContainer}>
        <div className={styles.listHeader}>
          <div>Subject Name</div>
          <div>Marks Obtained</div>
          <div>Full Marks</div>
          <div>Percentage</div>
          <div>Status</div>
        </div>
        
        {marksList.length === 0 ? (
          <div className={styles.empty}>
            <Award size={48} color="#cbd5e1" />
            <p>No internal marks recorded yet.</p>
          </div>
        ) : (
          marksList.map((m) => {
            const grade = getGrade(m.internalmarkMark);
            const percentage = ((Number(m.internalmarkMark) / Number(m.internalmarkFull)) * 100).toFixed(0);
            
            return (
              <div key={m._id} className={styles.row}>
                <div className={styles.subjectName}>
                  <div className={styles.subjectIcon}><BookOpen size={14} /></div>
                  {m.subjectId?.subjectName || "N/A"}
                </div>
                <div className={styles.marksValue}>
                  <strong>{m.internalmarkMark}</strong>
                </div>
                <div className={styles.fullMarks}>{m.internalmarkFull}</div>
                <div className={styles.percentage}>
                  <div className={styles.progressTrack}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${percentage}%`, background: grade.color }}
                    ></div>
                  </div>
                  <span>{percentage}%</span>
                </div>
                <div>
                  <span className={styles.statusBadge} style={{ color: grade.color, background: `${grade.color}15` }}>
                    <CheckCircle2 size={12} style={{ marginRight: 4 }} /> Verified
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TeacherViewMarks;
