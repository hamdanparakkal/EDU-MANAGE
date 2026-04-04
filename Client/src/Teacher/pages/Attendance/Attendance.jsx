import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Attendance.module.css";
import { useNavigate } from "react-router";
// Icons are now FontAwesome

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tid = sessionStorage.getItem("tid");
    if (!tid) return;
    axios.get(`http://localhost:5000/teacher/students/${tid}`)
      .then((res) => { setStudents(res.data.data) })
      .catch(console.error);
  }, []);

  const handleAddAttendance = (student) => {
    navigate("/teacher/addattendance", {
      state: {
        studentId: student.studentId,
        studentName: student.studentName,
        semId: student.semId
      },
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageLeft}>
          <h1 className={styles.pageTitle}>Daily Attendance</h1>
          <p className={styles.pageSub}>Mark and track student presence and medical leaves</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnPrimary} onClick={() => navigate("/teacher/studentregistration")}>
            <i className="fa-solid fa-user-plus"></i> New Registration
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><i className="fa-solid fa-users"></i></div>
          <p className={styles.emptyText}>No students available</p>
          <p className={styles.emptySub}>Register students to begin marking attendance.</p>
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
                <div className={styles.chip}>Active Student</div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.addBtn} onClick={() => handleAddAttendance(s)}>
                  <i className="fa-solid fa-user-check" style={{ marginRight: 8 }}></i> Mark Attendance
                </button>
                <button className={styles.leaveBtn} onClick={() => navigate(`/teacher/viewmedical/${s.studentId}/${s.semId}`)}>
                  <i className="fa-solid fa-hospital-user" style={{ marginRight: 8 }}></i> Medical Records
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attendance;