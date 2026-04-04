import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./EditTeacherProfile.module.css";
import { Camera, User, Mail, Phone, Save } from "lucide-react";

const EditTeacherProfile = () => {
    const nav = useNavigate();
    const tid = sessionStorage.getItem("tid");
    if (!tid) return null;

    const [teacherName, setTeacherName] = useState("");
    const [teacherEmail, setTeacherEmail] = useState("");
    const [teacherContact, setTeacherContact] = useState("");
    const [teacherPhoto, setTeacherPhoto] = useState("");
    const [newPhoto, setNewPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/teacher/${tid}`).then((res) => {
            const u = res.data.data;
            setTeacherName(u.teacherName);
            setTeacherEmail(u.teacherEmail);
            setTeacherContact(u.teacherContact);
            setTeacherPhoto(u.teacherPhoto);
        });
    }, [tid]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowed.includes(file.type)) { alert("Only JPG, JPEG, PNG allowed"); return; }
        if (file.size > 2 * 1024 * 1024) { alert("Image must be less than 2MB"); return; }
        setNewPhoto(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!/^[A-Z][a-zA-Z\s]*$/.test(teacherName)) { alert("Name must start with a capital letter and contain letters only"); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacherEmail)) { alert("Enter a valid email address"); return; }
        if (!/^[0-9]{10}$/.test(teacherContact)) { alert("Contact must be exactly 10 digits"); return; }

        const formData = new FormData();
        formData.append("teacherName", teacherName);
        formData.append("teacherContact", teacherContact);
        formData.append("teacherEmail", teacherEmail);
        if (newPhoto) formData.append("photo", newPhoto);

        try {
            await axios.put(`http://localhost:5000/teacher/${tid}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Profile updated successfully");
            nav("/teacher/teacherprofile");
        } catch {
            alert("Update failed");
        }
    };

    const displayPhoto = previewUrl || (teacherPhoto ? `http://localhost:5000${teacherPhoto}` : null);

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Edit Profile</h1>
                <p className={styles.pageSub}>Update your personal information</p>
            </div>

            <form className={styles.card} onSubmit={handleSave}>
                {/* Avatar */}
                <div className={styles.avatarSection}>
                    <div className={styles.avatarRing}>
                        {displayPhoto ? (
                            <img src={displayPhoto} alt="Profile" className={styles.avatar} />
                        ) : (
                            <div className={styles.avatar} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 800 }}>
                                {teacherName?.[0] || "T"}
                            </div>
                        )}
                    </div>
                    <label className={styles.changePhotoBtn}>
                        <Camera size={14} /> Change Photo
                        <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                    </label>
                    <p className={styles.photoHint}>JPG, PNG · Max 2MB</p>
                </div>

                {/* Form */}
                <div className={styles.formSection}>
                    <div className={styles.formRow}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}><User size={11} /> Full Name</label>
                            <input className={styles.input} name="teacherName" value={teacherName} maxLength={15}
                                onChange={(e) => setTeacherName(e.target.value)} placeholder="Enter your name" />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}><Phone size={11} /> Contact Number</label>
                            <input className={styles.input} name="teacherContact" value={teacherContact} maxLength={10}
                                onChange={(e) => setTeacherContact(e.target.value)} placeholder="10-digit number" />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}><Mail size={11} /> Email Address</label>
                        <input className={styles.input} name="teacherEmail" value={teacherEmail} maxLength={30}
                            onChange={(e) => setTeacherEmail(e.target.value)} placeholder="email@example.com" />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        <Save size={14} style={{ marginRight: 8 }} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTeacherProfile;