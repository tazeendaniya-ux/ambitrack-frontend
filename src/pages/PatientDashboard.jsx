import StatCard from "../components/StatCard";
import { Ambulance, Clock3, MapPinned } from "lucide-react";
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
    socketRef.current = io(
      "https://ambitrack-backend.onrender.com",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
      }
    );

    socketRef.current.on("connect", () => {
      console.log("✅ Socket Connected");
    });

    socketRef.current.on("ambulance-update", (data) => {
      console.log("🚑 Ambulance Update:", data);

      if (!data) return;

      const driver =
        data?.D1 ||
        Object.values(data)[0];

      if (
        driver &&
        driver.lat !== undefined &&
        driver.lng !== undefined
      ) {
        setAmbulanceLocation({
          lat: Number(driver.lat),
          lng: Number(driver.lng),
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
    if (!patientName || !phone || !emergencyType) {
      toast.error("Please fill all fields");
      return;
    }

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
      () => {
        toast.error("Location access denied");
      },
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

      const emergencies = res.data?.emergencies || [];

      if (emergencies.length > 0) {
        const latest = emergencies[0];

        setLatestEmergency(latest);

        if (
          !ambulanceLocation ||
          !ambulanceLocation.lat
        ) {
          setAmbulanceLocation({
            lat: latest.latitude + 0.01,
            lng: latest.longitude + 0.01,
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
    const interval = setInterval(() => {
      if (!latestEmergency) return;

      setAmbulanceLocation((prev) => {
        const step = 0.0005;

        const lat =
          prev.lat > latestEmergency.latitude
            ? prev.lat - step
            : prev.lat + step;

        const lng =
          prev.lng > latestEmergency.longitude
            ? prev.lng - step
            : prev.lng + step;

        return { lat, lng };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [latestEmergency]);

  // ================= DISTANCE =================
  const getDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    if (
      lat1 == null ||
      lon1 == null ||
      lat2 == null ||
      lon2 == null
    )
      return 0;

    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  const getETA = (distance) => {
    const averageSpeed = 40;

    if (distance <= 0) return 0;

    return Math.ceil(
      (distance / averageSpeed) * 60
    );
  };

  const distance =
    latestEmergency &&
    ambulanceLocation
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
          }}
        >
          🚑 Patient Emergency Center
        </h1>

        <p style={{ color: "#64748B" }}>
          Request emergency assistance and
          track your ambulance in real time.
        </p>
      </div>

      <div style={cardStyle}>
        <h2>🚨 Request Emergency Ambulance</h2>

        <input
          style={inputStyle}
          placeholder="Patient Name"
          value={patientName}
          onChange={(e) =>
            setPatientName(e.target.value)
          }
        />

        <input
          style={inputStyle}
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        <input
          style={inputStyle}
          placeholder="Emergency Type"
          value={emergencyType}
          onChange={(e) =>
            setEmergencyType(e.target.value)
          }
        />

        <button
          style={sosBtn}
          onClick={handleSOS}
        >
          SEND SOS
        </button>
      </div>

      {latestEmergency && (
        <>
          <div className="stats-grid">
            <StatCard
              icon={<Ambulance size={32} />}
              title="Status"
              value={latestEmergency.status}
            />

            <StatCard
              icon={<MapPinned size={32} />}
              title="Distance"
              value={`${distance.toFixed(2)} km`}
            />

            <StatCard
              icon={<Clock3 size={32} />}
              title="ETA"
              value={`${eta.toFixed(0)} min`}
            />
          </div>

          <div style={cardStyle}>
            <h2>🚑 Live Tracking Status</h2>

            <p>
              <strong>Driver Location:</strong>{" "}
              {ambulanceLocation.lat.toFixed(6)},
              {" "}
              {ambulanceLocation.lng.toFixed(6)}
            </p>

            <p>
              <strong>Distance:</strong>{" "}
              {distance.toFixed(2)} km
            </p>

            <p>
              <strong>ETA:</strong> {eta} min
            </p>
          </div>

          <div style={cardStyle}>
            <h2
              style={{
                marginBottom: "20px",
              }}
            >
              🗺️ Live Ambulance Map
            </h2>

            <MapView
              patientLat={
                latestEmergency.latitude
              }
              patientLng={
                latestEmergency.longitude
              }
              ambulanceLat={
                ambulanceLocation.lat
              }
              ambulanceLng={
                ambulanceLocation.lng
              }
            />
          </div>
        </>
      )}
    </motion.div>
  );
}

const cardStyle = {
  padding: "24px",
  marginTop: "20px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.08)",
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
  background:
    "linear-gradient(135deg,#EF4444,#DC2626)",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "18px",
  fontWeight: "700",
  cursor: "pointer",
};

