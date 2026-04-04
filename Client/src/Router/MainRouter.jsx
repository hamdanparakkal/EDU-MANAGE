import React from 'react'
import { Route, Routes } from 'react-router'
import GuestHome from '../Guest/Pages/GuestHome/GuestHome'
import AdminHome from '../Admin/Pages/AdminHome/AdminHome'
import StudentHome from '../Student/pages/StudentHome/StudentHome'
import TeacherHome from '../Teacher/pages/TeacherHome/TeacherHome'

const MainRouter = () => {
  return (
    <div>
     <Routes>
       <Route path="/*" element={<GuestHome />} />
       <Route path="admin/*" element={<AdminHome />} />
       <Route path="student/*" element={<StudentHome />} />
       <Route path="teacher/*" element={<TeacherHome />} />
     </Routes></div>
  )
}

export default MainRouter
