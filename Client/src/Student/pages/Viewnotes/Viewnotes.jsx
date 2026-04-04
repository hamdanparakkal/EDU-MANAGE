import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Viewnotes.module.css";
import { useNavigate } from "react-router";
import {
  FaBookOpen,
  FaMagnifyingGlass,
  FaUserTie,
  FaLayerGroup,
  FaFileLines,
  FaChevronRight,
  FaFilter
} from "react-icons/fa6";

const Viewnotes = () => {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sems, setSems] = useState([]);

  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semId, setSemId] = useState("");

  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/notes").then((res) => setNotes(res.data.data));
    axios.get("http://localhost:5000/subject").then((res) => setSubjects(res.data.data));
    axios.get("http://localhost:5000/department").then((res) => setDepartments(res.data.data));
    axios.get("http://localhost:5000/course").then((res) => setCourses(res.data.data));
    axios.get("http://localhost:5000/sem").then((res) => setSems(res.data.data));
  }, []);

  const filteredCourses = courses.filter(
    (c) => String(c.departmentId) === String(departmentId)
  );

  const filteredSubjects = subjects.filter(
    (s) =>
      String(s.courseId) === String(courseId) &&
      String(s.semId) === String(semId)
  );

  const handleSearch = () => {
    if (!departmentId || !courseId || !semId) return;

    setLoading(true);

    const subjectIds = filteredSubjects.map((s) => String(s.subjectId));
    const result = notes.filter((n) =>
      subjectIds.includes(String(n.subjectId))
    );

    setTimeout(() => {
      setFilteredNotes(result);
      setLoading(false);
    }, 600);
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerArea}>
        <div className={styles.titleArea}>
          <h1>Study Resources</h1>
          <p>Access curated notes and materials shared by your faculty</p>
        </div>
      </header>

      <div className={styles.filterCard}>
        <div className={styles.filterHeader}>
          <h2>
            <FaFilter /> Filter Content
          </h2>
        </div>

        <div className={styles.filterGrid}>
          <div className={styles.selectGroup}>
            <label>Department</label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setCourseId("");
                setSemId("");
              }}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label>Course</label>
            <select
              value={courseId}
              disabled={!departmentId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSemId("");
              }}
            >
              <option value="">
                {departmentId ? "Select Course" : "Select Department"}
              </option>
              {filteredCourses.map((c) => (
                <option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectGroup}>
            <label>Semester</label>
            <select
              value={semId}
              disabled={!courseId}
              onChange={(e) => setSemId(e.target.value)}
            >
              <option value="">
                {courseId ? "Select Semester" : "Select Course"}
              </option>
              {sems.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.semName}
                </option>
              ))}
            </select>
          </div>

          <button
            className={styles.searchBtn}
            onClick={handleSearch}
            disabled={!semId || loading}
          >
            {loading ? (
              "Filtering..."
            ) : (
              <>
                <FaMagnifyingGlass /> Search Notes
              </>
            )}
          </button>
        </div>
      </div>

      <div className={styles.notesList}>
        {filteredNotes.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FaBookOpen />
            </div>
            <h3>No Notes Selected</h3>
            <p>
              Use the filters above to find specific study materials for your
              subjects.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredNotes.map((note) => (
              <div key={note.notesId} className={styles.noteCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.noteIcon}>
                    <FaFileLines />
                  </div>
                  <h3 className={styles.noteTitle}>{note.notesTitle}</h3>
                </div>

                <p className={styles.details}>{note.notesDetails}</p>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <FaUserTie />
                    <span>{note.teacherName}</span>
                  </div>

                  <div className={styles.metaItem}>
                    <FaLayerGroup />
                    <span>{note.subjectName}</span>
                  </div>
                </div>

                <button
                  className={styles.viewBtn}
                  onClick={() =>
                    navigate("/student/studentNotefiles", {
                      state: {
                        noteId: note.notesId,
                        notesTitle: note.notesTitle,
                      },
                    })
                  }
                >
                  Explore Material <FaChevronRight />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Viewnotes;