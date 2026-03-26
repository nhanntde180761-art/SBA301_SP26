import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../services/localStorageService";

export default function RoleBasedRedirect() {
  const token = getToken();

  // Unauthenticated users should land on the public overview page.
  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.scope?.split(" ") || [];

    if (roles.includes("ROLE_ADMIN")) {
      return <Navigate to="/admin" replace />;
    }

    if (roles.includes("ROLE_EMPLOYER")) {
      return <Navigate to="/employer" replace />;
    }

    return <Navigate to="/home" replace />;
  } catch (error) {
    console.error("Lỗi decode token khi redirect:", error);
    return <Navigate to="/login" replace />;
  }
}

