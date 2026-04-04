import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Subject.module.css";
import Button from "@mui/material/Button";

const Subject = () => {
  const [subjectName, setSubjectName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semId, setSemId] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [sems, setSems] = useState([]);

  const [subjectEdit, setSubjectEdit] = useState(null);
  const [validationError, setValidationError] = useState("");

  // 🔹 FETCH DROPDOWNS
  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/department");
    setDepartments(res.data.data);
  };

  const fetchCourses = async () => {
    const res = await axios.get("http://localhost:5000/course");
    setCourses(res.data.data);
  };

  const fetchSems = async () => {
    const res = await axios.get("http://localhost:5000/sem");
    setSems(res.data.data);
  };

  // 🔹 FETCH SUBJECTS
  const fetchSubjects = async () => {
    const res = await axios.get("http://localhost:5000/subject");
    setSubjects(res.data.data);
  };

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchSems();
    fetchSubjects();
  }, []);

  // 🔹 FILTER COURSES BY DEPARTMENT
  const filteredCourses = courses.filter(
    (course) => course.departmentId === departmentId
  );

  // 🔹 VALIDATION FUNCTION - Check if subject exists in same department and semester
  const isSubjectDuplicate = () => {
    return subjects.some(sub =>
      sub.subjectName.toLowerCase() === subjectName.toLowerCase() &&
      sub.departmentId === departmentId &&
      sub.semId === semId &&
      (subjectEdit === null || sub.subjectId !== subjectEdit)
    );
  };

  // 🔹 ADD / UPDATE SUBJECT
  const handleSubmit = async () => {

    setValidationError("");

    if (!subjectName || !departmentId || !courseId || !semId) {
      setValidationError("Please fill all fields");
      return;
    }

    const subjectPattern = /^[A-Za-z0-9\s]+$/;

    if (!subjectPattern.test(subjectName)) {
      setValidationError("Subject name can contain letters and numbers only");
      return;
    }

    if (isSubjectDuplicate()) {
      setValidationError(
        `Subject "${subjectName}" already exists in this department for the selected semester`
      );
      return;
    }

    const data = {
      subjectName,
      departmentId,
      courseId,
      semId,
    };

    try {
      if (subjectEdit === null) {
        const res = await axios.post("http://localhost:5000/subject", data);
        alert(res.data.message);
      } else {
        const res = await axios.put(
          `http://localhost:5000/subject/${subjectEdit}`,
          data
        );
        alert(res.data.message);
        setSubjectEdit(null);
      }

      setSubjectName("");
      setDepartmentId("");
      setCourseId("");
      setSemId("");
      setValidationError("");
      fetchSubjects();
    } catch (err) {
      console.error(err);
      setValidationError(err.response?.data?.message || "An error occurred");
    }
  };

  // 🔹 EDIT FETCH
  const handleEditfetch = (id) => {
    const result = subjects.find((row) => row.subjectId === id);
    if (result) {
      setSubjectEdit(result.subjectId);
      setSubjectName(result.subjectName);
      setDepartmentId(result.departmentId);
      setCourseId(result.courseId);
      setSemId(result.semId);
      setValidationError("");
    }
  };

  // 🔹 DELETE SUBJECT
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const res = await axios.delete(`http://localhost:5000/subject/${id}`);
        alert(res.data.message);
        fetchSubjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 🔹 RESET FORM
  const handleCancel = () => {
    setSubjectName("");
    setDepartmentId("");
    setCourseId("");
    setSemId("");
    setSubjectEdit(null);
    setValidationError("");
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-book"></i> Subject Management</h2>
        <p className={styles.subtitle}>Manage academic subjects and link them to courses and semesters.</p>
      </header>

      <div className={styles.contentGrid}>
        {/* ADD / EDIT SUBJECT BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>{subjectEdit ? "Edit Subject" : "Add New Subject"}</h3>

          {validationError && (
            <div className={styles.errorMessage}>
              <i className="fa-solid fa-circle-exclamation"></i> {validationError}
            </div>
          )}

          <div className={styles.field}>
            <label>Department <span className={styles.required}>*</span></label>
            <select
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setCourseId("");
                setValidationError("");
              }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Course <span className={styles.required}>*</span></label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setValidationError("");
              }}
              disabled={!departmentId}
            >
              <option value="">
                {departmentId ? "Select Course" : "Select Department First"}
              </option>
              {filteredCourses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Semester <span className={styles.required}>*</span></label>
            <select
              value={semId}
              onChange={(e) => {
                setSemId(e.target.value);
                setValidationError("");
              }}
            >
              <option value="">Select Semester</option>
              {sems.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  {sem.semName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label>Subject Name <span className={styles.required}>*</span></label>
            <input
              type="text"
              placeholder="e.g. Advanced Mathematics"
              value={subjectName}
              maxLength={15}
              onChange={(e) => {
                setSubjectName(e.target.value);
                setValidationError("");
              }}
            />
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Clear
            </button>
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={!subjectName || !departmentId || !courseId || !semId}
            >
              {subjectEdit ? "Update" : "Save Subject"}
            </button>
          </div>
        </div>

        {/* SUBJECT LIST BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Academic Subjects</h3>

          <div className={styles.listWrapper}>
            {subjects.length > 0 ? (
              <div className={styles.listGrid}>
                {subjects.map((row, index) => {
                  const dept = departments.find((d) => d._id === row.departmentId);
                  const course = courses.find((c) => c.courseId === row.courseId);
                  const sem = sems.find((s) => s._id === row.semId);

                  return (
                    <div key={row.subjectId} className={styles.listRow}>
                      <div className={styles.rowInfo}>
                        <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <span className={styles.rowName}>{row.subjectName}</span>
                          <div className={styles.rowBadges}>
                            <span className={styles.badge}>{dept?.departmentName || 'N/A'}</span>
                            <span className={styles.dot}>•</span>
                            <span className={styles.badge}>{course?.courseName || 'N/A'}</span>
                            <span className={styles.dot}>•</span>
                            <span className={styles.badge}>Sem {sem?.semName || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.rowActions}>
                        <button
                          className={styles.editBtn}
                          title="Edit Subject"
                          onClick={() => handleEditfetch(row.subjectId)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button
                          className={styles.deleteBtn}
                          title="Delete Subject"
                          onClick={() => handleDelete(row.subjectId)}
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
                <i className="fa-solid fa-file-circle-xmark"></i>
                <p>No subjects found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subject;