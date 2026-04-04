import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Viewinternalmark.module.css";
import { 
  FaChartLine, 
  FaGraduationCap, 
  FaBookOpen, 
  FaAward, 
  FaCircleCheck,
  FaArrowTrendUp
} from "react-icons/fa6";

const Viewinternalmark = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const sid = sessionStorage.getItem("sid");
  const studentName = sessionStorage.getItem("studentName");

  useEffect(() => {
    if (!sid) return;

    axios
      .get(`http://localhost:5000/internalmark-by-student/${sid}`)
      .then((res) => {
        setMarks(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [sid]);

  const getGrade = (mark) => {
    const m = Number(mark);
    if (m >= 18) return { label: "A", color: "#43e97b" };
    if (m >= 15) return { label: "B", color: "#4facfe" };
    if (m >= 10) return { label: "C", color: "#f093fb" };
    return { label: "D", color: "#ef4444" };
  };

  const average =
    marks.length === 0
      ? 0
      : (
          (marks.reduce((acc, m) => acc + Number(m.internalmarkMark), 0) /
            (marks.length * 20)) *
          100
        ).toFixed(1);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Crunching the numbers...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Academic Performance</h1>
          <p>{studentName} • Internal Assessment Overview</p>
        </div>
        <div className={styles.badge}>
          <FaAward /> Academic Year 2024-25
        </div>
      </header>

      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={`${styles.iconCircle} ${styles.blue}`}>
            <FaBookOpen />
          </div>
          <div className={styles.summaryInfo}>
            <label>Evaluated Subjects</label>
            <h3>{marks.length}</h3>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={`${styles.iconCircle} ${styles.orange}`}>
            <FaChartLine />
          </div>
          <div className={styles.summaryInfo}>
            <label>GPA / Class Average</label>
            <h3>{average}%</h3>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={`${styles.iconCircle} ${styles.green}`}>
            <FaArrowTrendUp />
          </div>
          <div className={styles.summaryInfo}>
            <label>Overall Standing</label>
            <h3>Excellent</h3>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {marks.map((m) => {
          const percent = (Number(m.internalmarkMark) / Number(m.internalmarkFull)) * 100;
          const grade = getGrade(m.internalmarkMark);

          return (
            <div key={m._id} className={styles.subjectCard}>
              <div className={styles.cardTop}>
                <div className={styles.subjectIcon}>
                   <FaGraduationCap />
                </div>
                <div className={styles.gradeBadge} style={{ background: `${grade.color}20`, color: grade.color }}>
                  Grade {grade.label}
                </div>
              </div>

              <h3 className={styles.subjectTitle}>{m.subjectId?.subjectName}</h3>
              
              <div className={styles.scoreRow}>
                <span className={styles.scoreText}>
                  <strong>{m.internalmarkMark}</strong> / {m.internalmarkFull}
                </span>
                <span className={styles.percentText}>{percent.toFixed(0)}%</span>
              </div>

              <div className={styles.progressContainer}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${percent}%`, background: grade.color }}
                ></div>
              </div>

              <div className={styles.cardFooter}>
                 <span><FaCircleCheck /> Internal verified</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Viewinternalmark;