import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

export default function Navbar() {
  const { user, role, logout } =
    useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();

    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      {/* LEFT */}
      <div style={styles.left}>
        {location.pathname !== "/" && (
          <button
            style={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        )}

        <div
          style={styles.logo}
          onClick={() => navigate("/")}
        >
          🚑 <span>AmbiTrack</span>
        </div>
      </div>

      {/* RIGHT */}
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
              onClick={handleLogout}
              style={styles.logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              style={styles.loginBtn}
              onClick={() =>
                navigate("/login")
              }
            >
              Login
            </button>
          </>
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

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.15)",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",

    fontSize: "22px",
    fontWeight: "700",

    cursor: "pointer",

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

  backBtn: {
    background: "#1E293B",
    color: "#fff",

    border: "none",

    padding: "10px 14px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "600",
  },

  loginBtn: {
    background: "#2563EB",
    color: "#fff",

    border: "none",

    padding: "10px 16px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "600",
  },

  logout: {
    background: "#EF4444",
    color: "#fff",

    border: "none",

    padding: "10px 16px",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: "600",
  },
};