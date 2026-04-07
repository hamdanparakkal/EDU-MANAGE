import React, { useEffect, useState } from "react";
import styles from "./Dashboard.module.css";
import axios from "axios";
import { useNavigate } from "react-router";

import {
  Bar
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import {
  Users,
  BookOpen,
  ClipboardList,
  Bell,
  TrendingUp,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  BookMarked,
  Activity
} from "lucide-react";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
);

/* ─── Mini Calendar Component ─── */
const MiniCalendar = () => {
  const [current, setCurrent] = useState(dayjs());
  const today = dayjs();

  const startOfMonth = current.startOf("month");
  const daysInMonth = current.daysInMonth();
  const startWeekday = startOfMonth.day(); // 0=Sun

  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  // Dummy event days
  const eventDays = [5, 12, 18, 22, 27];

  return (
    <div className={styles.calendar}>
      <div className={styles.calNav}>
        <button onClick={() => setCurrent(c => c.subtract(1, "month"))} className={styles.calBtn}>
          <ChevronLeft size={16} />
        </button>
        <span className={styles.calTitle}>{current.format("MMMM YYYY")}</span>
        <button onClick={() => setCurrent(c => c.add(1, "month"))} className={styles.calBtn}>
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.calGrid}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
          <span key={d} className={styles.calDayName}>{d}</span>
        ))}
        {days.map((d, i) => (
          <span
            key={i}
            className={[
              styles.calDay,
              d === null ? styles.calEmpty : "",
              d && today.date() === d && today.month() === current.month() && today.year() === current.year() ? styles.calToday : "",
              d && eventDays.includes(d) ? styles.calEvent : ""
            ].filter(Boolean).join(" ")}
          >
            {d}
          </span>
        ))}
      </div>

      <div className={styles.calLegend}>
        <span className={styles.legendDot} style={{ background: "#6366f1" }} />
        <span className={styles.legendText}>Class scheduled</span>
        <span className={styles.legendDot} style={{ background: "#f59e0b", marginLeft: 10 }} />
        <span className={styles.legendText}>Today</span>
      </div>
    </div>
  );
};

/* ─── Main Dashboard ─── */
const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [teacherName, setTeacherName] = useState("");
  const navigate = useNavigate();


  const [teacherData, setTeacherData] = useState({
    totalStudents: 0,
    activeClasses: 0,
    assignments: 0,
    avgScore: 0,
    attendanceStats: { present: [], absent: [] },
    todayClasses: [],
    topStudents: [],
    notifications: []
  });

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening");
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    fetchDashboardData();
    return () => clearInterval(timer);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const tid = sessionStorage.getItem("tid");
      if (!tid) return;

      // Individual request handling with failover support
      const fetchSet = await Promise.all([
        axios.get(`http://localhost:5000/teacher/${tid}`).catch(() => ({ data: { data: null } })),
        axios.get(`http://localhost:5000/teacher/students/${tid}`).catch(() => ({ data: { data: [] } })),
        axios.get("http://localhost:5000/student").catch(() => ({ data: { data: [] } })), // Fallback students
        axios.get("http://localhost:5000/class").catch(() => ({ data: { data: [] } })),
        axios.get("http://localhost:5000/notes").catch(() => ({ data: { data: [] } })),
        axios.get("http://localhost:5000/internalmark").catch(() => ({ data: { data: [] } }))
      ]);

      const [resTeacher, resTeacherStudents, resAllStudents, resClasses, resNotes, resMarks] = fetchSet;

      const teacherProfile = resTeacher.data.data;
      if (teacherProfile) setTeacherName(teacherProfile.teacherName);


      // Filter data by teacher ID
      let myStudents = resTeacherStudents.data.data || [];
      const lid = tid.toLowerCase();

      // Manual fallback if specialized endpoint returns nothing
      if (myStudents.length === 0) {
        myStudents = (resAllStudents.data.data || []).filter(s => 
          (s.teacherId && String(s.teacherId).toLowerCase() === lid) ||
          (s.teacher_id && String(s.teacher_id).toLowerCase() === lid)
        );
      }
      
      const myClasses = (resClasses.data.data || []).filter(c => 
        (c.teacherId && String(c.teacherId).toLowerCase() === lid) || 
        (c.teacherId?._id && String(c.teacherId._id).toLowerCase() === lid)
      );
      const myNotes = (resNotes.data.data || []).filter(n => 
        (n.teacherId && String(n.teacherId).toLowerCase() === lid) || 
        (n.teacherId?._id && String(n.teacherId._id).toLowerCase() === lid)
      );

      // Calculate avg score for the teacher's students
      const myStudentIds = myStudents.map(s => String(s.studentId || s._id).toLowerCase());
      const relevantMarks = (resMarks.data.data || []).filter(m => {
        const mid = String(m.studentId || m.studentId?._id || "").toLowerCase();
        return myStudentIds.includes(mid);
      });

      const avg = relevantMarks.length > 0
        ? Math.round(relevantMarks.reduce((sum, m) => sum + parseInt(m.internalmarkMark || 0), 0) / relevantMarks.length)
        : 0;

      // Debugging Logs (Visible in browser console)
      console.table({ tid, myStudentsCount: myStudents.length, myClassesCount: myClasses.length, myNotesCount: myNotes.length });



      // Top Students
      const top = [...relevantMarks]
        .sort((a, b) => b.internalmarkMark - a.internalmarkMark)
        .slice(0, 3)
        .map(m => {
          const student = myStudents.find(s => s.studentId === m.studentId);
          return {
            name: student?.studentName || "Unknown",
            score: m.internalmarkMark,
            subject: m.subjectId?.subjectName || "Subject",
            avatar: student?.studentName?.charAt(0) || "S"
          };
        });

      setTeacherData({
        totalStudents: myStudents.length,
        activeClasses: myClasses.length,
        assignments: myNotes.length,
        avgScore: avg,
        todayClasses: myClasses.slice(0, 4).map(c => ({
          time: "09:00 AM", // Placeholder since class schema doesn't have time
          subject: c.className,
          batch: c.courseId?.courseName || "Batch",
          room: "Room 101",
          status: "upcoming"
        })),
        topStudents: top,
        attendanceStats: {
          present: [38, 42, 35, 45, 40, 28], // Placeholder chart data
          absent: [7, 3, 10, 5, 8, 12]
        }
      });
    } catch (err) {
      console.error("Error fetching teacher dashboard data:", err);
    }
  };


  const timeStr = currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  /* ─── Chart Data ─── */
  const attendanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Present",
        data: [38, 42, 35, 45, 40, 28],
        backgroundColor: "rgba(99,102,241,0.85)",
        borderRadius: 10,
        borderSkipped: false,
      },
      {
        label: "Absent",
        data: [7, 3, 10, 5, 8, 12],
        backgroundColor: "rgba(244,63,94,0.2)",
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { family: "Plus Jakarta Sans", size: 12, weight: "600" },
          color: "#64748b",
          boxWidth: 10,
          borderRadius: 4,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        titleFont: { family: "Plus Jakarta Sans", size: 12, weight: "700" },
        bodyFont: { family: "Plus Jakarta Sans", size: 12 },
        cornerRadius: 10,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8", font: { family: "Plus Jakarta Sans", size: 12 } },
      },
      y: {
        grid: { color: "rgba(99,102,241,0.05)" },
        ticks: { color: "#94a3b8", font: { family: "Plus Jakarta Sans", size: 12 } },
        beginAtZero: true,
      },
    },
  };

  /* ─── Stat Cards ─── */
  const stats = [
    { title: "Total Students", value: teacherData.totalStudents, icon: <Users size={20} />, color: "#6366f1", bg: "rgba(99,102,241,0.1)", sub: "+8 this week" },
    { title: "Active Classes", value: teacherData.activeClasses, icon: <BookOpen size={20} />, color: "#10b981", bg: "rgba(16,185,129,0.1)", sub: "This semester" },
    { title: "Assignments", value: teacherData.assignments, icon: <ClipboardList size={20} />, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", sub: "3 due soon" },
    { title: "Avg. Score", value: `${teacherData.avgScore}%`, icon: <TrendingUp size={20} />, color: "#f43f5e", bg: "rgba(244,63,94,0.1)", sub: "+4% vs last month" },
  ];


  /* ─── Today's Classes ─── */
  const todayClasses = teacherData.todayClasses;


  /* ─── Top Students ─── */
  const topStudents = teacherData.topStudents;


  /* ─── Notifications ─── */
  const notifs = [
    { text: "Attendance sheet pending for BCA Sem 4", time: "10 min ago", urgent: true },
    { text: "3 assignments need grading by tomorrow", time: "1 hr ago", urgent: false },
    { text: "Faculty meeting on Friday at 3 PM", time: "3 hrs ago", urgent: false },
  ];

  return (
    <div className={styles.dashboard}>

      {/* ─── Hero Header ─── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroTag}>{greeting}</span>
          <h1 className={styles.heroName}>{teacherName || "Teacher"} <span>👋</span></h1>
          <p className={styles.heroDate}>{dateStr}</p>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.clockBox}>
            <span className={styles.clockTime}>{timeStr}</span>
            <span className={styles.clockLabel}>Current Time</span>
          </div>
        </div>
      </div>

      {/* ─── Top Stat Cards ─── */}
      <div className={styles.statsRow}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statCard} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={styles.statIcon} style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>{s.title}</p>
              <h2 className={styles.statValue}>{s.value}</h2>
              <span className={styles.statSub} style={{ color: s.color }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main Grid: Chart + Calendar ─── */}
      <div className={styles.midGrid}>

        {/* Weekly Attendance Chart */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Weekly Attendance</h3>
              <p className={styles.panelSub}>Student presence this week across all classes</p>
            </div>
            <div className={styles.panelBadge}>
              <Activity size={14} /> Live
            </div>
          </div>
          <div className={styles.chartWrap}>
            <Bar data={attendanceData} options={chartOptions} />
          </div>
        </div>

        {/* Calendar */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Academic Calendar</h3>
              <p className={styles.panelSub}>Your scheduled classes this month</p>
            </div>
          </div>
          <MiniCalendar />
        </div>

      </div>

      {/* ─── Bottom Grid: Classes + Students + Notifs ─── */}
      <div className={styles.bottomGrid}>

        {/* Today's Classes */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Today's Classes</h3>
              <p className={styles.panelSub}>{todayClasses.length} sessions scheduled</p>
            </div>
            <Clock size={16} style={{ color: "#6366f1" }} />
          </div>
          <div className={styles.classList}>
            {todayClasses.map((c, i) => (
              <div key={i} className={styles.classItem}>
                <div className={`${styles.statusDot} ${styles[c.status]}`} />
                <div className={styles.classTime}>{c.time}</div>
                <div className={styles.classInfo}>
                  <p className={styles.classSubject}>{c.subject}</p>
                  <span className={styles.classMeta}>{c.batch} · {c.room}</span>
                </div>
                <span className={`${styles.classBadge} ${styles[c.status]}`}>
                  {c.status === "ongoing" ? "🟢 Live" : "⏰ Soon"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Students */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Top Performers</h3>
              <p className={styles.panelSub}>Highest scores this semester</p>
            </div>
            <Star size={16} style={{ color: "#f59e0b" }} />
          </div>
          <div className={styles.studentList}>
            {topStudents.map((s, i) => (
              <div key={i} className={styles.studentItem}>
                <div className={styles.studentRank}>{i + 1}</div>
                <div className={styles.studentAvatar}>{s.avatar}</div>
                <div className={styles.studentInfo}>
                  <p className={styles.studentName}>{s.name}</p>
                  <span className={styles.studentSubject}>{s.subject}</span>
                </div>
                <div className={styles.studentScore}>
                  <span className={styles.scoreNum}>{s.score}</span>
                  <span className={styles.scorePct}>%</span>
                </div>
              </div>
            ))}

            {/* Motivational banner */}
            <div className={styles.quoteBanner}>
              <BookMarked size={16} />
              <p>"The art of teaching is the art of assisting discovery."</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h3 className={styles.panelTitle}>Notifications</h3>
              <p className={styles.panelSub}>3 unread alerts</p>
            </div>
            <Bell size={16} style={{ color: "#6366f1" }} />
          </div>
          <div className={styles.notifList}>
            {notifs.map((n, i) => (
              <div key={i} className={`${styles.notifItem} ${n.urgent ? styles.notifUrgent : ""}`}>
                <div className={`${styles.notifDot} ${n.urgent ? styles.urgentDot : ""}`} />
                <div className={styles.notifContent}>
                  <p className={styles.notifText}>{n.text}</p>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick resources */}
          <div className={styles.quickLinks}>
            <p className={styles.quickTitle}>Quick Access</p>
            <div className={styles.quickGrid}>
              {[
                { icon: <ClipboardList size={16} />, label: "Attendance", color: "#6366f1", path: "/teacher/attendance" },
                { icon: <BookOpen size={16} />, label: "Grades", color: "#10b981", path: "/teacher/internalmark" },
                { icon: <MessageSquare size={16} />, label: "Messages", color: "#f59e0b", path: "/teacher/TeacherChatList" },
                { icon: <TrendingUp size={16} />, label: "Reports", color: "#f43f5e", path: "/teacher/mystudents" },
              ].map((q, i) => (
                <div
                  key={i}
                  className={styles.quickItem}
                  style={{ "--qc": q.color, cursor: "pointer" }}
                  onClick={() => navigate(q.path)}
                >
                  <div className={styles.quickIcon} style={{ background: `${q.color}15`, color: q.color }}>
                    {q.icon}
                  </div>
                  <span className={styles.quickLabel}>{q.label}</span>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;