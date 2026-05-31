import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { io } from "socket.io-client";

export default function DriverDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const socketRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {
    socketRef.current = io("https://ambitrack-backend.onrender.com", {
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current.on("connect", () => {
      console.log("🚑 Driver socket connected:", socketRef.current.id);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ================= FETCH EMERGENCIES =================
  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await api.get("/emergency/all");
      setEmergencies(response.data.emergencies);
    } catch (error) {
      console.error("Fetch emergencies failed:", error);
    }
  };

  // ================= STATUS UPDATE =================
  const updateStatus = async (emergencyId, status) => {
    try {
      await api.put("/status/update", {
        emergencyId,
        status,
      });

      fetchEmergencies();

      socketRef.current?.emit("status-update", {
        emergencyId,
        status,
      });

      console.log("Status updated:", status);
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  // ================= GPS TRACKING =================
  const startTracking = () => {
    if (!socketRef.current) return;

    setTracking(true);

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const payload = {
          driverId: "D1",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // ✅ REQUIRED DEBUG LOG
        console.log("📍 Sending driver location:", payload);

        // ✅ SOCKET EMIT (THIS IS THE IMPORTANT FIX YOU ASKED FOR)
        socketRef.current.emit("driver-location", payload);
      },

      (err) => {
        console.error("GPS Error:", err);

        if (err.code === 1) alert("Location permission denied");
        if (err.code === 2) alert("Location unavailable");
        if (err.code === 3) console.warn("GPS timeout - retrying...");
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    setWatchId(id);
  };

  // ================= STOP TRACKING =================
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }

    setWatchId(null);
    setTracking(false);

    console.log("🛑 Tracking stopped");
  };

  return (
    <div style={container}>
      <h1>🚑 Driver Dashboard</h1>

      {/* GPS CONTROL */}
      <div style={card}>
        <h3>📍 Live Tracking Control</h3>

        {!tracking ? (
          <button onClick={startTracking} style={startBtn}>
            Start GPS Tracking
          </button>
        ) : (
          <button onClick={stopTracking} style={stopBtn}>
            Stop Tracking
          </button>
        )}
      </div>

      {/* EMERGENCIES */}
      {emergencies.length === 0 ? (
        <p>No emergencies found.</p>
      ) : (
        emergencies.map((emergency) => (
          <div key={emergency.id} style={card}>
            <h3>👤 {emergency.patientName}</h3>

            <p><b>Phone:</b> {emergency.phone}</p>
            <p><b>Type:</b> {emergency.emergencyType}</p>

            <p>
              <b>Status:</b>{" "}
              <span style={statusStyle(emergency.status)}>
                {emergency.status}
              </span>
            </p>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => updateStatus(emergency.id, "assigned")} style={btn}>
                Accept
              </button>

              <button onClick={() => updateStatus(emergency.id, "on_the_way")} style={btn}>
                On The Way
              </button>

              <button onClick={() => updateStatus(emergency.id, "arrived")} style={btn}>
                Arrived
              </button>

              <button
                onClick={() => updateStatus(emergency.id, "completed")}
                style={{ ...btn, background: "green" }}
              >
                Complete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------- UI STYLES ---------------- */

const container = {
  maxWidth: "1000px",
  margin: "30px auto",
  padding: "20px",
};

const card = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "15px",
  marginBottom: "15px",
  background: "#fff",
};

const btn = {
  marginRight: "10px",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  background: "#E53935",
  color: "white",
};

const startBtn = {
  padding: "10px 15px",
  background: "green",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const stopBtn = {
  padding: "10px 15px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const statusStyle = (status) => ({
  padding: "5px 10px",
  borderRadius: "20px",
  color: "white",
  background:
    status === "pending"
      ? "orange"
      : status === "assigned"
      ? "blue"
      : status === "on_the_way"
      ? "purple"
      : status === "arrived"
      ? "green"
      : "darkgreen",
});