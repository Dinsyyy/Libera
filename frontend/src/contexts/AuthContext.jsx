import React, { useState } from 'react';
import AuthContext from './useAuth';

// 2. Buat Provider
function AuthProvider({ children }) {
  // Ambil data dari localStorage saat pertama kali load
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // --- FUNGSI PENTING: LOGIN ---
  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // 3. Masukkan 'login' ke dalam value agar bisa dipanggil halaman lain
  const value = {
    user,
    token,
    login, // <--- PASTIKAN KATA 'login,' INI ADA DI SINI
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// AuthContext and the `useAuth` hook are exported from `src/contexts/useAuth.jsx`.
export default AuthProvider;