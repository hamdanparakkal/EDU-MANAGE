import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./Notes.module.css";
// Icons are now FontAwesome strings

const Notes = () => {
  const [notesTitle, setNotesTitle] = useState("");
  const [notesDetails, setNotesDetails] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semId, setSemId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sems, setSems] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [notesList, setNotesList] = useState([]);

  const teacherId = sessionStorage.getItem("tid");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchSems();
    fetchSubjects();
    fetchNotes();
  }, []);

  const fetchDepartments = async () => {
    try { const res = await axios.get("http://localhost:5000/department"); setDepartments(res.data.data || []); } catch (err) { console.error(err); }
  };
  const fetchCourses = async () => {
    try { const res = await axios.get("http://localhost:5000/course"); setCourses(res.data.data || []); } catch (err) { console.error(err); }
  };
  const fetchSems = async () => {
    try { const res = await axios.get("http://localhost:5000/sem"); setSems(res.data.data || []); } catch (err) { console.error(err); }
  };
  const fetchSubjects = async () => {
    try { const res = await axios.get("http://localhost:5000/subject"); setSubjects(res.data.data || []); } catch (err) { console.error(err); }
  };
  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/notes");
      const filtered = res.data.data.filter(n => String(n.teacherId) === String(teacherId));
      setNotesList(filtered);
    } catch (err) { console.error(err); }
  };

  const filteredCourses = courses.filter(course => String(course.departmentId) === String(departmentId));
  const filteredSubjects = subjects.filter(s => String(s.courseId) === String(courseId) && String(s.semId) === String(semId));

  const getSubjectName = (id) => subjects.find(s => s.subjectId === id)?.subjectName || "Unknown";
  const getSemName = (sid) => {
    const sub = subjects.find(s => s.subjectId === sid);
    return sems.find(s => s._id === sub?.semId)?.semName || "";
  };
  const getDeptCourseNames = (sid) => {
    const sub = subjects.find(s => s.subjectId === sid);
    const crs = courses.find(c => c.courseId === sub?.courseId);
    const dpt = departments.find(d => d._id === crs?.departmentId);
    return `${dpt?.departmentName || ""} • ${crs?.courseName || ""}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notesTitle || !notesDetails || !subjectId) { alert("All fields are required"); return; }
    try {
      await axios.post("http://localhost:5000/notes", { notesTitle, notesDetails, subjectId, teacherId });
      alert("Note created successfully");
      handleReset();
      fetchNotes();
    } catch { alert("Insert failed"); }
  };

  const handleReset = () => {
    setNotesTitle(""); setNotesDetails(""); setDepartmentId(""); setCourseId(""); setSemId(""); setSubjectId("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Course Materials</h1>
          <p className={styles.pageSub}>Create and manage study notes for your students</p>
        </div>

        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label><i className="fa-solid fa-font"></i> Note Title</label>
            <input type="text" placeholder="e.g. Intro to Quantum Mechanics" value={notesTitle} maxLength={20} onChange={(e) => setNotesTitle(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label><i className="fa-solid fa-file-lines"></i> Description</label>
            <textarea className={styles.textarea} placeholder="Write a brief overview..." value={notesDetails} maxLength={200} onChange={(e) => setNotesDetails(e.target.value)} required />
          </div>

          <div className={styles.filterGrid}>
            <div className={styles.field}>
              <label><i className="fa-solid fa-layer-group"></i> Department</label>
              <select className={styles.select} value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setCourseId(""); setSemId(""); setSubjectId(""); }}>
                <option value="">Choose Dept...</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-graduation-cap"></i> Course</label>
              <select className={styles.select} value={courseId} disabled={!departmentId} onChange={(e) => { setCourseId(e.target.value); setSemId(""); setSubjectId(""); }}>
                <option value="">{departmentId ? "Choose Course..." : "Select Dept First"}</option>
                {filteredCourses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-bookmark"></i> Semester</label>
              <select className={styles.select} value={semId} disabled={!courseId} onChange={(e) => { setSemId(e.target.value); setSubjectId(""); }}>
                <option value="">{courseId ? "Choose Sem..." : "Select Course First"}</option>
                {sems.map(s => <option key={s._id} value={s._id}>{s.semName}</option>)}
              </select>
            </div>
            <div className={styles.field}>
              <label><i className="fa-solid fa-book-open"></i> Subject</label>
              <select className={styles.select} value={subjectId} disabled={!semId} onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">{semId ? "Choose Subject..." : "Select Sem First"}</option>
                {filteredSubjects.map(s => <option key={s.subjectId} value={s.subjectId}>{s.subjectName}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.reset} onClick={handleReset}><i className="fa-solid fa-rotate-left" style={{ marginRight: 8 }}></i> Clear</button>
            <button type="submit" className={styles.save}><i className="fa-solid fa-paper-plane" style={{ marginRight: 8 }}></i> Publish Note</button>
          </div>
        </form>

        <div className={styles.listCard}>
          <h2><i className="fa-solid fa-clipboard-list" style={{ color: "#4f46e5", marginRight: 10 }}></i> Published Repository</h2>
          <div className={styles.scrollBox}>
            {notesList.length === 0 ? (
              <p className={styles.empty}>No notes published yet</p>
            ) : (
              <div className={styles.table}>
                {notesList.map((note, index) => (
                  <div key={note._id || note.notesId} className={styles.row}>
                    <div className={styles.colIndex}>{index + 1}</div>
                    <div className={styles.colContent}>
                      <span className={styles.noteTitle}>{note.notesTitle}</span>
                      <span className={styles.subjectBadge}>
                        {getDeptCourseNames(note.subjectId)} • Sem {getSemName(note.subjectId)} • {getSubjectName(note.subjectId)}
                      </span>
                    </div>
                    <div className={styles.colAction}>
                      <button className={styles.addFileBtn} onClick={() => navigate("/teacher/notefiles", { state: { noteId: note.notesId, notesTitle: note.notesTitle } })}>
                        <i className="fa-solid fa-plus" style={{ marginRight: 6 }}></i> Attach Files
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;