import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import StudentRouter from "../../../Router/StudentRouter";
import styles from "./StudentHome.module.css";
import { useNavigate } from "react-router";
import axios from "axios";

const StudentHome = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const checkStatus = async () => {

      const sid = sessionStorage.getItem("sid");
      if (!sid) return;

      try {

        const res = await axios.get(`http://localhost:5000/student/status/${sid}`);
        console.log(res.data);
        

        if (res.data.studentStatus === 1) {

          sessionStorage.clear();

          alert("Your Student ID has expired. Please contact administration.");
          navigate("/guest/login");

        }

      } catch (err) {
        console.log(err);
      }

    };

    checkStatus();

    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <>
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className={`${styles.main} ${sidebarOpen ? styles.expanded : styles.collapsed
          }`}
      >
        <div className={styles.contentWrapper}>
          <StudentRouter />
        </div>
      </main>
    </>
  );
};

export default StudentHome;
