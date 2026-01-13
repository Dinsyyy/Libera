import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../api/axiosInstance'; 
import { theme } from '../theme';
import { LuBell, LuLogOut, LuSettings, LuUser } from "react-icons/lu"; 

function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/user/notifications');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unread_count);
    } catch (err) {
      console.error("Gagal ambil notif", err);
    }
  };

  const handleMarkAsRead = async () => {
    if (unreadCount > 0) {
      try {
        await api.post('/user/notifications/read');
        setUnreadCount(0);
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const primaryNavLinks = [
    { path: '/dashboard', label: 'Beranda' },
    { path: '/catalog', label: 'Cari Buku' },
  ];

  const moreNavLinks = [
    { path: '/my-borrowed-books', label: 'Buku Dipinjam' },
    { path: '/my-reading-progress', label: 'Progres Membaca' },
    { path: '/leaderboard', label: 'Papan Peringkat' },
    { path: '/my-donations', label: 'Sumbangkan Buku' },
  ];

  const getPhotoUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`;
  };

  return (
    <div style={styles.layout}>
      <header style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.brand}>
            <h2 style={{margin: 0, color: theme.colors.primary}}>Libera</h2>
          </div>

          <nav style={styles.navMenu}>
            {primaryNavLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                style={location.pathname === link.path ? styles.navLinkActive : styles.navLink}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ position: 'relative' }} ref={moreDropdownRef}>
              <button 
                style={{...styles.navLink, ...styles.moreDropdownButton, color: isMoreDropdownOpen ? theme.colors.primary : theme.colors.textSecondary}} 
                onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              >
                Lainnya
              </button>
              {isMoreDropdownOpen && (
                <div style={styles.moreDropdownMenu}>
                  {moreNavLinks.map((link) => (
                    <Link 
                      key={link.path} 
                      to={link.path} 
                      style={styles.moreDropdownItem}
                      onClick={() => setIsMoreDropdownOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div style={styles.rightArea}>
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button 
                style={styles.iconButton} 
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen) handleMarkAsRead();
                }}
              >
                <LuBell size={22} />
                {unreadCount > 0 && (
                  <span style={styles.notifBadge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {notifOpen && (
                <div style={styles.notifDropdown}>
                  <div style={styles.notifHeader}>
                    <span style={{fontWeight: 'bold'}}>Notifikasi</span>
                  </div>
                  <div style={styles.notifList}>
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} style={notif.read_at ? styles.notifItemRead : styles.notifItemUnread}>
                          <div style={{marginBottom: '4px', fontSize: '14px', lineHeight: '1.4'}}>
                            {notif.data.message}
                          </div>
                          <div style={{fontSize: '12px', color: theme.colors.textSecondary}}>
                            {new Date(notif.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={styles.notifEmpty}>
                        Tidak ada notifikasi baru.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.dividerVertical}></div>

            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button style={styles.profileButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <div style={styles.avatarWrapper}>
                  {user?.profile_photo_path ? (
                    <img src={getPhotoUrl(user.profile_photo_path)} alt="Profile" style={styles.avatarImg} />
                  ) : (
                    <div style={styles.avatarPlaceholder}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <span style={styles.userName}>{user?.name}</span>
              </button>

              {isDropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <div style={styles.dropdownHeader}>
                    <p style={{fontWeight: 'bold', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis'}}>{user?.name}</p>
                    <p style={{fontSize: '12px', color: theme.colors.textSecondary, margin: 0}}>{user?.email}</p>
                  </div>
                  
                  <Link to="/settings" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                    <LuUser size={16} /> Detail Profil
                  </Link>
                  
                  <div style={styles.divider}></div>
                  
                  <button onClick={handleLogout} style={{...styles.dropdownItem, color: theme.colors.error}}>
                    <LuLogOut size={16} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: { minHeight: '100vh', backgroundColor: theme.colors.background, fontFamily: theme.typography.fontFamily },
  navbar: { 
    height: '70px', 
    backgroundColor: theme.colors.surface, 
    borderBottom: `1px solid ${theme.colors.border}`, 
    position: 'sticky', 
    top: 0, 
    zIndex: 100 
  },
  navContent: {
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: `0 ${theme.spacing.xxl}`, 
    height: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  brand: { ...theme.typography.h2, fontWeight: '800' },
  navMenu: { display: 'flex', gap: theme.spacing.xl },
  navLink: { 
    textDecoration: 'none', 
    color: theme.colors.textSecondary, 
    fontWeight: '600', 
    fontSize: '16px', 
    padding: `${theme.spacing.sm} 0`,
    position: 'relative',
    transition: 'color 0.2s',
  },
  navLinkActive: { 
    textDecoration: 'none', 
    color: theme.colors.primary, 
    fontWeight: '600', 
    fontSize: '16px', 
    borderBottom: `2px solid ${theme.colors.primary}`, 
    padding: `${theme.spacing.sm} 0`
  },
  moreDropdownButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600', 
    fontSize: '16px', 
    padding: `${theme.spacing.sm} 0`,
    transition: 'color 0.2s',
  },
  moreDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.border}`,
    overflow: 'hidden',
    minWidth: '180px',
    zIndex: 100,
  },
  moreDropdownItem: {
    display: 'block',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    textDecoration: 'none',
    color: theme.colors.textPrimary,
    fontSize: '14px',
    transition: 'background-color 0.2s',
  },
  rightArea: { display: 'flex', alignItems: 'center', gap: theme.spacing.md },
  iconButton: { 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    position: 'relative', 
    color: theme.colors.textSecondary, 
    display: 'flex', 
    alignItems: 'center', 
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    transition: 'background-color 0.2s',
  },
  notifBadge: { 
    position: 'absolute', 
    top: '2px', 
    right: '2px', 
    backgroundColor: theme.colors.error, 
    color: 'white', 
    fontSize: '10px', 
    width: '18px', 
    height: '18px', 
    borderRadius: theme.borderRadius.full, 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    fontWeight: 'bold',
    border: `2px solid ${theme.colors.surface}`,
  },
  notifDropdown: { 
    position: 'absolute', 
    top: '55px', 
    right: '-10px', 
    width: '320px', 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.lg, 
    boxShadow: theme.shadows.lg, 
    border: `1px solid ${theme.colors.border}`, 
    overflow: 'hidden', 
    zIndex: 101 
  },
  notifHeader: { 
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.colors.border}`, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  notifList: { maxHeight: '350px', overflowY: 'auto' },
  notifItemUnread: { padding: theme.spacing.md, borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: '#EFF6FF', cursor: 'pointer' },
  notifItemRead: { padding: theme.spacing.md, borderBottom: `1px solid ${theme.colors.border}`, backgroundColor: theme.colors.surface, cursor: 'pointer' },
  notifEmpty: { padding: theme.spacing.xl, textAlign: 'center', color: theme.colors.textSecondary, ...theme.typography.caption },
  dividerVertical: { height: '24px', width: '1px', backgroundColor: theme.colors.border },
  profileButton: { display: 'flex', alignItems: 'center', gap: theme.spacing.sm, background: 'none', border: 'none', cursor: 'pointer', padding: theme.spacing.sm, borderRadius: theme.borderRadius.md },
  avatarWrapper: { width: '40px', height: '40px', borderRadius: theme.borderRadius.full, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', backgroundColor: theme.colors.primary, color: theme.colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  userName: { fontWeight: '600', color: theme.colors.textPrimary, fontSize: '15px' },
  dropdownMenu: { 
    position: 'absolute', 
    top: '55px', 
    right: '0', 
    width: '240px', 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.lg, 
    boxShadow: theme.shadows.lg, 
    border: `1px solid ${theme.colors.border}`, 
    overflow: 'hidden', 
    padding: theme.spacing.sm, 
    zIndex: 101 
  },
  dropdownHeader: { 
    padding: `${theme.spacing.sm} ${theme.spacing.md}`, 
    borderBottom: `1px solid ${theme.colors.border}`, 
    marginBottom: theme.spacing.sm
  },
  dropdownItem: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: theme.spacing.md, 
    padding: `${theme.spacing.sm} ${theme.spacing.md}`, 
    textDecoration: 'none', 
    color: theme.colors.textPrimary, 
    fontSize: '14px', 
    borderRadius: theme.borderRadius.md, 
    width: '100%', 
    border: 'none', 
    background: 'transparent', 
    cursor: 'pointer', 
    boxSizing: 'border-box' 
  },
  divider: { height: '1px', backgroundColor: theme.colors.border, margin: `${theme.spacing.sm} 0` },
  main: { padding: `${theme.spacing.xl} ${theme.spacing.xxl}`, maxWidth: '1200px', margin: '0 auto' }
};

export default UserLayout;