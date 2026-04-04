import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import styles from "./ViewMedical.module.css";
import { Stethoscope, FileSearch, Check, X, ArrowLeft, ExternalLink } from "lucide-react";

const ViewMedical = () => {
    const { studentId, semId } = useParams();
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);

    const loadLeaves = () => {
        axios.get(`http://localhost:5000/leave/student/${studentId}/${semId}`)
            .then((res) => setLeaves(res.data.data))
            .catch(console.error);
    };

    useEffect(() => { loadLeaves(); }, [studentId, semId]);

    const handleApprove = async (id) => {
        try { await axios.put(`http://localhost:5000/leave/approve/${id}`); loadLeaves(); } catch (err) { console.error(err); }
    };
    const handleReject = async (id) => {
        try { await axios.put(`http://localhost:5000/leave/reject/${id}`); loadLeaves(); } catch (err) { console.error(err); }
    };

    return (
        <div className={styles.page}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
                <h2 className={styles.title} style={{ marginBottom: 0 }}>Medical Documentation</h2>
            </div>

            {leaves.length === 0 ? (
                <div className={styles.empty}>
                    <Stethoscope size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <p>No medical certificates found for this semester.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {leaves.map((l, i) => (
                        <div key={l._id} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div style={{ height: 120, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                <FileSearch size={40} />
                            </div>

                            <a href={`http://localhost:5000/uploads/${l.leaveFile}`} target="_blank" rel="noreferrer" className={styles.viewBtn}>
                                <ExternalLink size={14} /> Open Document
                            </a>

                            <p className={styles.status}>Status: <span style={{ color: l.status === 'Approved' ? '#10b981' : l.status === 'Rejected' ? '#f43f5e' : '#f59e0b' }}>{l.status}</span></p>

                            {l.status === "Pending" && (
                                <div className={styles.actions}>
                                    <button className={styles.approveBtn} onClick={() => handleApprove(l._id)}><Check size={14} /> Approve</button>
                                    <button className={styles.rejectBtn} onClick={() => handleReject(l._id)}><X size={14} /> Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewMedical;