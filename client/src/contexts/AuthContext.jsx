import React, { createContext, useState, useContext } from 'react';

// 1. Buat Context-nya
const AuthContext = createContext(null);

// 2. Buat "Provider" (Pembungkus)
export const AuthProvider = ({ children }) => {
  // Coba ambil data dari localStorage saat pertama kali load
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Fungsi untuk login
  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  // Fungsi untuk logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  // 3. Sediakan nilai ini ke semua "anak"
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token, // true jika token ada
    isAdmin: user?.role === 'admin', // true jika rolenya admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Buat "Hook" agar gampang dipakai
export const useAuth = () => {
  return useContext(AuthContext);
};