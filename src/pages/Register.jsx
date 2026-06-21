import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [role, setRole] = useState("patient");

  const generateOtp = () => {
    if (!phone) {
      alert("Please enter phone number first");
      return;
    }

    const newOtp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    setGeneratedOtp(newOtp);

    // Demo OTP
    alert(`Your OTP is: ${newOtp}`);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!generatedOtp) {
      alert("Please generate OTP first");
      return;
    }

    if (otp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        phone,
        role,
      });

      console.log(response.data);

      alert("Registration Successful!");

      setName("");
      setPhone("");
      setOtp("");
      setGeneratedOtp("");
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
        Register
      </h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={inputStyle}
          required
        />

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

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={inputStyle}
        >
          <option value="patient">
            Patient
          </option>
          <option value="driver">
            Driver
          </option>
          <option value="hospital">
            Hospital
          </option>
        </select>

        <button
          type="submit"
          style={buttonStyle}
        >
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
  boxSizing: "border-box",
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