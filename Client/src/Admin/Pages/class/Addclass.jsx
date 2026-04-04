import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Addclass.module.css";
import Button from "@mui/material/Button";

const Class = () => {
  const [className, setClassName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [classEdit, setClassEdit] = useState(null);

  /* FETCH DATA */

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/department");
    setDepartments(res.data.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/course");
    setCourses(res.data.data);
  };

  const fetchTeachers = async () => {
    const res = await axios.get("http://localhost:5000/approvedteacher");
    setTeachers(res.data.data);
  };

  const fetchClasses = async () => {
    const res = await axios.get("http://localhost:5000/class");
    setClasses(res.data.data);
  };

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchTeachers();
    fetchClasses();
  }, []);

  /* FILTER COURSES BY DEPARTMENT */

  const filteredCourses = courses.filter(
    (c) => String(c.departmentId) === String(departmentId)
  );

  /* ADD / UPDATE CLASS */

  const handleSubmit = async () => {

    // ===== VALIDATION =====

    if (!className.trim()) return alert("Class name required");

    const classPattern = /^[A-Za-z]$/;

    if (!classPattern.test(className)) {
      return alert("Class name must be a single alphabet letter (A-Z)");
    }

    if (!departmentId) return alert("Select department");
    if (!courseId) return alert("Select course");
    if (!teacherId) return alert("Select teacher");

    const data = {
      className: className.trim(),
      courseId,
      departmentId,
      teacherId,
    };

    try {
      if (classEdit === null) {
        const res = await axios.post("http://localhost:5000/class", data);
        alert(res.data.message);
      } else {
        const res = await axios.put(
          `http://localhost:5000/class/${classEdit}`,
          data
        );
        alert(res.data.message);
        setClassEdit(null);
      }

      setClassName("");
      setDepartmentId("");
      setCourseId("");
      setTeacherId("");

      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  /* EDIT FETCH */

  const handleEditfetch = (id) => {
    const result = classes.find((row) => row._id === id);

    if (result) {
      setClassEdit(result._id);
      setClassName(result.className);

      const course = courses.find(
        (c) => String(c._id || c.courseId) === String(result.courseId)
      );

      setDepartmentId(course?.departmentId || "");
      setCourseId(result.courseId);
      setTeacherId(result.teacherId);
    }
  };

  /* DELETE */

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/class/${id}`)
      .then((res) => {
        alert(res.data.message);
        fetchClasses();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-chalkboard-user"></i> Class Management</h2>
        <p className={styles.subtitle}>Assign teachers to classes and organize student groups.</p>
      </header>

      <div className={styles.contentGrid}>
        {/* ADD / EDIT CLASS BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>{classEdit ? "Edit Class" : "Add New Class"}</h3>

          <div className={styles.field}>
            <label>Class Name (Single Letter)</label>
            <input
              type="text"
              placeholder="e.g. A"
              value={className}
              maxLength={1}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Department</label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setCourseId("");
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

          <div className={styles.field}>
            <label>Course</label>
            <select
              value={courseId}
              disabled={!departmentId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">
                {departmentId ? "Select Course" : "Select Department First"}
              </option>
              {filteredCourses.map((c) => (
                <option key={c._id || c.courseId} value={c._id || c.courseId}>
                  {c.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Assigned Teacher</label>
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t._id || t.teacherId} value={t._id || t.teacherId}>
                  {t.teacherName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => {
              setClassName("");
              setDepartmentId("");
              setCourseId("");
              setTeacherId("");
              setClassEdit(null);
            }}>
              Clear
            </button>
            <button className={styles.submitBtn} onClick={handleSubmit}>
              {classEdit ? "Update" : "Save Class"}
            </button>
          </div>
        </div>

        {/* CLASS LIST BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Planned Classes</h3>

          <div className={styles.listWrapper}>
            {classes.length > 0 ? (
              <div className={styles.listGrid}>
                {classes.map((row, index) => {
                  const course = courses.find((c) => String(c._id || c.courseId) === String(row.courseId));
                  const teacher = teachers.find((t) => String(t._id || t.teacherId) === String(row.teacherId));
                  const department = departments.find((d) => String(d._id) === String(course?.departmentId));

                  return (
                    <div key={row._id} className={styles.listRow}>
                      <div className={styles.rowInfo}>
                        <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <span className={styles.rowName}>Class {row.className}</span>
                          <div className={styles.rowBadges}>
                            <span className={styles.badge}>{department?.departmentName || 'N/A'}</span>
                            <span className={styles.dot}>•</span>
                            <span className={styles.badge}>{course?.courseName || 'N/A'}</span>
                          </div>
                          <span className={styles.rowSubText}><i className="fa-solid fa-user-tie"></i> {teacher?.teacherName || 'Not Assigned'}</span>
                        </div>
                      </div>

                      <div className={styles.rowActions}>
                        <button
                          className={styles.editBtn}
                          title="Edit Class"
                          onClick={() => handleEditfetch(row._id)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button
                          className={styles.deleteBtn}
                          title="Delete Class"
                          onClick={() => handleDelete(row._id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.empty}>
                <i className="fa-solid fa-users-slash"></i>
                <p>No classes found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Class;