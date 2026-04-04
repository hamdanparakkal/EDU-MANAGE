import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./LeaveUpload.module.css";
import {
  FaFileMedical,
  FaArrowLeft,
  FaCloudArrowUp,
  FaFileImage,
  FaFilePdf,
  FaXmark
} from "react-icons/fa6";

const LeaveUpload = () => {
  const { sid, semId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      Swal.fire({ icon: "warning", title: "Invalid file type", text: "Only JPG, PNG, or PDF allowed" }); return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: "warning", title: "File too large", text: "Maximum file size is 5MB" }); return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({ icon: "warning", title: "No file selected", text: "Please upload a medical certificate" }); return;
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("leaveFile", file);
      formData.append("studentId", sid);
      formData.append("semId", semId);
      await axios.post("http://localhost:5000/leave/upload", formData);
      Swal.fire({ icon: "success", title: "Leave Uploaded!", text: "Your medical certificate has been submitted.", timer: 1800, showConfirmButton: false })
        .then(() => navigate("/student/viewattendance"));
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Something went wrong. Please try again." });
    } finally { setUploading(false); }
  };

  const isPdf = file?.type === "application/pdf";

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>
          <div className={styles.headerIcon}><FaFileMedical /></div>
          <div>
            <h1 className={styles.title}>Medical Leave Upload</h1>
            <p className={styles.subtitle}>Submit your medical certificate for leave consideration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className={`${styles.dropZone} ${dragging ? styles.dragging : ""} ${file ? styles.hasFile : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            {file ? (
              <div className={styles.filePreview}>
                <div className={styles.fileIcon}>
                  {isPdf ? <FaFilePdf /> : <FaFileImage />}
                </div>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.name}</p>
                  <p className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button type="button" className={styles.removeBtn} onClick={() => setFile(null)}>
                  <FaXmark />
                </button>
              </div>
            ) : (
              <label className={styles.dropLabel} htmlFor="fileInput">
                <FaCloudArrowUp className={styles.uploadIcon} />
                <p className={styles.dropText}>Drag & drop your file here</p>
                <p className={styles.dropSub}>or click to browse</p>
                <div className={styles.acceptedTypes}>
                  <span>JPG</span><span>PNG</span><span>PDF</span>
                </div>
              </label>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </div>

          <div className={styles.infoBox}>
            <p>📋 <strong>Note:</strong> Upload a valid medical certificate. Maximum file size is 5MB.</p>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={uploading || !file}>
            <FaCloudArrowUp /> {uploading ? "Uploading..." : "Submit Leave Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeaveUpload;