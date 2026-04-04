import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TeacherInfo.module.css";
// Icons are now FontAwesome strings

const TeacherInfo = () => {
  const [infoList, setInfoList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/info")
      .then(res => { setInfoList(res.data.data || []); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Information Board</h1>
        <p className={styles.pageSub}>Stay updated with the latest circulars and announcements</p>
      </div>

      {loading ? (
        <div className={styles.loadingWrap}>
          <div className={styles.spinner}></div>
          <p>Fetching announcements...</p>
        </div>
      ) : infoList.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><i className="fa-solid fa-box-open" style={{ fontSize: 40 }}></i></div>
          <p className={styles.emptyText}>Board is Clear</p>
          <p className={styles.emptySub}>Official updates will be posted here by the admin team.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {infoList.map((info, i) => (
            <div key={info._id} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}><i className="fa-solid fa-circle-info"></i></div>
                <div className={styles.dateChip}>
                  <i className="fa-solid fa-calendar-day" style={{ marginRight: 6, fontSize: 12 }}></i>
                  {new Date(info.infoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div className={styles.contentArea}>
                <h3 className={styles.cardTitle}>{info.infoDetails.split('\n')[0].substring(0, 40)}...</h3>
                <p className={styles.details}>{info.infoDetails}</p>
              </div>

              {info.infoFile && (
                <a href={`http://localhost:5000${info.infoFile}`} target="_blank" rel="noopener noreferrer" className={styles.fileBtn}>
                  <i className="fa-solid fa-download" style={{ marginRight: 8, fontSize: 14 }}></i> Download Attachment
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherInfo;