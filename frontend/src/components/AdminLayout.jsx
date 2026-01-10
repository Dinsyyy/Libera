import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { theme } from '../theme'; // Import theme

// Import Ikon
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
      {/* ----- SIDEBAR ----- */}
      <div style={styles.sidebar}>
        <div>
          <h2 style={styles.sidebarTitle}>Libera</h2>
          <nav style={styles.nav}>
            <StyledNavLink to="/admin/dashboard">
              <LuLayoutDashboard size={20} />
              <span>Dashboard</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/books">
              <LuBook size={20} />
              <span>Manajemen Buku</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/users">
              <LuUsers size={20} />
              <span>Manajemen Anggota</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/transaksi">
              <LuArrowLeftRight size={20} />
              <span>Manajemen Transaksi</span>
            </StyledNavLink>
            <StyledNavLink to="/admin/pengaturan">
              <LuSettings size={20} />
              <span>Pengaturan</span>
            </StyledNavLink>
          </nav>
        </div>
        
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LuLogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>

      {/* ----- KONTEN UTAMA ----- */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <div id="page-title-placeholder">
            {/* Judul Halaman dari Outlet */}
          </div>
          <div style={styles.headerProfile}>
            <span>Halo, {user?.name || 'Admin'}</span>
            <div style={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        
        <main style={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// === STYLES using THEME ===
const styles = {
  layout: { 
    display: 'flex', 
    minHeight: '100vh', 
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.background,
  },
  sidebar: {
    width: '280px',
    backgroundColor: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    padding: theme.spacing.lg,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  sidebarTitle: { 
    textAlign: 'left', 
    paddingLeft: theme.spacing.md,
    marginBottom: theme.spacing.xl, 
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.textPrimary,
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },
  navLinkBase: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    color: theme.colors.textSecondary,
    textDecoration: 'none',
    padding: `${theme.spacing.md} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    transition: 'background-color 0.2s, color 0.2s',
  },
  navLinkActive: { 
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: 'transparent',
    color: theme.colors.error,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    fontSize: theme.typography.body.fontSize,
    fontWeight: '500',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  },
  mainContent: {
    flex: 1,
    padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textPrimary,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: theme.typography.h3.fontSize,
  },
  contentArea: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
  },
};

// Custom NavLink component to handle active styles
const StyledNavLink = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <NavLink 
      ref={ref}
      {...props}
      style={({ isActive }) => 
        isActive 
          ? {...styles.navLinkBase, ...styles.navLinkActive} 
          : styles.navLinkBase
      }
    >
      {children}
    </NavLink>
  );
});

export default AdminLayout;