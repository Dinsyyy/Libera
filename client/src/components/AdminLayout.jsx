import React from 'react';
// (1) Pastikan NavLink, useNavigate, dan Outlet di-import
import { NavLink, useNavigate, Outlet } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.layout}>
      {/* ----- SIDEBAR ----- */}
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Panel Admin</h2>
        <nav style={styles.nav}>
          {/* (2) Teks '// ...' sudah dihapus */}
          <StyledNavLink to="/admin/dashboard" style={styles.navLink} activeStyle={styles.navLinkActive}>
            Dashboard
          </StyledNavLink>
          <StyledNavLink to="/admin/books" style={styles.navLink} activeStyle={styles.navLinkActive}>
            Kelola Database Buku
          </StyledNavLink>
          <StyledNavLink to="/admin/users" style={styles.navLink} activeStyle={styles.navLinkActive}>
            Kelola Database Pengguna
          </StyledNavLink>
          <StyledNavLink to="/admin/profile" style={styles.navLink} activeStyle={styles.navLinkActive}>
            Profil Saya
          </StyledNavLink>
          <StyledNavLink to="/admin/settings" style={styles.navLink} activeStyle={styles.navLinkActive}>
            Pengaturan
          </StyledNavLink>
        </nav>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* ----- KONTEN UTAMA ----- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <span>Selamat Datang, {user?.name || 'Admin'}</span>
          <div style={styles.avatar}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
        </header>
        <div style={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// (3) STYLE YANG DIPERBARUI (Sesuai wireframe image_630464.jpg)
const styles = {
  layout: { display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' },
  sidebar: {
    width: '260px',
    backgroundColor: '#2c3e50', // Biru tua
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  sidebarTitle: { 
    textAlign: 'center', 
    marginBottom: '30px', 
    fontSize: '24px',
    fontWeight: 'bold',
  },
  nav: {
    flexGrow: 1, 
  },
  navLink: { // Style link non-aktif
    display: 'block',
    color: '#ecf0f1', // Putih keabuan
    textDecoration: 'none',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '10px',
    fontSize: '16px',
    transition: 'background-color 0.2s, color 0.2s',
    backgroundColor: 'transparent', // Latar belakang transparan
  },
  navLinkActive: { // Style link aktif (SESUAI WIREFRAME)
    backgroundColor: '#ecf0f1', // Latar belakang abu-abu muda
    color: '#2c3e50', // Teks warna biru tua
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: '15px',
    backgroundColor: '#e74c3c', // Merah
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f4f7f6',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 40px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '15px',
    fontSize: '16px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#34495e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  contentArea: {
    padding: '40px',
    flex: 1,
    overflowY: 'auto',
  },
};

// (4) Helper NavLink yang sudah benar
const StyledNavLink = React.forwardRef(({ activeStyle, style, ...props }, ref) => {
  return (
    <NavLink 
      ref={ref}
      {...props}
      style={({ isActive }) => (isActive ? { ...style, ...activeStyle } : style)}
    />
  );
});

export default AdminLayout;