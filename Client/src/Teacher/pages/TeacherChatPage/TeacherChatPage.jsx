import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router";
import styles from "./TeacherChatPage.module.css";
// Icons are now FontAwesome

const TeacherChatPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const studentName = location.state?.studentName || "Student";
  const studentPhoto = location.state?.studentPhoto || null;

  const teacherId = sessionStorage.getItem("tid");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    if (!teacherId || !id) return;
    try {
      const res = await axios.get(`http://localhost:5000/chat/${id}/${teacherId}`);
      setMessages(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    axios.put(`http://localhost:5000/chat/teacher/read/${id}/${teacherId}`);
  }, [id]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    await axios.post("http://localhost:5000/chat/send", {
      chatMessage: text,
      fromteacherId: teacherId,
      tostudentId: id
    });
    setText("");
    loadMessages();
  };

  return (
    <div className={styles.page}>
      <div className={styles.chatContainer}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></button>
            <div className={styles.studentMeta}>
              {studentPhoto ? (
                <img
                  src={`http://localhost:5000${studentPhoto}`}
                  alt={studentName}
                  className={styles.headerAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=" + studentName + "&background=6366f1&color=fff&size=128";
                  }}
                />
              ) : (
                <div className={styles.headerAvatarPlaceholder}>
                  <i className="fa-solid fa-user-tie"></i>
                </div>
              )}
              <div className={styles.titleArea}>
                <h3 className={styles.chatTitle}>{studentName}</h3>
                <div className={styles.statusIndicator}>
                  <span className={styles.statusDot}></span> Online
                </div>
              </div>
            </div>
          </div>
          <button className={styles.moreBtn}><i className="fa-solid fa-ellipsis-vertical"></i></button>
        </div>

        {/* Messages */}
        <div className={styles.messagesBox}>
          {messages.map((m, i) => (
            <div key={m._id} className={`${styles.message} ${m.fromteacherId ? styles.teacherMsg : styles.studentMsg}`}>
              {m.chatMessage}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className={styles.chatInputBox}>
          <button className={styles.attachBtn}><i className="fa-solid fa-paperclip"></i></button>
          <input type="text" className={styles.inputField} value={text} placeholder="Write your message here..."
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} />
          <button className={styles.sendBtn} onClick={sendMessage} disabled={!text.trim()}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherChatPage;