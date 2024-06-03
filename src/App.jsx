import React from "react";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router";
import "./App.css";
import NotFound from "./components/common/NotFound";
import Table from "./components/table";
import Table2 from "./components/table2";
import AuthComponent from "./components/Login";
import { AuthProvider } from "./components/auth/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthComponent />} />

        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/live" element={<Table />} />
          <Route path="/live2" element={<Table2 />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
