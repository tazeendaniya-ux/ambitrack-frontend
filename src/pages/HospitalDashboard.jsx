import { useEffect, useState } from "react";
import api from "../services/api";

export default function HospitalDashboard() {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await api.get("/emergency/all");
      setEmergencies(response.data.emergencies);
    } catch (error) {
      console.error(error);
      alert("Failed to load emergencies");
    }
  };

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1>🏥 Hospital Dashboard</h1>

      {emergencies.length === 0 ? (
        <p>No emergencies found.</p>
      ) : (
        emergencies.map((e) => (
          <div
            key={e.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <h3>👤 {e.patientName}</h3>

            <p>
              <strong>Phone:</strong> {e.phone}
            </p>

            <p>
              <strong>Emergency Type:</strong> {e.emergencyType}
            </p>

            <p>
              <strong>Status:</strong> {e.status}</p>

            <p>
              <strong>Location:</strong><br />
              Lat: {e.latitude}<br />
              Lng: {e.longitude}
            </p>
          </div>
        ))
      )}
    </div>
  );
}import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import MapView from "../components/MapView";
import toast from "react-hot-toast";

export default function HospitalDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [driverLocations, setDriverLocations] = useState({});

  const socketRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {
    socketRef.current = io("https://ambitrack-backend.onrender.com", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("🏥 Hospital socket connected");
    });

    // listen driver live location
    socketRef.current.on("driver-location", (data) => {
      setDriverLocations((prev) => ({
        ...prev,
        [data.driverId]: {
          lat: data.lat,
          lng: data.lng,
        },
      }));
    });

    return () => socketRef.current?.disconnect();
  }, []);

  // ================= FETCH EMERGENCIES =================
  useEffect(() => {
    fetchEmergencies();

    const interval = setInterval(fetchEmergencies, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmergencies = async () => {
    try {
      const res = await api.get("/emergency/all");
      setEmergencies(res.data?.emergencies || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ASSIGN DRIVER =================
  const assignDriver = async (emergencyId) => {
    try {
      await api.put("/status/update", {
        emergencyId,
        status: "assigned",
      });

      socketRef.current?.emit("status-update", {
        emergencyId,
        status: "assigned",
      });

      toast.success("Ambulance assigned");
      fetchEmergencies();
    } catch (err) {
      toast.error("Failed to assign driver");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={container}
    >
      {/* HEADER */}
      <h1 style={{ textAlign: "center" }}>
        🏥 Hospital Dashboard
      </h1>

      {/* MAP */}
      {selectedEmergency && (
        <div style={card}>
          <h2>🗺️ Emergency Tracking</h2>

          <MapView
            patientLat={selectedEmergency.latitude}
            patientLng={selectedEmergency.longitude}
            ambulanceLat={
              driverLocations[selectedEmergency.driverId]?.lat
            }
            ambulanceLng={
              driverLocations[selectedEmergency.driverId]?.lng
            }
          />
        </div>
      )}

      {/* EMERGENCIES LIST */}
      {emergencies.map((e) => (
        <div key={e.id} style={card}>
          <h2>🚨 {e.patientName}</h2>

          <p>📞 {e.phone}</p>
          <p>🚑 Type: {e.emergencyType}</p>
          <p>📌 Status: {e.status}</p>

          <p>
            📍 Lat: {e.latitude} | Lng: {e.longitude}
          </p>

          <div style={btnRow}>
            <button
              style={viewBtn}
              onClick={() => setSelectedEmergency(e)}
            >
              View Map
            </button>

            <button
              style={assignBtn}
              onClick={() => assignDriver(e.id)}
            >
              Assign Ambulance
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

/* ================= STYLES ================= */

const container = {
  maxWidth: "1100px",
  margin: "30px auto",
  padding: "20px",
};

const card = {
  background: "#fff",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "15px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const btnRow = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const viewBtn = {
  padding: "10px 15px",
  background: "#2563EB",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const assignBtn = {
  padding: "10px 15px",
  background: "#10B981",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};