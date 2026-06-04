import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff",
      }}
    >
      {/* Ambulance */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ fontSize: "5rem" }}
      >
        🚑
      </motion.div>

      {/* Heartbeat */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{
          delay: 1,
          duration: 1,
          repeat: 2,
        }}
        style={{
          fontSize: "4rem",
          marginTop: "20px",
        }}
      >
        ❤️
      </motion.div>

      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 2.5,
          duration: 1,
        }}
        style={{
          marginTop: "20px",
          fontSize: "3rem",
          color: "#2563EB",
        }}
      >
        AmbiTrack
      </motion.h1>
    </div>
  );
}