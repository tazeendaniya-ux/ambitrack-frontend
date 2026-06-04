import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(135deg, #EFF6FF, #FFFFFF)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Heartbeat Line */}
      <motion.svg
        width="350"
        height="120"
        viewBox="0 0 350 120"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <motion.path
          d="
          M10 60
          L90 60
          L120 60
          L140 25
          L160 95
          L180 20
          L200 60
          L340 60
          "
          fill="transparent"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
          }}
        />
      </motion.svg>

      {/* Heart */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
        style={{
          fontSize: "3rem",
          marginTop: "-25px",
        }}
      >
        ❤️
      </motion.div>

      {/* Logo */}
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.5,
          duration: 0.8,
        }}
        style={{
          marginTop: "25px",
          fontSize: "3.5rem",
          fontWeight: "800",
          color: "#0F172A",
          letterSpacing: "2px",
        }}
      >
        AMBITRACK
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 2,
        }}
        style={{
          color: "#64748B",
          fontSize: "1.1rem",
        }}
      >
        Smart Emergency Response Platform
      </motion.p>
    </div>
  );
}