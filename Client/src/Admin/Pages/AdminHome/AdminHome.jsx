import React from 'react'
import { Link } from 'react-router'
import AdminRouter from '../../../Router/AdminRouter'
import Sidebar from '../../Components/Sidebar/Sidebar'
import StyleS from './AdminHome.module.css'
import Navbar from '../../Components/Navbar/Navbar'

const AdminHome = () => {
  return (

    <div className={StyleS.shell}>
      {/* Background decoration elements */}
      <div className={StyleS.bg}>
        <div className={StyleS.orb1}></div>
        <div className={StyleS.orb2}></div>
        <div className={StyleS.orb3}></div>
        <div className={StyleS.orb4}></div>
        <div className={StyleS.gridLines}></div>
        <div className={StyleS.noise}></div>
      </div>

      <div className={StyleS.Main1}>
        <Navbar />
      </div>
      <div className={StyleS.Main}>
        <Sidebar />
        <div className={StyleS.Top}>
          <AdminRouter />
        </div>
      </div>

    </div>
  )
}

export default AdminHome