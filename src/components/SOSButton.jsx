import { motion } from "framer-motion";

export default function SOSButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 0 0 rgba(239,68,68,0.4)",
          "0 0 40px rgba(239,68,68,0.8)",
          "0 0 0 rgba(239,68,68,0.4)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      style={{
        width: "220px",
        height: "220px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",

        background:
          "linear-gradient(135deg, #EF4444, #DC2626)",

        color: "#fff",
        fontSize: "42px",
        fontWeight: "800",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        margin: "30px auto",

        boxShadow:
          "0 15px 40px rgba(239,68,68,0.45)",
      }}
    >
      🚨 SOS
    </motion.button>
  );
}