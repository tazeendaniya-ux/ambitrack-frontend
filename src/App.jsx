import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";

// Components
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 second splash

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
            padding: "12px 16px",
          },
        }}
      />

      {/* Global Navbar */}
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