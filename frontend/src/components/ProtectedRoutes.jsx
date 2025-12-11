import React from 'react';
import { useAuth } from '../contexts/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

// Penjaga Gerbang untuk ADMIN
export const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // 1. Jika belum login, tendang ke /
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    // 2. Jika sudah login TAPI BUKAN admin, tendang ke dashboard user
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Jika lolos (login & admin), tampilkan halamannya
  return <Outlet />; 
};

// Penjaga Gerbang untuk USER BIASA
export const UserRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    // 1. Jika belum login, tendang ke /
    return <Navigate to="/" replace />;
  }

  if (isAdmin) {
    // 2. Jika sudah login TAPI DIA admin, tendang ke dashboard admin
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Jika lolos (login & user), tampilkan halamannya
  return <Outlet />;
};