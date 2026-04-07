import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TeacherProfile.module.css";
import { Mail, Phone, Calendar, Users, BookOpen, Star, Briefcase, MapPin } from "lucide-react";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const tid = sessionStorage.getItem("tid");
    if (!tid) return;
    axios.get(`http://localhost:5000/teacher/${tid}`)
      .then((res) => setProfile(res.data.data))
      .catch(console.error);
  }, []);

  if (!profile) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading profile…</p>
      </div>
    );
  }

  const initials = profile.teacherName
    ? profile.teacherName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "TC";

  const dob = profile.teacherDob
    ? new Date(profile.teacherDob).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const stats = [
    { label: "Students", value: "10+", icon: <Users size={18} /> },
    { label: "Courses", value: "8", icon: <BookOpen size={18} /> },
    { label: "Rating", value: "4.8", icon: <Star size={18} /> },
    { label: "Years", value: "5", icon: <Briefcase size={18} /> },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.heroCard}>
        {/* decorative orbs */}
        <div className={styles.orb1} />
        <div className={styles.orb2} />

        {/* ── HORIZONTAL LAYOUT ── */}
        <div className={styles.horizontal}>

          {/* Left: Avatar */}
          <div className={styles.avatarCol}>
            <div className={styles.avatarWrap}>
              {!imgError ? (
                <img
                  src={`http://localhost:5000${profile.teacherPhoto}`}
                  alt="Teacher"
                  className={styles.avatar}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={styles.avatarFallback}>{initials}</div>
              )}
            </div>
            <div className={styles.activeBadge}>
              <span className={styles.activeDot} /> Active
            </div>
          </div>

          {/* Middle: Identity + Contacts */}
          <div className={styles.identityCol}>
            <span className={styles.roleTag}>Instructor</span>
            <h1 className={styles.name}>{profile.teacherName}</h1>
            <div className={styles.location}>
              <MapPin size={13} /> EduManage University, India
            </div>

            <div className={styles.contactsList}>
              {profile.teacherEmail && (
                <div className={styles.contactRow}>
                  <div className={styles.contactIcon}><Mail size={14} /></div>
                  <div>
                    <p className={styles.contactLabel}>Email</p>
                    <p className={styles.contactValue}>{profile.teacherEmail}</p>
                  </div>
                </div>
              )}
              {profile.teacherContact && (
                <div className={styles.contactRow}>
                  <div className={styles.contactIcon}><Phone size={14} /></div>
                  <div>
                    <p className={styles.contactLabel}>Contact</p>
                    <p className={styles.contactValue}>{profile.teacherContact}</p>
                  </div>
                </div>
              )}
              {dob && (
                <div className={styles.contactRow}>
                  <div className={styles.contactIcon}><Calendar size={14} /></div>
                  <div>
                    <p className={styles.contactLabel}>Date of Birth</p>
                    <p className={styles.contactValue}>{dob}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Stats */}
          <div className={styles.statsCol}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statItem} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className={styles.statIcon}>{s.icon}</div>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
