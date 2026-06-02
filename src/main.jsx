import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Existing styles
import "./styles/global.css";

// Day 1 Design System
import "./styles/theme.css";

import "./utils/fixLeafletIcons";

import UserProvider from "./context/UserContext";
import EmergencyProvider from "./context/EmergencyContext";

// Toast
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <EmergencyProvider>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />

        <App />

      </EmergencyProvider>
    </UserProvider>
  </React.StrictMode>
);