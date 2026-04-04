import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import styles from "./TeacherViewAttendance.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Calendar, FileSpreadsheet, FileText, ArrowLeft, CheckCircle2, Clock, AlertCircle, Save, Edit2 } from "lucide-react";

const TeacherViewAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendanceList, setAttendanceList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condonationPaid, setCondonationPaid] = useState(false);
  const [leaveBonus, setLeaveBonus] = useState(0);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!id) { setError("No student ID found."); setLoading(false); return; }
      try {
        const response = await axios.get(`http://localhost:5000/attendance-by-student/${id}`);
        const attendanceData = response.data.data || [];
        setAttendanceList(attendanceData);
        const paymentRes = await axios.get(`http://localhost:5000/payment-status/${id}`);
        setCondonationPaid(paymentRes.data.condonationPaid);
        if (attendanceData.length > 0) {
          const semId = attendanceData[0]?.semId?._id;
          const leaveRes = await axios.get(`http://localhost:5000/leave/bonus/${id}/${semId}`);
          setLeaveBonus(leaveRes.data.bonus);
        }
      } catch (err) { setError("Failed to load attendance."); } finally { setLoading(false); }
    };
    fetchAttendance();
  }, [id]);

  const handleEdit = (att) => { setEditingId(att._id); setNewStatus(att.attendanceType); };
  const handleSave = async (attendanceId) => {
    try {
      await axios.put(`http://localhost:5000/attendance/${attendanceId}`, { attendanceType: newStatus });
      setAttendanceList(attendanceList.map((a) => a._id === attendanceId ? { ...a, attendanceType: newStatus } : a));
      setEditingId(null);
    } catch { alert("Update failed"); }
  };

  const totalClasses = attendanceList.length;
  const presentCount = attendanceList.filter(a => a.attendanceType === "Present").length;
  const absentCount = attendanceList.filter(a => a.attendanceType === "Absent").length;
  let attendancePercent = totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
  attendancePercent = Math.min(100, attendancePercent + leaveBonus).toFixed(1);
  const semesterName = attendanceList[0]?.semId?.semName;

  const downloadExcel = () => {
    const data = attendanceList.map((att, i) => ({ No: i + 1, Date: new Date(att.attendanceDate).toLocaleDateString(), Subject: att.subjectId?.subjectName || "N/A", Period: att.attendanceHour, Status: att.attendanceType }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "Attendance_Report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 15);
    autoTable(doc, { startY: 22, head: [["#", "Date", "Subject", "Period", "Status"]], body: attendanceList.map((att, i) => [i + 1, new Date(att.attendanceDate).toLocaleDateString(), att.subjectId?.subjectName || "N/A", att.attendanceHour, att.attendanceType]) });
    doc.save("Attendance_Report.pdf");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button className={styles.excelBtn} onClick={() => navigate(-1)} style={{ padding: '10px' }}><ArrowLeft size={18} /></button>
          <h2 className={styles.title}>Attendance Registry</h2>
        </div>
        <div className={styles.downloadGroup}>
          <button className={styles.excelBtn} onClick={downloadExcel}><FileSpreadsheet size={16} /> Excel</button>
          <button className={styles.pdfBtn} onClick={downloadPDF}><FileText size={16} /> PDF</button>
        </div>
      </div>

      {!loading && (
        <>
          <div className={styles.condonationBox}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AlertCircle size={20} color="#6366f1" />
              <h3>Condonation Status</h3>
            </div>
            {attendancePercent < 70 ? (condonationPaid ? <span className={styles.paid}>✅ Paid & Cleared</span> : <span className={styles.pending}>⚠ Payment Required</span>) : <span className={styles.noCondonation}>Requirement Met</span>}
          </div>

          <div className={styles.summaryCards}>
            <div className={styles.summaryCard}><span>Sessions</span><h3>{totalClasses}</h3></div>
            <div className={styles.summaryCard}><span>Present</span><h3 style={{ color: '#10b981' }}>{presentCount}</h3></div>
            <div className={styles.summaryCard}><span>Absent</span><h3 style={{ color: '#f43f5e' }}>{absentCount}</h3></div>
            <div className={styles.summaryCard}><span>Average</span><h3>{attendancePercent}%</h3></div>
          </div>

          <div className={styles.attendanceList}>
            <div className={styles.rowHeader}><div>Date</div><div>Subject</div><div>Hour</div><div>Status</div><div>Action</div></div>
            {attendanceList.map((att) => (
              <div key={att._id} className={styles.row}>
                <div>{new Date(att.attendanceDate).toLocaleDateString()}</div>
                <div>{att.subjectId?.subjectName || "N/A"}</div>
                <div>Period {att.attendanceHour}</div>
                <div>
                  {editingId === att._id ? (
                    <select className={styles.select} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="Present">Present</option><option value="Absent">Absent</option>
                    </select>
                  ) : <span className={att.attendanceType === "Present" ? styles.presentBadge : styles.absentBadge}>{att.attendanceType}</span>}
                </div>
                <div>
                  {editingId === att._id ? <button className={styles.saveBtn} onClick={() => handleSave(att._id)}><Save size={12} /></button> : <button className={styles.editBtn} onClick={() => handleEdit(att)}><Edit2 size={12} /></button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherViewAttendance;