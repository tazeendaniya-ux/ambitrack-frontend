import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

// Components
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      {/* Global Navbar (visible on all pages) */}
      <Navbar />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/hospital" element={<HospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}