import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import MapView from "../components/MapView";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

export default function PatientDashboard() {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [latestEmergency, setLatestEmergency] = useState(null);

  const [ambulanceLocation, setAmbulanceLocation] = useState({
    lat: 17.42,
    lng: 78.41,
  });

  const socketRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {
    socketRef.current = io("https://ambitrack-backend.onrender.com", {
      transports: ["polling"],
      reconnection: true,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket Connected");
    });

    socketRef.current.on("ambulance-update", (data) => {
      console.log("🚑 SOCKET DATA:", data);

      if (!data) return;

      const driver = data["D1"];

      if (driver?.lat && driver?.lng) {
        setAmbulanceLocation({
          lat: driver.lat,
          lng: driver.lng,
        });
      }
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("❌ Socket Error:", err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ================= SOS =================
  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.post("/emergency/request", {
            patientName,
            phone,
            emergencyType,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          toast.success("🚑 Emergency request sent!");

          setPatientName("");
          setPhone("");
          setEmergencyType("");

          fetchLatestEmergency();
        } catch (err) {
          console.log(err);
          toast.error("Failed to send request");
        }
      },
      () => toast.error("Location access denied"),
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    );
  };

  // ================= FETCH =================
  const fetchLatestEmergency = async () => {
    try {
      const res = await api.get("/emergency/all");

      console.log("Emergency Data:", res.data);

      const all = res.data.emergencies;

      if (all?.length) {
        setLatestEmergency(all[0]);

        if (!ambulanceLocation) {
          setAmbulanceLocation({
            lat: all[0].latitude + 0.01,
            lng: all[0].longitude + 0.01,
          });
        }
      }
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  // ================= AUTO REFRESH =================
  useEffect(() => {
    fetchLatestEmergency();

    const timer = setInterval(() => {
      fetchLatestEmergency();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // ================= DEMO MOVEMENT =================
  useEffect(() => {
    const moveAmbulance = setInterval(() => {
      setAmbulanceLocation((prev) => {
        if (!prev || !latestEmergency) return prev;

        const newLat =
          prev.lat > latestEmergency.latitude
            ? prev.lat - 0.0005
            : prev.lat + 0.0005;

        const newLng =
          prev.lng > latestEmergency.longitude
            ? prev.lng - 0.0005
            : prev.lng + 0.0005;

        return {
          lat: newLat,
          lng: newLng,
        };
      });
    }, 5000);

    return () => clearInterval(moveAmbulance);
  }, [latestEmergency]);

  // ================= DISTANCE =================
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat2 || !lon2) return 0;

    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  const getETA = (distance) => {
    if (!distance) return 0;

    const averageSpeed = 40;

    return (distance / averageSpeed) * 60;
  };

  const distance =
    latestEmergency && ambulanceLocation
      ? getDistance(
          latestEmergency.latitude,
          latestEmergency.longitude,
          ambulanceLocation.lat,
          ambulanceLocation.lng
        )
      : 0;

  const eta = getETA(distance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "0 20px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "2.8rem",
            color: "#0F172A",
            marginBottom: "10px",
          }}
        >
          🚑 Patient Emergency Center
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "1rem",
          }}
        >
          Request emergency assistance and track your ambulance in real time.
        </p>
      </div>

      {/* STATS */}
      {latestEmergency && (
        <div style={statsGrid}>
          <div style={statCard}>
            <h3>🚨 Status</h3>
            <p style={statValue}>{latestEmergency.status}</p>
          </div>

          <div style={statCard}>
            <h3>📍 Distance</h3>
            <p style={statValue}>{distance.toFixed(2)} km</p>
          </div>

          <div style={statCard}>
            <h3>⏳ ETA</h3>
            <p style={statValue}>{eta.toFixed(0)} min</p>
          </div>
        </div>
      )}

      {/* SOS FORM */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px" }}>
          🚨 Request Emergency Ambulance
        </h2>

        <input
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Emergency Type"
          value={emergencyType}
          onChange={(e) => setEmergencyType(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleSOS} style={sosBtn}>
          🚨 Request Ambulance
        </button>
      </div>

      {/* STATUS */}
      {latestEmergency && (
        <div style={cardStyle}>
          <h2>🚑 Live Tracking Status</h2>

          <p>
            <strong>Driver Location:</strong>{" "}
            {ambulanceLocation
              ? `${ambulanceLocation.lat.toFixed(
                  6
                )}, ${ambulanceLocation.lng.toFixed(6)}`
              : "Not Connected"}
          </p>

          <p>
            <strong>Distance:</strong> {distance.toFixed(2)} km
          </p>

          <p>
            <strong>ETA:</strong> {eta.toFixed(0)} minutes
          </p>
        </div>
      )}

      {/* MAP */}
      {latestEmergency && (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>
            🗺️ Live Ambulance Map
          </h2>

          <MapView
            patientLat={latestEmergency.latitude}
            patientLng={latestEmergency.longitude}
            ambulanceLat={ambulanceLocation?.lat}
            ambulanceLng={ambulanceLocation?.lng}
          />
        </div>
      )}
    </motion.div>
  );
}

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "20px",
};

const statCard = {
  background: "#fff",
  borderRadius: "18px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const statValue = {
  fontSize: "1.4rem",
  fontWeight: "700",
  marginTop: "10px",
};

const cardStyle = {
  padding: "24px",
  marginTop: "20px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid #CBD5E1",
  fontSize: "16px",
};

const sosBtn = {
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg,#EF4444,#DC2626)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "18px",
};