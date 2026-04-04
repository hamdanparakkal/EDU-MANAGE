import React, { useEffect, useState } from "react";
import styles from "./Sem.module.css";
import Button from "@mui/material/Button";
import axios from "axios";

const Sem = () => {
  const [sem, setsem] = useState("");
  const [semRows, setsemRows] = useState([]);
  const [semEdit, setsemEdit] = useState(null);

  const handleSave = async () => {

    if (!sem.trim()) {
      alert("Semester is required");
      return;
    }

    const numberPattern = /^[0-9]+$/;

    if (!numberPattern.test(sem)) {
      alert("Semester must contain numbers only");
      return;
    }

    const data = {
      semName: sem
    }

    if (semEdit == null) {
      axios.post("http://localhost:5000/sem", data).then((res) => {
        setsem("");
        fetchSem();
        alert(res.data.message);
      });
    } else {
      axios.put(`http://localhost:5000/sem/${semEdit}`, data).then((res) => {
        setsem("");
        setsemEdit(null);
        fetchSem();
        alert(res.data.message);
      }).catch((err) => {
        console.error(err)
      })
    }
  }

  const fetchSem = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sem");
      setsemRows(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditfetch = (id) => {
    const result = semRows.find((row) => row._id === id);
    if (result) {
      setsemEdit(result._id);
      setsem(result.semName);
    }
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/sem/${id}`).then((res) => {
      console.log(res.data.message);
      alert(res.data.message)
      fetchSem()
    }).catch((err) => {
      console.error(err)
    })
  }

  useEffect(() => {
    fetchSem();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-list-ol"></i> Semester Management</h2>
        <p className={styles.subtitle}>Configure and track academic semesters in the system.</p>
      </header>

      <div className={styles.contentGrid}>
        {/* ADD SEMESTER BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>{semEdit ? "Edit Semester" : "Add New Semester"}</h3>

          <div className={styles.field}>
            <label>Semester Number</label>
            <input
              type="text"
              placeholder="e.g. 1, 2, 3..."
              value={sem}
              maxLength={2}
              onChange={(e) => setsem(e.target.value)}
            />
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => { setsem(""); setsemEdit(null); }}>
              Clear
            </button>
            <button className={styles.submitBtn} onClick={handleSave}>
              {semEdit ? "Update" : "Save Semester"}
            </button>
          </div>
        </div>

        {/* SEMESTER LIST BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Planned Semesters</h3>

          <div className={styles.listWrapper}>
            {semRows.length > 0 ? (
              <div className={styles.listGrid}>
                {semRows.map((row, index) => (
                  <div key={row._id || index} className={styles.listRow}>
                    <div className={styles.rowInfo}>
                      <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                      <span className={styles.rowName}>Semester {row.semName}</span>
                    </div>

                    <div className={styles.rowActions}>
                      <button
                        className={styles.editBtn}
                        title="Edit Semester"
                        onClick={() => handleEditfetch(row._id)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        className={styles.deleteBtn}
                        title="Delete Semester"
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
                <i className="fa-solid fa-calendar-minus"></i>
                <p>No semesters found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sem;