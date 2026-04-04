import React, { useEffect, useState } from "react";
import styles from "./Department.module.css";
import Button from "@mui/material/Button";
import axios from "axios";

const Department = () => {
  const [department, setDepartment] = useState("");
  const [departmentRows, setDepartmentRows] = useState([]);
  const [departmentEdit, setDepartmentEdit] = useState(null);

  const handleSave = async () => {

    if (!department.trim()) {
      alert("Department name required");
      return;
    }

    const namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(department)) {
      alert("Department name must contain letters only");
      return;
    }

    const data = {
      departmentName: department
    }

    if (departmentEdit == null) {
      axios.post("http://localhost:5000/department", data).then((res) => {
        setDepartment("");
        fetchDepartment();
        alert(res.data.message);
      });
    } else {
      axios.put(`http://localhost:5000/department/${departmentEdit}`, data).then((res) => {
        setDepartment("");
        setDepartmentEdit(null);
        fetchDepartment();
        alert(res.data.message);
      }).catch((err) => {
        console.error(err)
      })
    }
  }

  const fetchDepartment = async () => {
    try {
      const res = await axios.get("http://localhost:5000/department");
      setDepartmentRows(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditfetch = (id) => {
    const result = departmentRows.find((row) => row._id === id);
    if (result) {
      setDepartmentEdit(result._id);
      setDepartment(result.departmentName);
    }
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/department/${id}`).then((res) => {
      console.log(res.data.message);
      alert(res.data.message)
      fetchDepartment()
    }).catch((err) => {
      console.error(err)
    })
  }

  useEffect(() => {
    fetchDepartment();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-building-columns"></i> Department Management</h2>
        <p className={styles.subtitle}>Create and manage academic departments within the system.</p>
      </header>

      <div className={styles.contentGrid}>
        {/* ADD DEPARTMENT BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>{departmentEdit ? "Edit Department" : "Add New Department"}</h3>

          <div className={styles.field}>
            <label>Department Name</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={department}
              maxLength={15}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => { setDepartment(""); setDepartmentEdit(null); }}>
              Clear
            </button>
            <button className={styles.submitBtn} onClick={handleSave}>
              {departmentEdit ? "Update" : "Save Department"}
            </button>
          </div>
        </div>

        {/* DEPARTMENT LIST BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Current Departments</h3>

          <div className={styles.listWrapper}>
            {departmentRows.length > 0 ? (
              <div className={styles.listGrid}>
                {departmentRows.map((row, index) => (
                  <div key={row._id || index} className={styles.listRow}>
                    <div className={styles.rowInfo}>
                      <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                      <span className={styles.rowName}>{row.departmentName}</span>
                    </div>

                    <div className={styles.rowActions}>
                      <button
                        className={styles.editBtn}
                        title="Edit Department"
                        onClick={() => handleEditfetch(row._id)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        className={styles.deleteBtn}
                        title="Delete Department"
                        onClick={() => handleDelete(row._id)}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <i className="fa-solid fa-folder-open"></i>
                <p>No departments found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;