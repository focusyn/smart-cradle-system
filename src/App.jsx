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
import { Notifications } from "react-push-notification";

export default function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const date = new Date();
    const currentDate = date.toLocaleDateString();
    const currentTime = date.toLocaleTimeString();
    const currentDateTime = `${currentDate} ${currentTime}`;
    const userDateTime = user;

    if (userDateTime) {
      const diff = Math.abs(new Date(currentDateTime) - new Date(userDateTime));
      const minutes = Math.floor(diff / 1000 / 60);
      console.log(minutes);
      if (minutes > 60) {
        localStorage.removeItem("user");
      }
    }
  }, []);
  localStorage.setItem("darkmode", "true");
  return (
    <>
      <Notifications />
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
