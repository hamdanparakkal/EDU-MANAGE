import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import styles from "./Viewattendance.module.css";
import { 
  FaCalendarCheck, 
  FaCalendarXmark, 
  FaPercent, 
  FaCircleCheck, 
  FaTriangleExclamation,
  FaFileArrowUp,
  FaCreditCard,
  FaCircleInfo,
  FaListCheck
} from "react-icons/fa6";

const Viewattendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condonationPaid, setCondonationPaid] = useState(false);
  const [leaveBonus, setLeaveBonus] = useState(0);

  const navigate = useNavigate();
  const sid = sessionStorage.getItem("sid");
  const studentName = sessionStorage.getItem("studentName");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!sid) {
        setError("No student ID found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/attendance-by-student/${sid}`);
        const attendanceData = response.data.data || [];
        setAttendanceList(attendanceData);

        const paymentRes = await axios.get(`http://localhost:5000/payment-status/${sid}`);
        setCondonationPaid(paymentRes.data.condonationPaid);

        if (attendanceData.length > 0) {
          const semId = attendanceData[0]?.semId?._id;
          const leaveRes = await axios.get(`http://localhost:5000/leave/bonus/${sid}/${semId}`);
          setLeaveBonus(leaveRes.data.bonus);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load attendance records");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [sid]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric", weekday: "short" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalClasses = attendanceList.length;
  const presentCount = attendanceList.filter((a) => a.attendanceType === "Present").length;
  const absentCount = attendanceList.filter((a) => a.attendanceType === "Absent").length;

  let attendancePercent = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
  attendancePercent = attendancePercent + leaveBonus;
  if (attendancePercent > 100) attendancePercent = 100;
  attendancePercent = attendancePercent.toFixed(1);

  const semesterName = attendanceList[0]?.semId?.semName;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Analyzing attendance records...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Attendance Report</h1>
          <p>{studentName} • {semesterName || "Current Semester"}</p>
        </div>
        <div className={styles.actions}>
          {attendancePercent < 75 && (
            <div className={styles.warningChip}>
              <FaTriangleExclamation /> Low Attendance
            </div>
          )}
          <button className={styles.leaveBtn} onClick={() => navigate(`/student/leave/${sid}/${attendanceList[0]?.semId?._id}`)}>
            <FaFileArrowUp /> Medical Leave
          </button>
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.blue}`}>
            <FaListCheck />
          </div>
          <div className={styles.statInfo}>
            <label>Total Classes</label>
            <h3>{totalClasses}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.green}`}>
            <FaCalendarCheck />
          </div>
          <div className={styles.statInfo}>
            <label>Present Days</label>
            <h3>{presentCount}</h3>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.iconCircle} ${styles.red}`}>
            <FaCalendarXmark />
          </div>
          <div className={styles.statInfo}>
            <label>Absent Days</label>
            <h3>{absentCount}</h3>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.accent}`}>
          <div className={`${styles.iconCircle} ${styles.orange}`}>
            <FaPercent />
          </div>
          <div className={styles.statInfo}>
            <label>Attendance %</label>
            <h3>{attendancePercent}%</h3>
          </div>
          {leaveBonus > 0 && <span className={styles.bonusTag}>+{leaveBonus}% Bonus</span>}
        </div>
      </div>

      <div className={styles.contentBlock}>
        <div className={styles.blockHeader}>
          <h2><FaCircleInfo /> Attendance Status</h2>
          {attendancePercent < 70 ? (
            condonationPaid ? (
              <span className={styles.paidBadge}><FaCircleCheck /> Condonation Paid</span>
            ) : (
              <button className={styles.payBtn} onClick={() => navigate(`/student/payment/${sid}`)}>
                <FaCreditCard /> Pay Condonation
              </button>
            )
          ) : (
             <span className={styles.safeBadge}><FaCircleCheck /> Attendance Sufficient</span>
          )}
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span>Date</span>
            <span>Subject</span>
            <span>Period</span>
            <span style={{ textAlign: "right" }}>Status</span>
          </div>
          <div className={styles.tableBody}>
            {attendanceList.map((att) => (
              <div key={att._id} className={styles.tableRow}>
                <div className={styles.dateCell}>{formatDate(att.attendanceDate)}</div>
                <div className={styles.subjectCell}>{att.subjectId?.subjectName || "—"}</div>
                <div className={styles.periodCell}>Period {att.attendanceHour || "—"}</div>
                <div className={styles.statusCell}>
                  <span className={att.attendanceType === "Present" ? styles.present : styles.absent}>
                    {att.attendanceType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewattendance;