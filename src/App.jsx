import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AdminLayout from "~/layouts/admin";
import AuthLayout from "~/layouts/auth";

export default function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </>
  );
}
