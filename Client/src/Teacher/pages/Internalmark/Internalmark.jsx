import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Internalmark.module.css";
import { useNavigate } from "react-router";
// Icons are now FontAwesome

const Internalmark = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tid = sessionStorage.getItem("tid");
    if (!tid) return;
    axios.get(`http://localhost:5000/teacher/students/${tid}`)
      .then((res) => setStudents(res.data.data))
      .catch(console.error);
  }, []);

  const handleAddInternalMark = (student) => {
    navigate("/teacher/addinternalmark", {
      state: {
        studentId: student.studentId,
        studentName: student.studentName,
        studentRollno: student.studentRollno,
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageLeft}>
          <h1 className={styles.pageTitle}>Internal Assessment</h1>
          <p className={styles.pageSub}>Evaluate student performance and enter marks</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} onClick={() => navigate("/teacher/studentregistration")}>
            <i className="fa-solid fa-user-plus"></i> New Registration
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><i className="fa-solid fa-award"></i></div>
          <p className={styles.emptyText}>No students assigned</p>
          <p className={styles.emptySub}>Assessment records will appear here after student assignment.</p>
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
                <div className={styles.chip}>Semester {s.semName}</div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.addBtn} onClick={() => handleAddInternalMark(s)}>
                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: 8 }}></i> Enter Marks
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Internalmark;