import React, { useState } from "react";
import axios from "axios";
import styles from "./Info.module.css";

const Info = () => {
  const [infoFile, setInfoFile] = useState(null);
  const [infoDetails, setInfoDetails] = useState("");
  const [infoDate, setInfoDate] = useState("");
  const [fileKey, setFileKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!infoFile || !infoDetails || !infoDate) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("infoFile", infoFile);
    formData.append("infoDetails", infoDetails);
    formData.append("infoDate", infoDate);

    try {
      const res = await axios.post(
        "http://localhost:5000/info",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message || "Information added");

      setInfoFile(null);
      setInfoDetails("");
      setInfoDate("");
      setFileKey((prev) => prev + 1);
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h2 className={styles.title}><i className="fa-solid fa-circle-info"></i> Information Management</h2>
        <p className={styles.subtitle}>Broadcast important announcements and academic files to the platform.</p>
      </header>

      <div className={styles.centerContent}>
        <div className={styles.glassCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Post New Information</h3>
            <p className={styles.cardSubtitle}>Ensure all details are accurate before publishing.</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Attachment <span className={styles.helper}>(PDF, Image, or Doc)</span></label>
              <div className={styles.fileUpload}>
                <input
                  key={fileKey}
                  type="file"
                  id="infoFile"
                  className={styles.fileInput}
                  onChange={(e) => setInfoFile(e.target.files[0])}
                />
                <label htmlFor="infoFile" className={styles.fileLabel}>
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <span>{infoFile ? infoFile.name : "Choose a file to upload"}</span>
                </label>
              </div>
            </div>

            <div className={styles.field}>
              <label>Summary Details</label>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-pen-nib"></i>
                <input
                  type="text"
                  value={infoDetails}
                  onChange={(e) => setInfoDetails(e.target.value)}
                  placeholder="What is this announcement about?"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Publish Date</label>
              <div className={styles.inputWrapper}>
                <i className="fa-solid fa-calendar-days"></i>
                <input
                  type="date"
                  value={infoDate}
                  onChange={(e) => setInfoDate(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              <i className="fa-solid fa-paper-plane"></i> Publish Information
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Info;
