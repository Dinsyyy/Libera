import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import api from '../api/axiosInstance'; 
import { LuBell, LuLogOut, LuSettings, LuUser } from "react-icons/lu"; 

function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- STATE UNTUK DROPDOWN ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- STATE UNTUK NOTIFIKASI ---
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // 1. AMBIL NOTIFIKASI SAAT PERTAMA KALI LOAD
  useEffect(() => {
    fetchNotifications();
    // Opsional: Refresh notifikasi setiap 60 detik
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

  // 2. TANDAI NOTIFIKASI SUDAH DIBACA
  const handleMarkAsRead = async () => {
    if (unreadCount > 0) {
      try {
        await api.post('/user/notifications/read');
        setUnreadCount(0); // Hilangkan badge merah
        fetchNotifications(); // Refresh list agar status jadi 'read'
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 3. LOGIKA TUTUP DROPDOWN JIKA KLIK DI LUAR
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/dashboard', label: 'Beranda' },
    { path: '/catalog', label: 'Cari Buku' },
  ];

  // Helper untuk URL Foto
  const getPhotoUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000/storage/${path}`;
  };

  return (
    <div style={styles.layout}>
      {/* === NAVBAR ATAS === */}
      <header style={styles.navbar}>
        <div style={styles.brand}>
          <h2 style={{margin: 0, color: '#2563EB'}}>Libera</h2>
        </div>

        {/* MENU TENGAH */}
        <nav style={styles.navMenu}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={location.pathname === link.path ? styles.navLinkActive : styles.navLink}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* AREA KANAN (NOTIF & PROFIL) */}
        <div style={styles.rightArea}>
          
          {/* A. NOTIFIKASI DROPDOWN */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button 
              style={styles.iconButton} 
              onClick={() => {
                setNotifOpen(!notifOpen);
                if (!notifOpen) handleMarkAsRead(); // Tandai baca saat dibuka
              }}
            >
              <LuBell size={20} />
              {unreadCount > 0 && (
                <span style={styles.notifBadge}>{unreadCount}</span>
              )}
            </button>

            {notifOpen && (
              <div style={styles.notifDropdown}>
                <div style={styles.notifHeader}>
                  <span style={{fontWeight: 'bold'}}>Notifikasi</span>
                  {unreadCount > 0 && <span style={{fontSize: '12px', color: '#2563EB'}}>Baru</span>}
                </div>
                <div style={styles.notifList}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} style={notif.read_at ? styles.notifItemRead : styles.notifItemUnread}>
                        <div style={{marginBottom: '4px', fontSize: '13px', lineHeight: '1.4'}}>
                          {notif.data.message}
                        </div>
                        <div style={{fontSize: '11px', color: '#9CA3AF'}}>
                          {new Date(notif.created_at).toLocaleString('id-ID')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '13px'}}>
                      Tidak ada notifikasi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* B. PROFIL DROPDOWN */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button style={styles.profileButton} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              
              {/* LOGIKA TAMPILAN FOTO vs INISIAL */}
              <div style={styles.avatarWrapper}>
                {user?.profile_photo_path ? (
                  <img 
                    src={getPhotoUrl(user.profile_photo_path)} 
                    alt="Profile" 
                    style={styles.avatarImg} 
                  />
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
                  <p style={{fontSize: '12px', color: '#6B7280', margin: 0}}>{user?.email}</p>
                </div>
                
                <Link to="/settings" style={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                  <LuUser size={16} /> Detail Profil
                </Link>
                
                <div style={styles.divider}></div>
                
                <button onClick={handleLogout} style={{...styles.dropdownItem, color: '#EF4444'}}>
                  <LuLogOut size={16} /> Keluar
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* KONTEN HALAMAN */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  layout: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'Inter, sans-serif' },
  navbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', height: '70px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 100 },
  brand: { fontSize: '24px', fontWeight: 'bold' },
  
  navMenu: { display: 'flex', gap: '30px' },
  navLink: { textDecoration: 'none', color: '#6B7280', fontWeight: '500', fontSize: '15px', padding: '8px 0' },
  navLinkActive: { textDecoration: 'none', color: '#2563EB', fontWeight: 'bold', fontSize: '15px', borderBottom: '2px solid #2563EB', padding: '8px 0' },
  
  rightArea: { display: 'flex', alignItems: 'center', gap: '20px' },
  
  // Icon Button & Badge
  iconButton: { background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: '#6B7280', display: 'flex', alignItems: 'center', padding: '8px' },
  notifBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#EF4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },

  // Notifikasi Dropdown
  notifDropdown: { position: 'absolute', top: '50px', right: '-10px', width: '300px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', overflow: 'hidden', zIndex: 101 },
  notifHeader: { padding: '15px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  notifList: { maxHeight: '300px', overflowY: 'auto' },
  notifItemUnread: { padding: '15px', borderBottom: '1px solid #F3F4F6', backgroundColor: '#EFF6FF', cursor: 'default' },
  notifItemRead: { padding: '15px', borderBottom: '1px solid #F3F4F6', backgroundColor: 'white', cursor: 'default' },

  // Profile Styles
  profileButton: { display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '5px' },
  
  avatarWrapper: { width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarPlaceholder: { width: '100%', height: '100%', backgroundColor: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },

  userName: { fontWeight: '500', color: '#374151', fontSize: '14px' },
  
  dropdownMenu: { position: 'absolute', top: '50px', right: '0', width: '220px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', overflow: 'hidden', padding: '5px', zIndex: 101 },
  dropdownHeader: { padding: '15px', borderBottom: '1px solid #F3F4F6', marginBottom: '5px' },
  dropdownItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px', textDecoration: 'none', color: '#374151', fontSize: '14px', borderRadius: '6px', transition: 'background 0.2s', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', boxSizing: 'border-box' },
  divider: { height: '1px', backgroundColor: '#F3F4F6', margin: '5px 0' },
  
  main: { padding: '30px 40px', maxWidth: '1200px', margin: '0 auto' }
};

export default UserLayout;