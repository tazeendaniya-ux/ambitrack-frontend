import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        padding: "20px",
      }}
    >
      <h1>🚑 AMBITRACK</h1>

      <p
        style={{
          marginTop: "20px",
          fontSize: "18px",
        }}
      >
        Smart Emergency Ambulance Dispatch & Tracking System
      </p>

      <div style={{ marginTop: "40px" }}>
        <Link to="/login">
          <button
            style={{
              padding: "12px 25px",
              marginRight: "15px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </Link>

        <Link to="/register">
          <button
            style={{
              padding: "12px 25px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}