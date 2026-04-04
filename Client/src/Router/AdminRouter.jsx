import React from 'react'
import AdminHome from '../Admin/Pages/AdminHome/AdminHome'
import { Route, Routes } from 'react-router'
import Sem from '../Admin/Pages/Sem/Sem'
import Department from '../Admin/Pages/Department/Department'
import Dashboard from '../Admin/Pages/Dashboard/Dashboard'
import Adminreg from '../Admin/Pages/Adminreg/Adminreg'
import Year from '../Admin/Pages/Year/Year'
import Course from '../Admin/Pages/Course/Course'
import Subject from '../Admin/Pages/Subject/Subject'
import Class from '../Admin/Pages/class/Addclass'
import Myprofile from '../Admin/Pages/Myprofile/Myprofile'
import Editprofile from '../Admin/Pages/Editprofile/Editprofile'
import Changepassword from '../Admin/Pages/Changepassword/Changepassword'
import Info from '../Admin/Pages/Info/Info'
import Viewcomplaint from '../Admin/Pages/Viewcomplaint/Viewcomplaint'
import Reply from '../Admin/Pages/Reply/Reply'
import ViewFeedback from '../Admin/Pages/ViewFeedback/ViewFeedback'
import ViewTeacher from '../Admin/Pages/ViewTeacher/ViewTeacher'
import ReportTeachers from '../Admin/Pages/ReportTeachers/ReportTeachers'
import TeacherStudents from '../Admin/Pages/TeacherStudents/TeacherStudents'
import AdminStudentAttendance from '../Admin/Pages/AdminStudentAttendance/AdminStudentAttendance'

const AdminRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="myprofile" element={<Myprofile />} />
      <Route path="editprofile" element={<Editprofile />} />
      <Route path="changepassword" element={<Changepassword />} />
      <Route path="Department" element={<Department />} />
      <Route path="sem" element={<Sem />} />
      <Route path="year" element={<Year />} />
      <Route path="Adminreg" element={<Adminreg />} />
      <Route path="course" element={<Course />} />
      <Route path="subject" element={<Subject />} />
      <Route path="info" element={<Info />} />
      <Route path="class" element={<Class />} />
      <Route path="viewcomplaint" element={<Viewcomplaint />} />
      <Route path="reply" element={<Reply />} />
      <Route path="viewFeedback" element={<ViewFeedback />} />
      <Route path="viewteacher" element={<ViewTeacher />} />
      <Route path="reportteachers" element={<ReportTeachers />} />
      <Route path="teacherstudents" element={<TeacherStudents />} />
      <Route
        path="student-attendance/:id"
        element={<AdminStudentAttendance />}
      />
    </Routes>
  )
}

export default AdminRouter