import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import styles from "./StudentNotefiles.module.css";
import { 
  FaFilePdf, 
  FaFileArrowDown, 
  FaArrowUpRightFromSquare,
  FaChevronLeft,
  FaFileLines
} from "react-icons/fa6";

const StudentNotefiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { noteId, notesTitle } = location.state || {};

  useEffect(() => {
    if (noteId) fetchFiles();
  }, [noteId]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/notesfiles/${noteId}`);
      setFiles(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Retrieving documents...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <FaChevronLeft /> Back to Notes
        </button>
        <div className={styles.titleArea}>
          <h1>Attached Materials</h1>
          <p>Files for: <strong>{notesTitle}</strong></p>
        </div>
      </header>

      <div className={styles.filesGrid}>
        {files.length === 0 ? (
          <div className={styles.emptyState}>
             <FaFileLines />
             <p>No documents found for this session</p>
          </div>
        ) : (
          files.map((file, index) => (
            <div key={index} className={styles.fileCard}>
              <div className={styles.fileIcon}>
                <FaFilePdf />
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{file.originalName}</span>
                <span className={styles.fileType}>Document • PDF / Image</span>
              </div>

              <div className={styles.actions}>
                <a
                  href={`http://localhost:5000/uploads/${file.notefilesFile}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.openBtn}
                  title="Open in new tab"
                >
                  <FaArrowUpRightFromSquare />
                </a>

                <a
                  href={`http://localhost:5000/uploads/${file.notefilesFile}`}
                  download={file.originalName}
                  className={styles.downloadBtn}
                  title="Download file"
                >
                  <FaFileArrowDown /> Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNotefiles;