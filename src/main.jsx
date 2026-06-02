import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Existing styles
import "./styles/global.css";

// New Day 1 Design System
import "./styles/theme.css";

import "./utils/fixLeafletIcons";

import UserProvider from "./context/UserContext";
import EmergencyProvider from "./context/EmergencyContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <EmergencyProvider>
        <App />
      </EmergencyProvider>
    </UserProvider>
  </React.StrictMode>
);