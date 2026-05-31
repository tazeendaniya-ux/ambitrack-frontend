import { createContext, useState } from "react";

export const EmergencyContext = createContext();

export default function EmergencyProvider({ children }) {
  const [emergencyId, setEmergencyId] = useState(null);
  const [status, setStatus] = useState("idle");

  return (
    <EmergencyContext.Provider
      value={{
        emergencyId,
        setEmergencyId,
        status,
        setStatus,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
}