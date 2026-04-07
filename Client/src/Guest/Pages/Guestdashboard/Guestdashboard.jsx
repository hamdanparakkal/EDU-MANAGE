import React from "react";
import styles from "./Guestdashboard.module.css";
import { useNavigate } from "react-router";

const Guestdashboard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* ─── Hero Section ─── */}
      <section className={styles.hero}>
        <div className={styles.blurBlob}></div>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <i className="fa-solid fa-sparkles"></i> The Future of Academic Management
          </div>
          <h1>
            Empowering Your <span>Institution</span> with Modern Intelligence
          </h1>
          <p>
            EduManage is an all-in-one academic ecosystem designed to streamline 
            administrative tasks, enhance student tracking, and bridge the communication 
            gap between teachers and students.
          </p>
          
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.floatingImages}>
            <div className={`${styles.floatImg} ${styles.img1}`}></div>
            <div className={`${styles.floatImg} ${styles.img2}`}></div>
            <div className={`${styles.floatImg} ${styles.img3}`}></div>
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className={styles.statsStrip}>
        <div className={styles.statItem}>
          <h3>10k+</h3>
          <p>Students Enrolled</p>
        </div>
        <div className={styles.statItem}>
          <h3>500+</h3>
          <p>Expert Teachers</p>
        </div>
        <div className={styles.statItem}>
          <h3>98%</h3>
          <p>Efficiency Gain</p>
        </div>
        <div className={styles.statItem}>
          <h3>24/7</h3>
          <p>AI Support</p>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Everything You Need to <span>Scale</span></h2>
          <p className={styles.sectionSub}>Comprehensive tools built for modern education hubs</p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.fIcon} style={{ background: "rgba(0, 198, 255, 0.1)", color: "#00c6ff" }}>
              <i className="fa-solid fa-user-graduate"></i>
            </div>
            <h3>Student Portal</h3>
            <p>Complete student lifecycle management from registration to graduation with detailed performance analytics.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.fIcon} style={{ background: "rgba(255, 78, 80, 0.1)", color: "#ff4e50" }}>
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <h3>Teacher Hub</h3>
            <p>Advanced attendance tracking, internal mark management, and course material distribution tools.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.fIcon} style={{ background: "rgba(67, 233, 123, 0.1)", color: "#43e97b" }}>
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3>Attendance Tracking</h3>
            <p>Seamless daily attendance monitoring with automated reports and bonus percentage calculation.</p>
          </div>

          
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className={styles.finalCta}>
        <div className={styles.ctaCard}>
          <h2>Ready to Transform Your <span>Institution?</span></h2>
          <p>Join hundreds of schools already using EduManage to digitalize their workflow.</p>
          <button onClick={() => navigate("/registration")}>
            Register as a Teacher Today <i className="fa-solid fa-circle-arrow-right"></i>
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 EduManage Academic Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Guestdashboard;