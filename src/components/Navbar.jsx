import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Navbar() {
  const { user, role, logout } = useContext(UserContext);

  return (
    <div style={styles.nav}>
      <div style={{ fontWeight: "bold" }}>🚑 AmbiTrack</div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        {user && (
          <>
            <span style={styles.badge}>{role}</span>
            <span>{user.name}</span>

            <button onClick={logout} style={styles.logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#111",
    color: "#fff",
    alignItems: "center",
  },
  badge: {
    background: "#E53935",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
  },
  logout: {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};