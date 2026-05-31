import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import MapView from "../components/MapView";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

export default function PatientDashboard() {
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [latestEmergency, setLatestEmergency] = useState(null);

  // Demo ambulance location
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

          alert("🚑 Emergency sent!");

          setPatientName("");
          setPhone("");
          setEmergencyType("");

          fetchLatestEmergency();
        } catch (err) {
          console.log(err);
          alert("Failed to send request");
        }
      },
      () => alert("Location error"),
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

  // ================= DEMO AMBULANCE MOVEMENT =================
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

    const averageSpeed = 40; // km/h

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
      style={{
        maxWidth: 900,
        margin: "40px auto",
      }}
    >
      <h1>🚑 Patient Dashboard</h1>

      {/* SOS FORM */}
      <div style={cardStyle}>
        <input
          placeholder="Name"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Phone"
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
          🚨 SOS
        </button>
      </div>

      {/* STATUS */}
      {latestEmergency && (
        <div style={cardStyle}>
          <h3>Status: {latestEmergency.status}</h3>

          <p>
            Driver Location:{" "}
            {ambulanceLocation
              ? `${ambulanceLocation.lat.toFixed(6)}, ${ambulanceLocation.lng.toFixed(6)}`
              : "Not Connected"}
          </p>

          <p>Distance: {distance.toFixed(2)} km</p>

          <p>ETA: {eta.toFixed(0)} min</p>
        </div>
      )}

      {/* MAP */}
      {latestEmergency && (
        <div style={cardStyle}>
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

const cardStyle = {
  padding: 20,
  marginTop: 20,
  background: "#fff",
  borderRadius: 10,
};

const inputStyle = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
};

const sosBtn = {
  width: "100%",
  padding: 15,
  background: "red",
  color: "white",
  border: "none",
  cursor: "pointer",
};