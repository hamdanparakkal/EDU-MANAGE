import React from "react";
import { Routes, Route } from "react-router";

import StudentHome from "../Student/pages/StudentHome/StudentHome";
import Dashboard from "../Student/pages/Dashboard/Dashboard";
import Myprofile from "../Student/pages/Myprofile/Myprofile";
import Editprofile from "../Student/pages/Editprofile/Editprofile";
import Changepassword from "../Student/pages/Changepassword/Changepassword";
import Viewnotes from "../Student/pages/Viewnotes/Viewnotes";
import StudentNotefiles from "../Student/pages/StudentNotefiles/StudentNotefiles";
import Viewattendance from "../Student/pages/Viewattendance/Viewattendance";
import Viewinternalmark from "../Student/pages/Viewinternalmark/Viewinternalmark";
import Complaint from "../Student/pages/Complaint/Complaint";
import StudentFeedback from "../Student/pages/StudentFeedback/StudentFeedback";
import Payment from "../Student/pages/Payment/Payment";
import StudentChat from "../Student/pages/StudentChat/StudentChat";
import LeaveUpload from "../Student/pages/LeaveUpload/LeaveUpload";

const StudentRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="viewnotes" element={<Viewnotes />} />
      <Route path="myprofile" element={<Myprofile />} />
      <Route path="editprofile" element={<Editprofile />} />
      <Route path="changepassword" element={<Changepassword />} />
      <Route path="studentNotefiles" element={<StudentNotefiles />} />
      <Route path="viewattendance" element={<Viewattendance />} />
      <Route path="viewinternalmark" element={<Viewinternalmark />} />
      <Route path="complaint" element={<Complaint />} />
      <Route path="studentFeedback" element={<StudentFeedback />} />
      <Route path="payment/:id" element={<Payment />} />
      <Route path="studentchat" element={<StudentChat />} />
      <Route path="leave/:sid/:semId" element={<LeaveUpload />} />
    </Routes>
  );
};

export default StudentRouter;
