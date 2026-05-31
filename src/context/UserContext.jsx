import { createContext, useState } from "react";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const login = (userData) => {
    setUser(userData);
    setRole(userData.role);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role);
  };

  const logout = () => {
    setUser(null);
    setRole(null);

    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <UserContext.Provider value={{ user, role, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}