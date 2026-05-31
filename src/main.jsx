import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/global.css";
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