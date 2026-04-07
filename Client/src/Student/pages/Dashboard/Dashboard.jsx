import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


import styles from "./Dashboard.module.css";
import { 
  FaBook, 
  FaFileLines, 
  FaCalendarCheck, 
  FaChartPie, 
  FaClock, 
  FaChevronLeft, 
  FaChevronRight,
  FaCircleCheck,
  FaBell
} from "react-icons/fa6";
import dayjs from "dayjs";

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [studentName, setStudentName] = useState("Student");
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState({
    enrolledCourses: 0,
    assignments: 0,
    pendingTasks: 0,
    attendance: "0%",
    activities: [],
    deadlines: []
  });

  useEffect(() => {
    fetchStudentDashboard();
  }, []);

  const fetchStudentDashboard = async () => {
    try {
      const sid = sessionStorage.getItem("sid");
      if (!sid) return;

      const [resStudent, resSubjects, resNotes, resAttendance, resMarks, resInfo] = await Promise.all([
        axios.get(`http://localhost:5000/student/${sid}`),
        axios.get(`http://localhost:5000/subjects-by-student/${sid}`),
        axios.get("http://localhost:5000/notes"),
        axios.get(`http://localhost:5000/attendance-by-student/${sid}`),
        axios.get(`http://localhost:5000/internalmark-by-student/${sid}`),
        axios.get("http://localhost:5000/info")
      ]);

      const profile = resStudent.data.data;
      if (profile) setStudentName(profile.studentName);

      // Fetch leave bonus
      let bonus = 0;
      if (profile?.semId) {
        try {
          const resBonus = await axios.get(`http://localhost:5000/leave/bonus/${sid}/${profile.semId}`);
          bonus = resBonus.data.bonus || 0;
        } catch (e) {
          console.error("Bonus fetch error", e);
        }
      } else {
        // Fallback: try to get semId from attendance if profile.semId is missing
        const firstAtt = resAttendance.data.data?.[0];
        if (firstAtt?.semId?._id) {
          try {
            const resBonus = await axios.get(`http://localhost:5000/leave/bonus/${sid}/${firstAtt.semId._id}`);
            bonus = resBonus.data.bonus || 0;
          } catch (e) { console.error(e); }
        }
      }


      // Already filtered by backend
      const mySubjects = resSubjects.data.data || [];
      const myAttendance = resAttendance.data.data || [];
      const myMarks = resMarks.data.data || [];
      
      // Filter notes by student's subjects
      const myNotes = (resNotes.data.data || []).filter(n => mySubjects.some(sub => sub._id === n.subjectId));


      // Calculate attendance %
      const totalDays = myAttendance.length;
      const presentDays = myAttendance.filter(a => a.attendanceType === "Present").length;
      let rawPct = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
      let attendancePct = Math.min(100, Math.round(rawPct + bonus));


      setStudentData({
        enrolledCourses: mySubjects.length,
        assignments: myNotes.length,
        pendingTasks: mySubjects.length - myMarks.length,
        attendance: `${attendancePct}%`,
        activities: myMarks.slice(0, 3).map(m => ({
          text: `Mark added: ${m.subjectId?.subjectName || "Subject"}`,
          sub: `Score: ${m.internalmarkMark}/${m.internalmarkFull}`,
          time: "Recent",
          color: "#4facfe"
        })),
        deadlines: (resInfo.data.data || []).slice(0, 3).map(i => ({
          day: i.infoDate.split("-")[0] || "10",
          month: "Sep",
          title: i.infoDetails.substring(0, 20),
          sub: "Announcement"
        }))
      });
    } catch (err) {
      console.error("Error fetching student dashboard:", err);
    }
  };


  const stats = [
    { label: "Enrolled Courses", value: studentData.enrolledCourses, icon: FaBook, color: "#ff8c00" },
    { label: "Assignments", value: studentData.assignments, icon: FaFileLines, color: "#4facfe" },
    { label: "Pending Tasks", value: studentData.pendingTasks, icon: FaClock, color: "#f093fb" },
    { label: "Attendance", value: studentData.attendance, icon: FaCalendarCheck, color: "#43e97b" },
  ];


  const generateCalendarDays = () => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.day();
    const daysInMonth = currentDate.daysInMonth();
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const prevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.welcome}>
          <h1>Welcome back, <span className={styles.username}>{studentName}</span> 👋</h1>

          <p>Your academic journey is looking great today!</p>
        </div>
        <div className={styles.headerActions}>
           <button className={styles.notificationBtn}>
             <FaBell />
             <span className={styles.badge}></span>
           </button>
        </div>
      </header>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
                  <stat.icon />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <h3 className={styles.statValue}>{stat.value}</h3>
                </div>
                <div className={styles.statProgress} style={{ background: `${stat.color}20` }}>
                  <div className={styles.progressBar} style={{ width: '70%', background: stat.color }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.activityFeed}>
              <div className={styles.sectionHeader}>
                <h2><FaChartPie className={styles.headerIcon} /> Recent Activity</h2>
                <button className={styles.viewAll}>View All</button>
              </div>
              <div className={styles.activities}>
                {studentData.activities.map((act, idx) => (
                  <div key={idx} className={styles.activityItem}>
                    <div className={styles.activityDot} style={{ background: act.color }}></div>
                    <div className={styles.activityContent}>
                      <p>{act.text} <strong>{act.sub}</strong></p>
                      <span>{act.time}</span>
                    </div>
                  </div>
                ))}
                {studentData.activities.length === 0 && <p className={styles.noData}>No recent activity</p>}
              </div>

            </div>

            <div className={styles.deadlines}>
              <div className={styles.sectionHeader}>
                <h2><FaCircleCheck className={styles.headerIcon} /> Upcoming Deadlines</h2>
              </div>
              <div className={styles.deadlineList}>
                {studentData.deadlines.map((dl, idx) => (
                  <div key={idx} className={styles.deadlineItem}>
                    <div className={styles.deadlineDate}>{dl.day}<span>{dl.month}</span></div>
                    <div className={styles.deadlineInfo}>
                      <h4>{dl.title}</h4>
                      <p>{dl.sub}</p>
                    </div>
                  </div>
                ))}
                {studentData.deadlines.length === 0 && <p className={styles.noData}>No upcoming deadlines</p>}
              </div>

            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.calendarCard}>
            <div className={styles.calendarHeader}>
              <h3>{currentDate.format("MMMM YYYY")}</h3>
              <div className={styles.calendarNav}>
                <button onClick={prevMonth}><FaChevronLeft /></button>
                <button onClick={nextMonth}><FaChevronRight /></button>
              </div>
            </div>
            <div className={styles.calendarGrid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(dh => (
                <div key={dh} className={styles.dayHeader}>{dh}</div>
              ))}
              {generateCalendarDays().map((day, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.day} ${day === dayjs().date() && currentDate.isSame(dayjs(), 'month') ? styles.today : ""} ${!day ? styles.empty : ""}`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className={styles.calendarFooter}>
              <div className={styles.eventHint}>
                <span className={styles.eventDot}></span>
                Upcoming Exam
              </div>
            </div>
          </div>

          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <button onClick={() => navigate("/student/viewattendance")}>View Attendance</button>
              <button onClick={() => navigate("/student/viewinternalmark")}>Check Marks</button>
              <button onClick={() => navigate("/student/viewnotes")}>Download Notes</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
