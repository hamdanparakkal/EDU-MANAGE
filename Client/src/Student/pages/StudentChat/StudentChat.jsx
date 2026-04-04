import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./StudentChat.module.css";
import { 
  FaPaperPlane, 
  FaUserSecret, 
  FaCircle,
  FaRobot
} from "react-icons/fa6";

const StudentChat = () => {
    const studentId = sessionStorage.getItem("sid");
    const [teacherId, setTeacherId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);

    const bottomRef = useRef(null);

    const loadStudent = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/student/${studentId}`);
            setTeacherId(res.data.data.teacherId);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async () => {
        if (!teacherId || !studentId) return;
        const res = await axios.get(
            `http://localhost:5000/chat/${studentId}/${teacherId}`
        );
        setMessages(res.data);
    };

    const sendMessage = async () => {
        if (!text.trim()) return;
        await axios.post("http://localhost:5000/chat/send", {
            chatMessage: text,
            fromstudentId: studentId,
            toteacherId: teacherId
        });
        setText("");
        loadMessages();
    };

    useEffect(() => {
        loadStudent();
    }, []);

    useEffect(() => {
        if (!teacherId) return;
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [teacherId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loader}></div>
                <p>Connecting to secure chat...</p>
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
        <div className={styles.container}>
            <header className={styles.chatHeader}>
                <div className={styles.userInfo}>
                    <div className={styles.avatarCircle}>
                        <FaUserSecret />
                        <div className={styles.onlineStatus}></div>
                    </div>
                    <div className={styles.userMeta}>
                        <h3>Class Teacher</h3>
                        <p><FaCircle className={styles.statusDot} /> Always available for queries</p>
                    </div>
                </div>
            </header>

            <div className={styles.messagesBox}>
                {messages.length === 0 ? (
                    <div className={styles.welcomeState}>
                        <FaRobot />
                        <h4>Start a Conversation</h4>
                        <p>Have a question or need help? Send a message to your teacher.</p>
                    </div>
                ) : (
                    messages.map((m) => (
                        <div
                            key={m._id}
                            className={`${styles.messageWrapper} ${
                                m.fromstudentId ? styles.isStudent : styles.isTeacher
                            }`}
                        >
                            <div className={styles.messageBubble}>
                                {m.chatMessage}
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef}></div>
            </div>

            <div className={styles.inputArea}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={text}
                        placeholder="Type your message here..."
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button onClick={sendMessage} className={styles.sendBtn} disabled={!text.trim()}>
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
        </div>
    );
};

export default StudentChat;