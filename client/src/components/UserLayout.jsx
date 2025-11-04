import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Arahkan ke login setelah logout
  };

  return (
    <div style={styles.layout}>
      {/* ----- NAVBAR PENGGUNA ----- */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <Link to="/dashboard" style={styles.brand}>Libera</Link>
          <div style={styles.navLinks}>
            <Link to="/catalog" style={styles.navLink}>Cari Buku</Link>
            <Link to="/dashboard" style={styles.navLink}>Dashboard Saya</Link>
          </div>
          <div style={styles.navUser}>
            <span style={styles.userName}>Halo, {user?.name}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ----- KONTEN UTAMA ----- */}
      <main style={styles.mainContent}>
        {/* <Outlet /> adalah tempat halaman (dashboard/katalog) akan muncul */}
        <Outlet />
      </main>
    </div>
  );
}

// (CSS Sederhana untuk Layout Pengguna)
const styles = {
  layout: { 
    display: 'flex', 
    flexDirection: 'column', 
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
  },
  navbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #eee',
    padding: '0 40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '70px',
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#34495e',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#555',
    textDecoration: 'none',
    fontSize: '16px',
  },
  navUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userName: {
    color: '#333',
  },
  logoutButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    border: '1px solid #e74c3c',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  mainContent: {
    flex: 1,
    padding: '40px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto', // tengahkan konten
    boxSizing: 'border-box',
  },
};

export default UserLayout;