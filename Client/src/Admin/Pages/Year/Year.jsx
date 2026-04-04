import React, { useEffect, useState } from "react";
import styles from "./Year.module.css";
import Button from "@mui/material/Button";
import axios from "axios";

const Year = () => {
  const [year, setYear] = useState("");
  const [yearRows, setYearRows] = useState([]);
  const [yearEdit, setYearEdit] = useState(null);

  const handleSave = async () => {

    if (!year.trim()) {
      alert("Year is required");
      return;
    }

    const numberPattern = /^[0-9]+$/;

    if (!numberPattern.test(year)) {
      alert("Year must contain numbers only");
      return;
    }

    const data = {
      yearName: year,
    };

    if (yearEdit == null) {
      axios.post("http://localhost:5000/year", data).then((res) => {
        setYear("");
        fetchYear();
        alert(res.data.message);
      });
    } else {
      axios
        .put(`http://localhost:5000/year/${yearEdit}`, data)
        .then((res) => {
          setYear("");
          setYearEdit(null);
          fetchYear();
          alert(res.data.message);
        })
        .catch((err) => console.error(err));
    }
  };

  const fetchYear = async () => {
    try {
      const res = await axios.get("http://localhost:5000/year");
      setYearRows(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditfetch = (id) => {
    const result = yearRows.find((row) => row._id === id);
    if (result) {
      setYearEdit(result._id);
      setYear(result.yearName);
    }
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/year/${id}`)
      .then((res) => {
        alert(res.data.message);
        fetchYear();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchYear();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-calendar-days"></i> Academic Year Management</h2>
        <p className={styles.subtitle}>Define and manage academic cycles for the institution.</p>
      </header>

      <div className={styles.contentGrid}>
        {/* ADD YEAR BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>{yearEdit ? "Edit Year" : "Add New Year"}</h3>

          <div className={styles.field}>
            <label>Academic Year</label>
            <input
              type="text"
              placeholder="e.g. 2024"
              value={year}
              maxLength={4}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className={styles.formActions}>
            <button className={styles.cancelBtn} onClick={() => { setYear(""); setYearEdit(null); }}>
              Clear
            </button>
            <button className={styles.submitBtn} onClick={handleSave}>
              {yearEdit ? "Update" : "Save Year"}
            </button>
          </div>
        </div>

        {/* YEAR LIST BOX */}
        <div className={styles.glassCard}>
          <h3 className={styles.cardTitle}>Planned Years</h3>

          <div className={styles.listWrapper}>
            {yearRows.length > 0 ? (
              <div className={styles.listGrid}>
                {yearRows.map((row, index) => (
                  <div key={row._id || index} className={styles.listRow}>
                    <div className={styles.rowInfo}>
                      <span className={styles.rowIndex}>{String(index + 1).padStart(2, '0')}</span>
                      <span className={styles.rowName}>{row.yearName} Academic Year</span>
                    </div>

                    <div className={styles.rowActions}>
                      <button
                        className={styles.editBtn}
                        title="Edit Year"
                        onClick={() => handleEditfetch(row._id)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>

                      <button
                        className={styles.deleteBtn}
                        title="Delete Year"
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
                <i className="fa-solid fa-calendar-xmark"></i>
                <p>No years found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Year;