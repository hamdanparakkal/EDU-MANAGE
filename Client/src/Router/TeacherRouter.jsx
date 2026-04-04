import React from "react";
import { Routes, Route } from "react-router";
import Dashboard from "../Teacher/pages/Dashboard/Dashboard";
import EditTeacherProfile from "../Teacher/pages/EditTeacherProfile/EditTeacherProfile";
import TeacherProfile from "../Teacher/pages/TeacherProfile/TeacherProfile";
import TeacherChangePassword from "../Teacher/pages/TeacherChangePassword/TeacherChangePassword";
import Notes from "../Teacher/pages/notes/notes";
import Notefiles from "../Teacher/pages/notefiles/notefiles";
import Attendance from "../Teacher/pages/Attendance/Attendance";
import AddAttendance from "../Teacher/pages/AddAttendance/AddAttendance";
import StudentRegistration from "../Teacher/pages/StudentRegistration/StudentRegistration";
import Internalmark from "../Teacher/pages/Internalmark/Internalmark";
import AddInternalmark from "../Teacher/pages/AddInternalmark/AddInternalmark";
import TeacherFeedback from "../Teacher/pages/TeacherFeedback/TeacherFeedback";
import MyStudents from "../Teacher/pages/MyStudents/MyStudents";
import TeacherViewAttendance from "../Teacher/pages/TeacherViewAttendance/TeacherViewAttendance";
import TeacherChatPage from "../Teacher/pages/TeacherChatPage/TeacherChatPage";
import TeacherChatList from "../Teacher/pages/TeacherChatList/TeacherChatList";
import ViewMedical from "../Teacher/pages/ViewMedical/ViewMedical";
import TeacherInfo from "../Teacher/pages/TeacherInfo/TeacherInfo";


const TeacherRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/teacherprofile" element={<TeacherProfile />} />
      <Route path="/editprofile" element={<EditTeacherProfile />} />
      <Route path="/changepassword" element={<TeacherChangePassword />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/notefiles" element={<Notefiles />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/addattendance" element={<AddAttendance />} />
      <Route path="/studentregistration" element={<StudentRegistration />} />
      <Route path="/internalmark" element={<Internalmark />} />
      <Route path="/addinternalmark" element={<AddInternalmark />} />
      <Route path="/teacherFeedback" element={<TeacherFeedback />} />
      <Route path="/mystudents" element={<MyStudents />} />
      <Route path="/TeacherChatPage/:id" element={<TeacherChatPage />} />
      <Route path="/TeacherChatList" element={<TeacherChatList />} />
      <Route path="/teacherviewattendance/:id" element={<TeacherViewAttendance />} />
      <Route path="/viewmedical/:studentId/:semId" element={<ViewMedical />} />
      <Route path="/info" element={<TeacherInfo />} />

    </Routes>
  );
};

export default TeacherRouter;
