import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import MapView from "../components/MapView";
import StatCard from "../components/StatCard";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Ambulance,
  MapPinned,
  CheckCircle,
} from "lucide-react";

export default function DriverDashboard() {
  const [emergencies, setEmergencies] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const [driverLocation, setDriverLocation] =
    useState(null);

  const socketRef = useRef(null);

  // ================= SOCKET =================
  useEffect(() => {
    socketRef.current = io(
      "https://ambitrack-backend.onrender.com",
      {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        timeout: 20000,
      }
    );

    socketRef.current.on("connect", () => {
      console.log(
        "🚑 Driver socket connected:",
        socketRef.current.id
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ================= FETCH =================
  useEffect(() => {
    fetchEmergencies();

    const timer = setInterval(() => {
      fetchEmergencies();
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const fetchEmergencies = async () => {
    try {
      const response = await api.get(
        "/emergency/all"
      );

      setEmergencies(
        response.data?.emergencies || []
      );
    } catch (error) {
      console.error(
        "Fetch emergencies failed:",
        error
      );
    }
  };

  // ================= STATUS UPDATE =================
  const updateStatus = async (
    emergencyId,
    status
  ) => {
    try {
      await api.put("/status/update", {
        emergencyId,
        status,
      });

      fetchEmergencies();

      socketRef.current?.emit(
        "status-update",
        {
          emergencyId,
          status,
        }
      );

      toast.success(
        `Status updated to ${status}`
      );
    } catch (error) {
      console.error(
        "Status update failed:",
        error
      );

      toast.error(
        "Failed to update status"
      );
    }
  };

  // ================= GPS TRACKING =================
  const startTracking = () => {
    if (!socketRef.current) return;

    setTracking(true);

    const id =
      navigator.geolocation.watchPosition(
        (position) => {
          const payload = {
            driverId: "D1",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setDriverLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });

          console.log(
            "📍 Sending driver location:",
            payload
          );

          socketRef.current.emit(
            "driver-location",
            payload
          );
        },

        (err) => {
          console.error(
            "GPS Error:",
            err
          );

          if (err.code === 1) {
            toast.error(
              "Location permission denied"
            );
          }

          if (err.code === 2) {
            toast.error(
              "Location unavailable"
            );
          }

          if (err.code === 3) {
            toast.error(
              "GPS timeout"
            );
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );

    setWatchId(id);

    toast.success(
      "GPS Tracking Started"
    );
  };

  // ================= STOP TRACKING =================
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(
        watchId
      );
    }

    setWatchId(null);
    setTracking(false);

    toast.success(
      "GPS Tracking Stopped"
    );
  };

  // ================= STATS =================
  const activeCount =
    emergencies.filter(
      (e) =>
        e.status === "assigned" ||
        e.status === "on_the_way"
    ).length;

  const completedCount =
    emergencies.filter(
      (e) => e.status === "completed"
    ).length;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      style={container}
    >
      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            color: "#0F172A",
          }}
        >
          🚑 Driver Dashboard
        </h1>

        <p
          style={{
            color: "#64748B",
          }}
        >
          Manage emergency requests and
          share live ambulance location.
        </p>
      </div>

      {/* STATS */}
      <div style={statsGrid}>
        <StatCard
          icon={
            <Ambulance size={30} />
          }
          title="Active Cases"
          value={activeCount}
        />

        <StatCard
          icon={
            <MapPinned size={30} />
          }
          title="GPS Status"
          value={
            tracking ? "ON" : "OFF"
          }
        />

        <StatCard
          icon={
            <CheckCircle size={30} />
          }
          title="Completed"
          value={completedCount}
        />
      </div>

      {/* DRIVER INFO */}
      <div style={card}>
        <h2>
          🚑 Driver Information
        </h2>

        <p>
          <strong>Driver ID:</strong>{" "}
          D1
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {tracking
            ? "🟢 Online"
            : "🔴 Offline"}
        </p>
      </div>

      {/* GPS CONTROL */}
      <div style={card}>
        <h2>
          📍 Live Tracking Control
        </h2>

        {!tracking ? (
          <button
            onClick={
              startTracking
            }
            style={startBtn}
          >
            Start GPS Tracking
          </button>
        ) : (
          <button
            onClick={
              stopTracking
            }
            style={stopBtn}
          >
            Stop Tracking
          </button>
        )}
      </div>

      {/* MAP */}
      {driverLocation &&
        emergencies.length > 0 && (
          <div style={card}>
            <h2>
              🗺️ Live Navigation Map
            </h2>

            <MapView
              patientLat={
                emergencies[0]
                  ?.latitude
              }
              patientLng={
                emergencies[0]
                  ?.longitude
              }
              ambulanceLat={
                driverLocation.lat
              }
              ambulanceLng={
                driverLocation.lng
              }
            />
          </div>
        )}

      {/* EMERGENCIES */}
      {emergencies.length === 0 ? (
        <div style={card}>
          <p>
            No emergencies found.
          </p>
        </div>
      ) : (
        emergencies.map(
          (emergency) => (
            <motion.div
              key={
                emergency.id
              }
              style={card}
              whileHover={{
                scale: 1.01,
              }}
            >
              <h2>
                🚨 Emergency Request
              </h2>

              <p>
                <strong>
                  Patient:
                </strong>{" "}
                {
                  emergency.patientName
                }
              </p>

              <p>
                <strong>
                  Phone:
                </strong>{" "}
                {
                  emergency.phone
                }
              </p>

              <p>
                <strong>
                  Type:
                </strong>{" "}
                {
                  emergency.emergencyType
                }
              </p>

              <p>
                <strong>
                  Status:
                </strong>{" "}
                <span
                  style={statusStyle(
                    emergency.status
                  )}
                >
                  {
                    emergency.status
                  }
                </span>
              </p>

              <div
                style={
                  buttonRow
                }
              >
                <button
                  style={
                    assignedBtn
                  }
                  onClick={() =>
                    updateStatus(
                      emergency.id,
                      "assigned"
                    )
                  }
                >
                  Accept
                </button>

                <button
                  style={
                    wayBtn
                  }
                  onClick={() =>
                    updateStatus(
                      emergency.id,
                      "on_the_way"
                    )
                  }
                >
                  On The Way
                </button>

                <button
                  style={
                    arrivedBtn
                  }
                  onClick={() =>
                    updateStatus(
                      emergency.id,
                      "arrived"
                    )
                  }
                >
                  Arrived
                </button>

                <button
                  style={
                    completedBtn
                  }
                  onClick={() =>
                    updateStatus(
                      emergency.id,
                      "completed"
                    )
                  }
                >
                  Complete
                </button>
              </div>
            </motion.div>
          )
        )
      )}
    </motion.div>
  );
}

/* ================= STYLES ================= */

const container = {
  maxWidth: "1100px",
  margin: "30px auto",
  padding: "20px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "#fff",
  borderRadius: "20px",
  padding: "24px",
  marginBottom: "20px",
  boxShadow:
    "0 10px 25px rgba(0,0,0,0.08)",
};

const buttonRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "15px",
};

const startBtn = {
  padding: "14px 22px",
  background: "#10B981",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const stopBtn = {
  padding: "14px 22px",
  background: "#EF4444",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const assignedBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#2563EB",
  color: "#fff",
  cursor: "pointer",
};

const wayBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#9333EA",
  color: "#fff",
  cursor: "pointer",
};

const arrivedBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#F59E0B",
  color: "#fff",
  cursor: "pointer",
};

const completedBtn = {
  padding: "10px 14px",
  border: "none",
  borderRadius: "10px",
  background: "#10B981",
  color: "#fff",
  cursor: "pointer",
};

const statusStyle = (status) => ({
  padding: "6px 12px",
  borderRadius: "20px",
  color: "#fff",
  fontWeight: "600",
  background:
    status === "pending"
      ? "#F59E0B"
      : status === "assigned"
      ? "#2563EB"
      : status === "on_the_way"
      ? "#9333EA"
      : status === "arrived"
      ? "#10B981"
      : "#059669",
});