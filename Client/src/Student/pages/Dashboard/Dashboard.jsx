import React, { useState } from "react";
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

  const stats = [
    { label: "Enrolled Courses", value: "5", icon: FaBook, color: "#ff8c00" },
    { label: "Assignments", value: "12", icon: FaFileLines, color: "#4facfe" },
    { label: "Pending Tasks", value: "3", icon: FaClock, color: "#f093fb" },
    { label: "Attendance", value: "92%", icon: FaCalendarCheck, color: "#43e97b" },
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
          <h1>Welcome back, <span className={styles.username}>Student</span> 👋</h1>
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
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} style={{ background: "#ff8c00" }}></div>
                  <div className={styles.activityContent}>
                    <p>New course added: <strong>Data Structures</strong></p>
                    <span>2 hours ago</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} style={{ background: "#4facfe" }}></div>
                  <div className={styles.activityContent}>
                    <p>Assignment submitted: <strong>Web Programming</strong></p>
                    <span>5 hours ago</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityDot} style={{ background: "#43e97b" }}></div>
                  <div className={styles.activityContent}>
                    <p>Announcement: <strong>Semester exams schedule</strong></p>
                    <span>Yesterday</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.deadlines}>
              <div className={styles.sectionHeader}>
                <h2><FaCircleCheck className={styles.headerIcon} /> Upcoming Deadlines</h2>
              </div>
              <div className={styles.deadlineList}>
                <div className={styles.deadlineItem}>
                  <div className={styles.deadlineDate}>20<span>Sep</span></div>
                  <div className={styles.deadlineInfo}>
                    <h4>Web Programming</h4>
                    <p>Project Submission</p>
                  </div>
                </div>
                <div className={styles.deadlineItem}>
                  <div className={styles.deadlineDate}>22<span>Sep</span></div>
                  <div className={styles.deadlineInfo}>
                    <h4>Database Systems</h4>
                    <p>Quiz #3</p>
                  </div>
                </div>
                <div className={styles.deadlineItem}>
                  <div className={styles.deadlineDate}>25<span>Sep</span></div>
                  <div className={styles.deadlineInfo}>
                    <h4>Java Lab</h4>
                    <p>Lab Record</p>
                  </div>
                </div>
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
              <button>View Attendance</button>
              <button>Check Marks</button>
              <button>Download Notes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
