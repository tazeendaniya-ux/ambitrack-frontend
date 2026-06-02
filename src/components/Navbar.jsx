import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, role, logout } = useContext(UserContext);

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        🚑 <span>AmbiTrack</span>
      </div>

      <div style={styles.right}>
        {user ? (
          <>
            <span style={styles.badge}>
              {role?.toUpperCase()}
            </span>

            <span style={styles.username}>
              👤 {user.name}
            </span>

            <button
              onClick={logout}
              style={styles.logout}
            >
              Logout
            </button>
          </>
        ) : (
          <span style={styles.tagline}>
            Smart Emergency Response
          </span>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "16px 32px",

    background: "#0F172A",
    color: "#fff",

    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",

    fontSize: "22px",
    fontWeight: "700",

    letterSpacing: "0.5px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  badge: {
    background: "#EF4444",
    color: "#fff",

    padding: "6px 12px",

    borderRadius: "999px",

    fontSize: "12px",
    fontWeight: "600",
  },

  username: {
    fontWeight: "500",
  },

  tagline: {
    color: "#CBD5E1",
    fontSize: "14px",
  },

  logout: {
    background: "#EF4444",
    color: "#fff",

    border: "none",

    padding: "10px 16px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "600",

    transition: "0.3s",
  },
};