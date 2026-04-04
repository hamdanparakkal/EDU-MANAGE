import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Course.module.css";
import Button from "@mui/material/Button";

const Course = () => {
  const [courseName, setCourseName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courseEdit, setCourseEdit] = useState(null);

  // 🔹 Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/department");
      setDepartments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/course");
      setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
  }, []);

  // 🔹 Add / Update course
  const handleSubmit = async () => {

    if (!courseName.trim()) {
      alert("Course name required");
      return;
    }

    const namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(courseName)) {
      alert("Course name must contain letters only");
      return;
    }

    if (!departmentId) {
      alert("Select department");
      return;
    }

    const data = {
      courseName,
      departmentId,
    };

    try {
      if (courseEdit === null) {
        // ADD
        const res = await axios.post("http://localhost:5000/course", data);
        alert(res.data.message);
      } else {
        // UPDATE
        const res = await axios.put(
          `http://localhost:5000/course/${courseEdit}`,
          data
        );
        alert(res.data.message);
        setCourseEdit(null);
      }

      setCourseName("");
      setDepartmentId("");
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Edit fetch (like Department)
  const handleEditfetch = (id) => {
    const result = courses.find((row) => row.courseId === id);
    if (result) {
      setCourseEdit(result.courseId);
      setCourseName(result.courseName);
      setDepartmentId(result.departmentId);
    }
  };

  // 🔹 Delete course
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/course/${id}`)
      .then((res) => {
        alert(res.data.message);
        fetchCourses();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-graduation-cap"></i> Course Management</h2>
        <p className={styles.subtitle}>Define and organize academic courses by department.</p>
      </header>

      <div className={styles.contentGrid}>
        {/* ADD / EDIT COURSE */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>{courseEdit ? "Edit Course" : "Add New Course"}</h3>

          <div className={styles.field}>
            <label>Course Name</label>
            <input
              type="text"
              placeholder="e.g. B.Tech Computer Science"
              value={courseName}
              maxLength={15}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => {
              setCourseName("");
              setDepartmentId("");
              setCourseEdit(null);
            }}>
              Clear
            </button>
            <button className={styles.submitBtn} onClick={handleSubmit}>
              {courseEdit ? "Update" : "Save Course"}
            </button>
          </div>
        </div>

        {/* COURSE LIST */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Registered Courses</h3>

          <div className={styles.listWrapper}>
            {courses.length > 0 ? (
              <div className={styles.listGrid}>
                {courses.map((row, index) => {
                  const dept = departments.find((d) => d._id === row.departmentId);
                  return (
                    <div key={row.courseId} className={styles.listRow}>
                      <div className={styles.rowInfo}>
                        <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <span className={styles.rowName}>{row.courseName}</span>
                          <span className={styles.rowSubText}>{dept ? dept.departmentName : "No Department"}</span>
                        </div>
                      </div>

                      <div className={styles.rowActions}>
                        <button
                          className={styles.editBtn}
                          title="Edit Course"
                          onClick={() => handleEditfetch(row.courseId)}
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>

                        <button
                          className={styles.deleteBtn}
                          title="Delete Course"
                          onClick={() => handleDelete(row.courseId)}
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
                <i className="fa-solid fa-book"></i>
                <p>No courses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;