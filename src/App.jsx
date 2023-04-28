import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "~/layouts/admin";
import AuthLayout from "~/layouts/auth";
import ProtectedRoute from "./utils/ProtectedRoute";

export default function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      localStorage.removeItem("user");
    }
  }, [action, pathname]);
  localStorage.setItem("darkmode", "true");
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/admin/home" replace />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
