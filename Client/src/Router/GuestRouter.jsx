import React from "react";
import { Routes, Route } from "react-router";
import Login from "../Guest/Pages/Login/Login";
import Registration from "../Guest/Pages/Registration/Registration";
import Guestdashboard from "../Guest/Pages/Guestdashboard/Guestdashboard";


const GuestRouter = () => {
  return (
    <Routes>



      <Route path="/" element={<Guestdashboard />} />
      <Route path="login" element={<Login />} />
      <Route path="registration" element={<Registration />} />



    </Routes>
  );
};

export default GuestRouter;