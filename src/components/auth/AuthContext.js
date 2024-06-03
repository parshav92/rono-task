import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const credentialId = localStorage.getItem("credentialId");
    return { isAuthenticated: !!credentialId, credentialId };
  });

  const login = (credentialId) => {
    localStorage.setItem("credentialId", credentialId);
    setAuth({ isAuthenticated: true, credentialId });
  };

  const logout = () => {
    localStorage.removeItem("credentialId");
    setAuth({ isAuthenticated: false, credentialId: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
