import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import styles from "./Editprofile.module.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLocationDot, 
  FaIdCard, 
  FaCamera, 
  FaFloppyDisk, 
  FaChevronLeft
} from "react-icons/fa6";
import Swal from "sweetalert2";

const Editprofile = () => {
  const nav = useNavigate();
  const sid = sessionStorage.getItem("sid");
  if (!sid) return null;

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentContact, setStudentContact] = useState("");
  const [studentRollno, setStudentRollno] = useState("");
  const [studentAddress, setStudentAddress] = useState("");
  const [studentPhoto, setStudentPhoto] = useState("");
  const [newPhoto, setNewPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/student/${sid}`).then((res) => {
      const u = res.data.data;
      setStudentName(u.studentName);
      setStudentEmail(u.studentEmail);
      setStudentContact(u.studentContact);
      setStudentRollno(u.studentRollno);
      setStudentAddress(u.studentAddress);
      setStudentPhoto(u.studentPhoto);
    });
  }, [sid]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg" , "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire("Error", "Only JPG, JPEG, PNG ,WEBP images allowed", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Error", "Image size must be less than 2MB", "error");
      return;
    }

    setNewPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const namePattern = /^[A-Z][a-zA-Z\s]*$/;
    if (!namePattern.test(studentName)) {
      Swal.fire("Validation Error", "Name must start with a capital letter and contain letters only", "warning");
      return;
    }

    const contactPattern = /^[0-9]{10}$/;
    if (!contactPattern.test(studentContact)) {
      Swal.fire("Validation Error", "Contact must be exactly 10 digits", "warning");
      return;
    }

    if (studentAddress.length > 30) {
      Swal.fire("Validation Error", "Address maximum length is 30 characters", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("studentEmail", studentEmail);
    formData.append("studentContact", studentContact);
    formData.append("studentRollno", studentRollno);
    formData.append("studentAddress", studentAddress);

    if (newPhoto) formData.append("photo", newPhoto);

    try {
      await axios.put(`http://localhost:5000/student/${sid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Success!",
        text: "Your profile has been updated.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => nav("/student/myprofile"), 1500);
    } catch (err) {
      Swal.fire("Error", "Update failed. Please try again.", "error");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => nav(-1)} className={styles.backBtn}>
          <FaChevronLeft /> Back
        </button>
        <div className={styles.titleArea}>
          <h1>Edit Profile</h1>
          <p>Keep your profile information accurate and up-to-date</p>
        </div>
      </header>

      <form className={styles.formCard} onSubmit={handleSave}>
        <div className={styles.sidebar}>
          <div className={styles.photoSection}>
            <div className={styles.avatarWrapper}>
              <img
                src={photoPreview || `http://localhost:5000${studentPhoto}`}
                alt="Profile"
                className={styles.avatar}
              />
              <label className={styles.cameraBtn}>
                <FaCamera />
                <input type="file" hidden onChange={handlePhotoChange} />
              </label>
            </div>
            <p className={styles.photoHint}>JPG, PNG or JPEG. Max size 2MB</p>
          </div>
        </div>

        <div className={styles.formArea}>
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label><FaUser /> Full Name</label>
              <input
                value={studentName}
                maxLength={15}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className={styles.inputGroup}>
              <label><FaEnvelope /> Email Address</label>
              <input value={studentEmail} readOnly className={styles.readOnly} />
            </div>

            <div className={styles.inputGroup}>
              <label><FaPhone /> Contact Number</label>
              <input
                value={studentContact}
                maxLength={10}
                onChange={(e) => setStudentContact(e.target.value)}
                placeholder="10 digit number"
              />
            </div>

            <div className={styles.inputGroup}>
              <label><FaIdCard /> Roll Number</label>
              <input value={studentRollno} disabled className={styles.disabled} />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label><FaLocationDot /> Permanent Address</label>
              <textarea
                rows="3"
                maxLength={30}
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                placeholder="Your address here..."
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>
              <FaFloppyDisk /> Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Editprofile;