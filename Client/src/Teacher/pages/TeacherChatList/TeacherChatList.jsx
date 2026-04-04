import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./TeacherChatList.module.css";
// Icons are now FontAwesome

const TeacherChatList = () => {
  const [students, setStudents] = useState([]);
  const [notifications, setNotifications] = useState({});
  const navigate = useNavigate();
  const teacherId = sessionStorage.getItem("tid");

  const loadStudents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/teacher/students/${teacherId}`);
      setStudents(res.data.data);
    } catch (err) { console.error(err); }
  };

  const loadNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/chat/teacher/notifications/${teacherId}`);
      const notifObj = {};
      res.data.forEach((n) => { notifObj[n._id] = n.count; });
      setNotifications(notifObj);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    loadStudents();
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Student Chats</h1>
          <p className={styles.pageSub}>Connect and communicate with your assigned students</p>
        </div>

        {students.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><i className="fa-solid fa-inbox" style={{ fontSize: 40, marginBottom: 16 }}></i></div>
            <p>No students found in your registry.</p>
          </div>
        ) : (
          <div className={styles.chatList}>
            {students.map((s, i) => (
              <div key={s.studentId} className={styles.chatItem} style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/teacher/TeacherChatPage/${s.studentId}`, { state: { studentName: s.studentName, studentPhoto: s.studentPhoto } })}>

                <div className={styles.studentInfo}>
                  <div className={styles.avatarWrap}>
                    {s.studentPhoto ? (
                      <img
                        src={`http://localhost:5000${s.studentPhoto}`}
                        alt={s.studentName}
                        className={styles.avatar}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://ui-avatars.com/api/?name=" + s.studentName + "&background=6366f1&color=fff&size=128";
                        }}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <i className="fa-solid fa-user-tie"></i>
                      </div>
                    )}
                    {notifications[s.studentId] && (
                      <span className={styles.notificationBadge}>{notifications[s.studentId]}</span>
                    )}
                  </div>
                  <div className={styles.details}>
                    <h4>{s.studentName}</h4>
                    <p>{s.className} • Roll {s.studentRollno}</p>
                  </div>
                </div>

                <div className={styles.actionArea}>
                  <button className={styles.messageBtn}>
                    Chat <i className="fa-solid fa-chevron-right" style={{ marginLeft: 6, fontSize: 10 }}></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherChatList;