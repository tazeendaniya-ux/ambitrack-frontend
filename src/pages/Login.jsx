import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const generateOtp = () => {
    if (!phone) {
      toast.error("Please enter phone number");
      return;
    }

    const newOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    setGeneratedOtp(newOtp);

    // Demo OTP
    toast.success(`Your OTP is ${newOtp}`);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!generatedOtp) {
      toast.error("Please generate OTP first");
      return;
    }

    if (otp !== generatedOtp) {
      toast.error("Invalid OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        phone,
      });

      const user = response.data.user;

      login(user);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "role",
        user.role
      );

      if (user.role === "patient") {
        navigate("/patient");
      } else if (user.role === "driver") {
        navigate("/driver");
      } else if (user.role === "hospital") {
        navigate("/hospital");
      }

      setTimeout(() => {
        toast.success("Login Successful!");
      }, 100);

      setPhone("");
      setOtp("");
      setGeneratedOtp("");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Login
      </h1>

      <form onSubmit={handleLogin}>
        <input
          type="tel"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          style={inputStyle}
          required
        />

        <button
          type="button"
          onClick={generateOtp}
          style={buttonStyle}
        >
          Generate OTP
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
          style={{
            ...inputStyle,
            marginTop: "15px",
          }}
          required
        />

        <button
          type="submit"
          style={{
            ...buttonStyle,
            marginTop: "15px",
            opacity: loading ? 0.7 : 1,
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#E53935",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};