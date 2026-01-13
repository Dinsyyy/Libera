import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Halaman & Komponen
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminBooksPage from './pages/AdminBooksPage';
import UserLayout from './components/UserLayout';
import UserCatalogPage from './pages/UserCatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import BorrowSuccessPage from './pages/BorrowSuccessPage';
import { AdminRoute, UserRoute } from './components/ProtectedRoutes';
import AdminLayout from './components/AdminLayout';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminTransactionsPage from './pages/AdminTransactionsPage';
import UserSettingsPage from './pages/UserSettingsPage';
import UserReadingProgressPage from './pages/UserReadingProgressPage';
import LeaderboardPage from './pages/LeaderboardPage';
import UserDonationsPage from './pages/UserDonationsPage';
import UserBorrowedBooksPage from './pages/UserBorrowedBooksPage';

// (1) Import halaman baru
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  return (
    <Routes>
      {/* === Rute Publik === */}
      <Route path="/" element={<LoginPage />} />
      
      {/* (2) Tambahkan rute baru di sini */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* === Rute User (dilindungi UserRoute & pakai UserLayout) === */}
      <Route element={<UserRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/catalog" element={<UserCatalogPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/borrow/success" element={<BorrowSuccessPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/my-reading-progress" element={<UserReadingProgressPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/my-donations" element={<UserDonationsPage />} />
          <Route path="/my-borrowed-books" element={<UserBorrowedBooksPage />} />
        </Route>
      </Route>

      {/* === Rute Admin (dilindungi AdminRoute & pakai AdminLayout) === */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<AdminBooksPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/transaksi" element={<AdminTransactionsPage />} />
          <Route path="/admin/pengaturan" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;