import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./StudentRegistration.module.css";
// Icons are now FontAwesome strings

const StudentRegistration = () => {
  /* ───────── FORM STATES ───────── */
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentRollno, setStudentRollno] = useState("");
  const [studentContact, setStudentContact] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentPhoto, setStudentPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [studentDob, setStudentDob] = useState("");

  const [departmentId, setDepartmentId] = useState("");
  const [classId, setClassId] = useState("");
  const [yearId, setYearId] = useState("");
  const [semId, setSemId] = useState("");

  const teacherId = sessionStorage.getItem("tid");
  const [excelFile, setExcelFile] = useState(null);

  /* DATA STATES */
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [sems, setSems] = useState([]);

  /* FETCH DATA */
  useEffect(() => {
    axios.get("http://localhost:5000/department").then(res => setDepartments(res.data.data || []));
    axios.get("http://localhost:5000/course").then(res => setCourses(res.data.data || []));
    axios.get("http://localhost:5000/class").then(res => setClasses(res.data.data || []));
    axios.get("http://localhost:5000/year").then(res => setYears(res.data.data || []));
    axios.get("http://localhost:5000/sem").then(res => setSems(res.data.data || []));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validations (Keep existing logic)
    const namePattern = /^[A-Z][a-zA-Z\s]*$/;
    if (!namePattern.test(studentName)) { alert("Name must start with a capital letter"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) { alert("Enter valid email"); return; }
    if (!/^[0-9]{10}$/.test(studentContact)) { alert("Contact must be 10 digits"); return; }
    if (!studentPhoto) { alert("Profile photo required"); return; }

    // Check Email Uniqueness across all roles
    try {
      const [resAdmin, resTeacher, resStudent] = await Promise.all([
        axios.get("http://localhost:5000/admin"),
        axios.get("http://localhost:5000/teacher"),
        axios.get("http://localhost:5000/student")
      ]);

      const allEmails = [
        ...(resAdmin.data.data || []).map(u => u.adminEmail),
        ...(resTeacher.data.data || []).map(u => u.teacherEmail),
        ...(resStudent.data.data || []).map(u => u.studentEmail)
      ];

      if (allEmails.includes(studentEmail)) {
        alert("email already existed");
        return;
      }
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
    }


    const fd = new FormData();
    fd.append("studentName", studentName);
    fd.append("studentEmail", studentEmail);
    fd.append("studentAddress", studentAddress);
    fd.append("studentRollno", studentRollno);
    fd.append("studentContact", studentContact);
    fd.append("studentPassword", studentPassword);
    fd.append("studentDob", studentDob);
    fd.append("photo", studentPhoto);
    fd.append("classId", classId);
    fd.append("yearId", yearId);
    fd.append("semId", semId);
    if (teacherId) fd.append("teacherId", teacherId);

    try {
      await axios.post("http://localhost:5000/student", fd);
      alert("Student registered successfully");
      window.location.reload();
    } catch { alert("Registration failed"); }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) { alert("Upload Excel file"); return; }
    const fd = new FormData();
    fd.append("file", excelFile);
    fd.append("teacherId", teacherId);
    fd.append("classId", classId);
    fd.append("yearId", yearId);
    fd.append("semId", semId);
    try {
      await axios.post("http://localhost:5000/students/bulk", fd);
      alert("Bulk upload successful");
      window.location.reload();
    } catch { alert("Upload failed"); }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.headerSection}>
          <div className={styles.iconCircle}><i className="fa-solid fa-user-plus" style={{ fontSize: 24 }}></i></div>
          <h2 className={styles.title}>Student Registration</h2>
          <p className={styles.subtitle}>Onboard a new student to the system</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Avatar Upload */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarRing}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className={styles.previewImg} />
              ) : (
                <div className={styles.photoPlaceholder}><i className="fa-solid fa-camera" style={{ fontSize: 32 }}></i></div>
              )}
            </div>
            <label className={styles.uploadBtn}>
              <i className="fa-solid fa-camera" style={{ marginRight: 6 }}></i> {photoPreview ? "Change Photo" : "Upload Photo"}
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label><i className="fa-solid fa-graduation-cap"></i> Student Name</label>
              <input type="text" placeholder="John Doe" value={studentName} onChange={e => setStudentName(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-envelope"></i> Email Address</label>
              <input type="email" placeholder="john@example.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-hashtag"></i> Roll Number</label>
              <input type="text" placeholder="1001" value={studentRollno} onChange={e => setStudentRollno(e.target.value.replace(/[^0-9]/g, ""))} required />
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-phone"></i> Contact Number</label>
              <input type="text" placeholder="9876543210" value={studentContact} onChange={e => setStudentContact(e.target.value.replace(/[^0-9]/g, ""))} required />
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-calendar-days"></i> Date of Birth</label>
              <input type="date" value={studentDob} onChange={e => setStudentDob(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-lock"></i> Access Password</label>
              <input type="password" placeholder="••••••••" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} required />
            </div>
          </div>

          <div className={styles.field} style={{ gridColumn: "span 2" }}>
            <label><i className="fa-solid fa-location-dot"></i> Residential Address</label>
            <input type="text" placeholder="123 Street, City..." value={studentAddress} onChange={e => setStudentAddress(e.target.value)} required />
          </div>

          <button type="submit" className={styles.button}>
            <i className="fa-solid fa-circle-check" style={{ marginRight: 8 }}></i> Complete Registration
          </button>
        </form>
      </div>

      <div className={styles.uploadBox}>
        <h3><i className="fa-solid fa-cloud-arrow-up" style={{ marginRight: 10 }}></i> Bulk Registration</h3>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Import students via Excel for batch processing</p>

        <div className={styles.selectGrid}>
          <div className={styles.selectWrap}>
            <i className="fa-solid fa-layer-group selectIcon"></i>
            <select value={classId} onChange={e => setClassId(e.target.value)}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
            </select>
          </div>
          <div className={styles.selectWrap}>
            <i className="fa-solid fa-calendar-check selectIcon"></i>
            <select value={yearId} onChange={e => setYearId(e.target.value)}>
              <option value="">Select Year</option>
              {years.map(y => <option key={y._id} value={y._id}>{y.yearName}</option>)}
            </select>
          </div>
          <div className={styles.selectWrap}>
            <i className="fa-solid fa-calendar-check selectIcon"></i>
            <select value={semId} onChange={e => setSemId(e.target.value)}>
              <option value="">Select Semester</option>
              {sems.map(s => <option key={s._id} value={s._id}>{s.semName}</option>)}
            </select>
          </div>
        </div>

        <input type="file" accept=".xlsx,.xls" className={styles.excelInput} onChange={e => setExcelFile(e.target.files[0])} />

        <button onClick={handleExcelUpload} disabled={!excelFile || !classId || !yearId || !semId} className={styles.uploadBtnMain}>
          Run Bulk Import
        </button>
      </div>
    </div>
  );
};

export default StudentRegistration;