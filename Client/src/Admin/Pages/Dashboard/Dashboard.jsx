import { useState, useEffect } from "react";
import axios from "axios";



const STATUS = {
  0: { bg: "#fffbeb", color: "#d97706", label: "Pending" },
  1: { bg: "#f0fdf4", color: "#16a34a", label: "Active" },
  2: { bg: "#fef2f2", color: "#dc2626", label: "Inactive" },
};


const Spark = ({ color, up }) => {
  const pts = up
    ? "0,30 10,25 20,28 30,18 40,20 50,10 60,14 70,8 80,12 90,5 100,8"
    : "0,8 10,14 20,10 30,18 40,15 50,22 60,18 70,25 80,20 90,28 100,30";
  return (
    <svg width="80" height="30" viewBox="0 0 100 36">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

/* Mini bar chart like reference */
const BarChart = ({ data, color }) => (
  <svg width="80" height="42" viewBox="0 0 80 42">
    {data.map((v, i) => {
      const h = v * 0.36;
      return <rect key={i} x={i * 14 + 2} y={42 - h} width="10" height={h}
        rx="3" fill={i === data.length - 1 ? color : color + "55"} />;
    })}
  </svg>
);

export default function DashboardContent() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalSubjects: 0,
    totalClasses: 0,
    recentStudents: [],
    recentFeedback: [],
    recentComplaints: []
  });

  useEffect(() => {
    const endpoints = [
      "student",
      "teacher",
      "department",
      "course",
      "subject",
      "class",
      "admin/complaint",
      "admin/feedback"
    ];

    const fetchData = async () => {
      try {
        const results = await Promise.all(
          endpoints.map(ep => axios.get(`http://localhost:5000/${ep}`))
        );

        setStats({
          totalStudents: results[0].data.data?.length || 0,
          totalTeachers: results[1].data.data?.length || 0,
          totalDepartments: results[2].data.data?.length || 0,
          totalCourses: results[3].data.data?.length || 0,
          totalSubjects: results[4].data.data?.length || 0,
          totalClasses: results[5].data.data?.length || 0,
          recentStudents: (results[0].data.data || []).slice(-4).reverse(),
          recentComplaints: (results[6].data.data || []).slice(0, 4),
          recentFeedback: (results[7].data.data || []).slice(0, 4)
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);


  const getRandomColor = (name) => {
    const colors = ["#fb923c", "#10b981", "#f43f5e", "#6366f1", "#8b5cf6", "#f59e0b"];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

        .dash {
          padding: 30px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100%;
          position: relative;
          z-index: 10;
        }

        /* Glass Card */
        .wc {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wc:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: rgba(251, 146, 60, 0.3);
        }

        /* Page heading */
        .dash-head {
          margin-bottom: 30px;
          animation: slideDown 0.6s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-title {
          font-size: 28px; font-weight: 800; color: #111827;
          letter-spacing: -0.03em;
        }
        .dash-sub { font-size: 14px; color: #6b7280; margin-top: 4px; font-weight: 500; }

        /* ── STAT CARDS ── */
        .srow { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 30px; }
        .sc { padding: 24px; position: relative; overflow: hidden; }

        .sc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .sc-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .08em; }
        .sc-ico {
          width: 44px; height: 44px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; transition: all 0.3s;
        }
        .sc:hover .sc-ico { transform: scale(1.1) rotate(5deg); }

        .sc-val { font-size: 32px; font-weight: 800; color: #111827; line-height: 1; letter-spacing: -0.04em; margin-bottom: 6px; }
        .sc-desc { font-size: 13px; color: #6b7280; margin-bottom: 16px; font-weight: 500; }

        .sc-pills { display: flex; gap: 6px; flex-wrap: wrap; }
        .pill {
          font-size: 10px; font-weight: 700;
          padding: 4px 10px; border-radius: 8px;
        }

        .tag {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700;
          padding: 4px 10px; border-radius: 8px;
        }

        .sc-mini { display: flex; gap: 24px; margin-top: 15px; }
        .sc-mini-val { font-size: 18px; font-weight: 700; color: #111827; }
        .sc-mini-lbl { font-size: 10px; font-weight: 600; color: #9ca3af; text-transform: uppercase; }

        /* ── MIDDLE ROW ── */
        .mrow { display: grid; grid-template-columns: 1fr 340px; gap: 20px; margin-bottom: 30px; }
        .panel { padding: 24px; }
        .panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .panel-title { font-size: 16px; font-weight: 800; color: #111827; letter-spacing: -0.01em; }
        .panel-link { font-size: 12px; color: #fb923c; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .panel-link:hover { color: #f43f5e; text-decoration: none; transform: translateX(3px); }

        table.tbl { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
        table.tbl th {
          font-size: 10px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: .08em;
          text-align: left; padding: 0 12px 8px;
        }
        table.tbl td { padding: 12px; background: rgba(255,255,255,0.4); vertical-align: middle; }
        table.tbl tr td:first-child { border-radius: 12px 0 0 12px; }
        table.tbl tr td:last-child { border-radius: 0 12px 12px 0; }
        table.tbl tr:hover td { background: rgba(255,255,255,0.8); }

        .av {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0;
        }
        .aname { font-size: 13px; font-weight: 700; color: #111827; }
        .adept { font-size: 11px; color: #9ca3af; font-weight: 500; }
        .badge { font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 8px; }

        /* Updates */
        .upd { display: flex; gap: 14px; align-items: center; padding: 12px; border-radius: 16px; transition: 0.2s; margin-bottom: 4px; }
        .upd:hover { background: rgba(255,255,255,0.5); transform: scale(1.02); }
        .upd-ico { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .upd-txt { font-size: 13px; font-weight: 700; color: #111827; }
        .upd-sub { font-size: 11px; color: #6b7280; font-weight: 500; }
        .upd-time { font-size: 10px; color: #9ca3af; margin-top: 2px; font-weight: 600; }

        /* ── BOTTOM ROW ── */
        .brow { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        .mc { padding: 20px; }
        .mc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .mc-label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
        .mc-val { font-size: 26px; font-weight: 800; color: #111827; letter-spacing: -0.03em; }
        .mc-sub { font-size: 12px; color: #6b7280; margin-bottom: 12px; font-weight: 500; }

        /* Stars */
        .stars { display: flex; gap: 4px; }

        @media (max-width: 1200px) { .srow { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 900px) { .mrow { grid-template-columns: 1fr; } .brow { grid-template-columns: repeat(2,1fr); } }
      `}</style>

      <div className="dash">

        {/* Page heading */}
        <div className="dash-head">
          <div className="dash-title">Command Center</div>
          <div className="dash-sub">Operational overview of the Learning Management System.</div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="srow">

          {/* Total Students */}
          <div className="sc wc">
            <div className="sc-top">
              <div className="sc-label">Total Students</div>
              <div className="sc-ico" style={{ background: "#fff7ed", color: "#fb923c" }}>
                <i className="fa-solid fa-user-graduate" />
              </div>
            </div>
            <div className="sc-val">{stats.totalStudents.toLocaleString()}</div>
            <div className="sc-desc">Active learners across all cohorts</div>
            <div className="sc-pills">
              <span className="pill" style={{ background: "rgba(59,130,246,0.1)", color: "#2563eb" }}>+ {Math.floor(stats.totalStudents * 0.05)} Monthly</span>
              <span className="pill" style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>92% Satisfaction</span>
            </div>
          </div>

          {/* Active Courses */}
          <div className="sc wc">
            <div className="sc-top">
              <div className="sc-label">Active Courses</div>
              <div className="sc-ico" style={{ background: "#f0fdf4", color: "#10b981" }}>
                <i className="fa-solid fa-book-open" />
              </div>
            </div>
            <div className="sc-val">{stats.totalCourses}</div>
            <div className="sc-desc">Curriculums live this semester</div>
            <div className="sc-pills">
              <span className="pill" style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>{stats.totalSubjects} Subjects</span>
              <span className="pill" style={{ background: "rgba(251,146,60,0.1)", color: "#ea580c" }}>New</span>
            </div>
          </div>

          {/* Departments */}
          <div className="sc wc">
            <div className="sc-top">
              <div className="sc-label">Departments</div>
              <div className="sc-ico" style={{ background: "#fff1f2", color: "#f43f5e" }}>
                <i className="fa-solid fa-building-columns" />
              </div>
            </div>
            <div className="sc-val">{stats.totalDepartments}</div>
            <div className="sc-desc">Core academic faculties</div>
            <span className="tag" style={{ background: "rgba(16,185,129,0.1)", color: "#059669" }}>↑ Primary Units</span>
            <div className="sc-mini">
              <div className="sc-mini-item"><div className="sc-mini-val">{stats.totalTeachers}</div><div className="sc-mini-lbl">Teachers</div></div>
              <div className="sc-mini-item"><div className="sc-mini-val">{stats.totalClasses}</div><div className="sc-mini-lbl">Classes</div></div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="sc wc">
            <div className="sc-top">
              <div className="sc-label">Global Success</div>
              <div className="sc-ico" style={{ background: "#f5f3ff", color: "#8b5cf6" }}>
                <i className="fa-solid fa-chart-line" />
              </div>
            </div>
            <div className="sc-val">84%</div>

            <div className="sc-desc">Average student success rate</div>
            <div style={{ marginTop: 10 }}>
              <Spark color="#8b5cf6" up={true} />
            </div>
          </div>

        </div>

        {/* ── MIDDLE ROW ── */}
        <div className="mrow">

          {/* Enrollments table */}
          <div className="panel wc">
            <div className="panel-head">
              <div className="panel-title">Recent Activity</div>
              <div className="panel-link">Explore all <i className="fa-solid fa-arrow-right"></i></div>
            </div>
            <table className="tbl">
              <thead><tr><th>Student</th><th>Course Faculty</th><th>Joined</th><th>Status</th></tr></thead>
              <tbody>
                {stats.recentStudents.map((e, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {e.studentPhoto ? (
                          <img src={`http://localhost:5000${e.studentPhoto}`} alt="" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
                        ) : (
                          <div className="av" style={{ background: getRandomColor(e.studentName), border: "2px solid rgba(255,255,255,0.8)" }}>{e.studentName.charAt(0)}</div>
                        )}
                        <div><div className="aname">{e.studentName}</div><div className="adept">Roll No: {e.studentRollno}</div></div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>Student ID: {e.studentId}</span></td>
                    <td><span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{new Date(e.createdAt).toLocaleDateString()}</span></td>
                    <td>
                      <span className="badge" style={{ background: STATUS[e.studentStatus]?.bg || "#f3f4f6", color: STATUS[e.studentStatus]?.color || "#6b7280" }}>
                        {STATUS[e.studentStatus]?.label || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}


              </tbody>
            </table>
          </div>

          {/* Updates */}
          <div className="panel wc">
            <div className="panel-head">
              <div className="panel-title">System Logs</div>
              <div className="panel-link">History</div>
            </div>
            {stats.recentFeedback.length > 0 ? (
              stats.recentFeedback.map((u, i) => (
                <div className="upd" key={i}>
                  <div className="upd-ico" style={{ background: "#fb923c20", color: "#fb923c" }}>💬</div>
                  <div>
                    <div className="upd-txt">New Feedback</div>
                    <div className="upd-sub">{u.feedbackContent.substring(0, 50)}...</div>
                    <div className="upd-time">{getTimeAgo(u.createdAt)}</div>
                  </div>
                </div>
              ))
            ) : (
                stats.recentComplaints.map((u, i) => (
                  <div className="upd" key={i}>
                    <div className="upd-ico" style={{ background: "#f43f5e20", color: "#f43f5e" }}>🚩</div>
                    <div>
                      <div className="upd-txt">{u.complaintTitle}</div>
                      <div className="upd-sub">{u.complaintContent.substring(0, 50)}...</div>
                      <div className="upd-time">{getTimeAgo(u.createdAt)}</div>
                    </div>
                  </div>
                ))
            )}
            {stats.recentFeedback.length === 0 && stats.recentComplaints.length === 0 && (
              <div style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 13 }}>No recent logs</div>
            )}

          </div>

        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="brow">
          {[
            { label: "Total Teachers", val: stats.totalTeachers, sub: "Faculty strength", tag: "↑ 2 New", tBg: "rgba(59,130,246,0.1)", tC: "#2563eb", sc: "#3b82f6", up: true },
            { label: "Live Classes", val: stats.totalClasses, sub: "Running batches", tag: "Active", tBg: "rgba(16,185,129,0.1)", tC: "#16a34a", sc: "#10b981", up: true },
            { label: "Subjects", val: stats.totalSubjects, sub: "Across all sems", tag: "Shield Active", tBg: "rgba(16,185,129,0.1)", tC: "#16a34a", sc: "#10b981", up: true },
          ].map(m => (

            <div className="mc wc" key={m.label}>
              <div className="mc-top">
                <div className="mc-label">{m.label}</div>
                <div style={{ color: m.sc, fontSize: 16 }}><i className="fa-solid fa-wave-square"></i></div>
              </div>
              <div className="mc-val">{m.val}</div>
              <div className="mc-sub">{m.sub}</div>
              <span className="tag" style={{ background: m.tBg, color: m.tC }}>{m.tag}</span>
            </div>
          ))}

          {/* Satisfaction */}
          <div className="mc wc">
            <div className="mc-top">
              <div className="mc-label">Admin Pulse</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <i key={s} className="fa-solid fa-star" style={{ fontSize: 10, color: s <= 4 ? "#fb923c" : "#e5e7eb" }} />
                ))}
              </div>
            </div>
            <div className="mc-val">Premium</div>
            <div className="mc-sub">Unified Design System</div>
            <span className="tag" style={{ background: "#fff7ed", color: "#ea580c" }}>★ High Performance</span>
          </div>
        </div>

      </div>
    </>
  );
}
