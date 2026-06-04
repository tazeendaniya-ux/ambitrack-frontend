import { useEffect, useState, useRef } from "react";
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

    // live driver tracking
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

  // ================= ASSIGN AMBULANCE =================
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
      <h1 style={{ textAlign: "center" }}>🏥 Hospital Dashboard</h1>

      {/* MAP SECTION */}
      {selectedEmergency && (
        <div style={card}>
          <h2>🗺️ Live Tracking</h2>

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
            📍 {e.latitude}, {e.longitude}
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