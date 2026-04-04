import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import styles from "./notefiles.module.css";
import { UploadCloud, FileUp, CheckCircle2, ArrowLeft } from "lucide-react";

const Notefiles = () => {
  const [notefilesFile, setFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { noteId, notesTitle } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notefilesFile || !noteId) { alert("File is required"); return; }
    const formData = new FormData();
    formData.append("notefilesFile", notefilesFile);
    formData.append("noteId", noteId);

    try {
      await axios.post("http://localhost:5000/notesfiles", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Note file uploaded successfully");
      navigate(-1);
    } catch { alert("Upload failed"); }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div style={{ alignSelf: "flex-start", marginBottom: 20 }}>
          <button type="button" onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#64748b", display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
            <ArrowLeft size={16} /> Back to Repository
          </button>
        </div>

        <div style={{ width: 64, height: 64, background: "rgba(99, 102, 241, 0.1)", borderRadius: 20, display: "flex", alignItems: "center", justifyCenter: "center", marginBottom: 20, margin: "0 auto 20px" }}>
          <UploadCloud size={32} color="#4f46e5" style={{ margin: "0 auto" }} />
        </div>

        <h2>Upload Resources</h2>
        <p className={styles.noteTitle}>Attaching to: <strong>{notesTitle}</strong></p>

        <input type="file" className={styles.input} onChange={(e) => setFile(e.target.files[0])} />

        <button type="submit" className={styles.button} disabled={!notefilesFile}>
          <FileUp size={18} /> Confirm Upload
        </button>
      </form>
    </div>
  );
};

export default Notefiles;
