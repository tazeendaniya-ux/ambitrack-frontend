import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: "🚑",
      title: "Emergency Dispatch",
      description:
        "Request an ambulance instantly during emergencies.",
    },
    {
      icon: "📍",
      title: "Live Tracking",
      description:
        "Track ambulance location in real time.",
    },
    {
      icon: "⏱️",
      title: "ETA Prediction",
      description:
        "Know estimated arrival time and distance.",
    },
    {
      icon: "🏥",
      title: "Hospital Coordination",
      description:
        "Hospitals receive patient information in advance.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #EFF6FF, #FFFFFF)",
        padding: "40px 20px",
      }}
    >
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: "center",
          maxWidth: "1000px",
          margin: "0 auto",
          paddingTop: "60px",
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          style={{
            fontSize: "5rem",
          }}
        >
          🚑
        </motion.div>

        <h1
          style={{
            fontSize: "4rem",
            marginBottom: "10px",
            color: "#0F172A",
          }}
        >
          AmbiTrack
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            color: "#475569",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.8",
          }}
        >
          Smart Emergency Response Platform
          connecting patients, ambulance
          drivers, and hospitals through
          real-time tracking and coordination.
        </p>

        <div
          style={{
            marginTop: "40px",
          }}
        >
          <Link to="/login">
            <button
              style={{
                background: "#2563EB",
                color: "white",
                border: "none",
                padding: "14px 30px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginRight: "15px",
              }}
            >
              Login
            </button>
          </Link>

          <Link to="/register">
            <button
              style={{
                background: "white",
                color: "#2563EB",
                border: "2px solid #2563EB",
                padding: "14px 30px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "80px auto",
        }}
      >
        <StatBox value="24/7" label="Emergency Support" />
        <StatBox value="Real-Time" label="Tracking" />
        <StatBox value="Live ETA" label="Prediction" />
        <StatBox value="Multi-User" label="Platform" />
      </div>

      {/* FEATURES */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "40px",
            color: "#0F172A",
          }}
        >
          Key Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",
            gap: "20px",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
              }}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "20px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "15px",
                }}
              >
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p
                style={{
                  color: "#64748B",
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        textAlign: "center",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          color: "#2563EB",
        }}
      >
        {value}
      </h2>

      <p>{label}</p>
    </div>
  );
}