import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      console.log(response.data);

      alert("Registration Successful!");

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setRole("patient");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
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
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Register
      </h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="patient">Patient</option>
          <option value="driver">Driver</option>
          <option value="hospital">Hospital</option>
        </select>

        <button type="submit" style={buttonStyle}>
          Register
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
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#1565C0",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
};