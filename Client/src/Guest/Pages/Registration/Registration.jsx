import React, { useState } from "react";
import axios from "axios";
import styles from "./Registration.module.css";
import { Link } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Registration = () => {
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherContact, setTeacherContact] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherPhoto, setTeacherPhoto] = useState(null);
  const [teacherDob, setTeacherDob] = useState('');

  const [fileResetKey, setFileResetKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // NAME VALIDATION
    const namePattern = /^[A-Z][a-zA-Z\s]*$/;
    if (!teacherName.trim()) {
      alert("Name is required");
      return;
    }
    if (!namePattern.test(teacherName)) {
      alert("Name must start with a capital letter and contain letters only");
      return;
    }

    // EMAIL VALIDATION
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!teacherEmail.trim()) {
      alert("Email is required");
      return;
    }
    if (!emailPattern.test(teacherEmail)) {
      alert("Enter a valid email");
      return;
    }

    // CONTACT VALIDATION
    const contactPattern = /^[0-9]{10}$/;
    if (!contactPattern.test(teacherContact)) {
      alert("Contact must be valid and exactly 10 digits");
      return;
    }

    // DOB VALIDATION
    if (!teacherDob) {
      alert("Please select date of birth");
      return;
    }

    // PASSWORD VALIDATION
    if (!teacherPassword) {
      alert("Password is required");
      return;
    }

    // PHOTO VALIDATION
    if (!teacherPhoto) {
      alert("Please upload a profile photo");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg" , "image/webp"];
    if (!allowedTypes.includes(teacherPhoto.type)) {
      alert("Only JPG, JPEG, PNG , WEBP images are allowed");
      return;
    }

    if (teacherPhoto.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    // Check Email Uniqueness across all roles
    try {
      const [resAdmin, resTeacher, resStudent] = await Promise.all([
        axios.get("http://localhost:5000/admin"),
        axios.get("http://localhost:5000/teacher"),
        axios.get("http://localhost:5000/student")
      ]);

      const allEmails = [
        ...(resAdmin.data.data || []).map(u => u.adminEmail),
        ...(resTeacher.data.data || []).map(u => u.teacherEmail),
        ...(resStudent.data.data || []).map(u => u.studentEmail)
      ];

      if (allEmails.includes(teacherEmail)) {
        alert("email already existed");
        return;
      }
    } catch (error) {
      console.error("Error checking email uniqueness:", error);
    }


    // API call
    const fd = new FormData();
    fd.append('teacherName', teacherName);
    fd.append('teacherEmail', teacherEmail);
    fd.append('teacherContact', teacherContact);
    fd.append('teacherDob', teacherDob);
    fd.append('teacherPassword', teacherPassword);
    fd.append("photo", teacherPhoto);

    try {
      await axios.post('http://localhost:5000/teacher', fd);

      alert('Teacher registered');

      setTeacherName('');
      setTeacherEmail('');
      setTeacherContact('');
      setTeacherPassword('');
      setTeacherDob('');
      setTeacherPhoto(null);

      setFileResetKey(prev => prev + 1);

    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 20,
    today.getMonth(),
    today.getDate()
  ).toISOString().split("T")[0];

  return (
    <div className={styles.page}>
      <div className={styles.blurBlob}></div>
      <div className={styles.card}>

        <h2 className={styles.title}>Teacher Registration</h2>
        <p className={styles.subtitle}>
          Join EduManage Academic Platform
        </p>

        <form className={styles.form}>
          <div className={styles.field}>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              maxLength={15}
              onChange={e => setTeacherName(e.target.value)}
              value={teacherName}
            />
          </div>

          <div className={styles.field}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              maxLength={30}
              onChange={e => setTeacherEmail(e.target.value)}
              value={teacherEmail}
            />
          </div>

          <div className={styles.field}>
            <input
              type="text"
              name="contact"
              placeholder="Enter contact"
              required
              maxLength={10}
              onChange={e => setTeacherContact(e.target.value)}
              value={teacherContact}
            />
          </div>

          <div className={styles.field}>
            <DatePicker
              selected={teacherDob}
              onChange={(date) => setTeacherDob(date)}
              maxDate={new Date(maxDate)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select DOB"
              className={styles.dateInput}
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              required
              maxLength={15}
              onChange={e => setTeacherPassword(e.target.value)}
              value={teacherPassword}
            />
          </div>

          <div className={styles.field}>
            <label>Profile Photo</label>

            <div className={`${styles.fileUpload} ${teacherPhoto ? styles.uploaded : ""}`}>
              <input
                key={fileResetKey}
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => setTeacherPhoto(e.target.files[0])}
              />

              <span>{teacherPhoto ? `Photo Selected: ${teacherPhoto.name}` : "Upload Photo"}</span>
            </div>
          </div>

          <button type="submit" className={styles.button} onClick={handleSubmit}>
            Register
          </button>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginLink}>
              Login here
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
};

export default Registration;