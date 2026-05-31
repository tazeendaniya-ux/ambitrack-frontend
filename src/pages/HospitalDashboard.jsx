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
}