import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

// (1) Import Ikon
import { 
  LuLayoutDashboard, 
  LuBook, 
  LuUsers, 
  LuArrowLeftRight, 
  LuSettings, 
  LuLogOut 
} from "react-icons/lu";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.layout}>
      {/* ----- SIDEBAR (DESAIN BARU) ----- */}
      <div style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>Perpustakaan</h2>
          <nav style={styles.nav}>
            <StyledNavLink to="/admin/dashboard" style={styles.navLink} activeStyle={styles.navLinkActive}>
              <LuLayoutDashboard size={20} />
              <span>Dashboard</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/books" style={styles.navLink} activeStyle={styles.navLinkActive}>
              <LuBook size={20} />
              <span>Manajemen Buku</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/users" style={styles.navLink} activeStyle={styles.navLinkActive}>
              <LuUsers size={20} />
              <span>Manajemen Anggota</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/transaksi" style={styles.navLink} activeStyle={styles.navLinkActive}>
              <LuArrowLeftRight size={20} />
              <span>Manajemen Transaksi</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/pengaturan" style={styles.navLink} activeStyle={styles.navLinkActive}>
              <LuSettings size={20} />
              <span>Pengaturan</span>
            </StyledNavLink>
          </nav>
        </div>
        
        {/* Tombol Keluar di Bawah */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LuLogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>

      {/* ----- KONTEN UTAMA ----- */}
      <div style={styles.mainContent}>
        {/* Header di dalam Konten (sesuai desain baru, header tidak full-width) */}
        <header style={styles.header}>
          <div id="page-title-placeholder">
            {/* Judul halaman akan muncul di sini nanti */}
          </div>
          <div style={styles.headerProfile}>
            <span>Halo, {user?.name || 'Admin'}</span>
            <div style={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        
        <div style={styles.contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// (STYLE BARU TOTAL) Sesuai desain baru
const styles = {
  layout: { 
    display: 'flex', 
    minHeight: '100vh', 
    fontFamily: '"Inter", "Arial", sans-serif', // Font lebih modern
    backgroundColor: '#F9FAFB', // Latar belakang abu-abu sangat muda
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'white',
    borderRight: '1px solid #E5E7EB',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  sidebarTitle: { 
    textAlign: 'left', 
    paddingLeft: '12px',
    marginBottom: '24px', 
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#111827', // Biru gelap
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navLink: { 
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#4B5563', // Abu-abu
    textDecoration: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
  },
  navLinkActive: { 
    backgroundColor: '#F3F4F6', // Latar belakang abu-abu muda
    color: '#111827', // Teks jadi gelap
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#EF4444', // Merah
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    textAlign: 'left',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: '24px 40px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  headerProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '16px',
    color: '#374151',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#D1D5DB',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  contentArea: {
    padding: '0px', // Konten halaman akan di-render di sini
  },
};

// Helper NavLink yang sudah kita perbaiki sebelumnya
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