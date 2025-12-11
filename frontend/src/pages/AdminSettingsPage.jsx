import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../contexts/useAuth';

function AdminSettingsPage() {
  const { user, login } = useAuth(); // Kita butuh 'login' untuk update data user di session lokal
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' atau 'app'
  
  // --- STATE PROFIL ---
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  // --- STATE APLIKASI (Mockup/Simulasi) ---
  const [appForm, setAppForm] = useState({
    appName: 'Libera Library',
    description: 'Perpustakaan Digital Masa Depan',
    contactEmail: 'admin@libera.com'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Isi form saat halaman dimuat
  useEffect(() => {
    if (user) {
      setProfileForm(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  // --- HANDLE UPDATE PROFIL ---
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Panggil API PUT /api/admin/profile
      const response = await api.put('/admin/profile', {
        name: profileForm.name,
        email: profileForm.email,
        // Kirim password hanya jika diisi
        ...(profileForm.password && { 
          password: profileForm.password, 
          password_confirmation: profileForm.password_confirmation 
        })
      });

      // Update data user di LocalStorage/Context
      // Kita gunakan token lama, tapi user object baru
      const token = localStorage.getItem('token');
      login(response.data.user, token);

      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      // Kosongkan field password
      setProfileForm(prev => ({ ...prev, password: '', password_confirmation: '' }));

    } catch (err) {
      console.error(err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Gagal memperbarui profil.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE UPDATE APLIKASI (Simulasi) ---
  const handleAppUpdate = (e) => {
    e.preventDefault();
    // Karena kita belum punya tabel 'settings' di DB, kita simpan di console saja dulu
    console.log("Simpan Pengaturan Aplikasi:", appForm);
    setMessage({ type: 'success', text: 'Pengaturan aplikasi disimpan (Simulasi).' });
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Pengaturan</h1>

      {/* --- TAB NAVIGASI --- */}
      <div style={styles.tabs}>
        <button 
          style={activeTab === 'profile' ? styles.tabActive : styles.tab}
          onClick={() => { setActiveTab('profile'); setMessage(null); }}
        >
          Profil Saya
        </button>
        <button 
          style={activeTab === 'app' ? styles.tabActive : styles.tab}
          onClick={() => { setActiveTab('app'); setMessage(null); }}
        >
          Pengaturan Aplikasi
        </button>
      </div>

      {/* --- NOTIFIKASI --- */}
      {message && (
        <div style={message.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {message.text}
        </div>
      )}

      <div style={styles.card}>
        
        {/* === TAB 1: PROFIL SAYA === */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileUpdate}>
            <div style={styles.profileHeader}>
              <div style={styles.avatarLarge}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <h3 style={{margin: '0 0 5px 0'}}>{user?.name}</h3>
                <p style={{margin: 0, color: '#6B7280', fontSize: '14px'}}>{user?.role}</p>
                {/* Tombol Upload Foto (UI Saja) */}
                <button type="button" style={styles.uploadButton}>Ubah Foto</button>
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <input 
                  type="text" 
                  style={styles.input} 
                  value={profileForm.name}
                  onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input 
                  type="email" 
                  style={styles.input} 
                  value={profileForm.email}
                  onChange={e => setProfileForm({...profileForm, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <hr style={styles.divider} />
            <p style={styles.sectionLabel}>Ubah Password (Kosongkan jika tidak ingin mengubah)</p>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Password Baru</label>
                <input 
                  type="password" 
                  style={styles.input} 
                  value={profileForm.password}
                  onChange={e => setProfileForm({...profileForm, password: e.target.value})}
                  placeholder="Minimal 8 karakter"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Konfirmasi Password</label>
                <input 
                  type="password" 
                  style={styles.input} 
                  value={profileForm.password_confirmation}
                  onChange={e => setProfileForm({...profileForm, password_confirmation: e.target.value})}
                />
              </div>
            </div>

            <div style={styles.buttonRow}>
              <button type="submit" style={styles.saveButton} disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
              </button>
            </div>
          </form>
        )}

        {/* === TAB 2: PENGATURAN APLIKASI === */}
        {activeTab === 'app' && (
          <form onSubmit={handleAppUpdate}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nama Aplikasi</label>
              <input 
                type="text" 
                style={styles.input}
                value={appForm.appName}
                onChange={e => setAppForm({...appForm, appName: e.target.value})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Deskripsi Singkat</label>
              <textarea 
                style={styles.textarea}
                value={appForm.description}
                onChange={e => setAppForm({...appForm, description: e.target.value})}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Kontak Admin</label>
              <input 
                type="email" 
                style={styles.input}
                value={appForm.contactEmail}
                onChange={e => setAppForm({...appForm, contactEmail: e.target.value})}
              />
            </div>
            <div style={styles.buttonRow}>
              <button type="submit" style={styles.saveButton}>
                Simpan Pengaturan Aplikasi
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}

// (STYLES - Mengikuti tema sidebar baru)
const styles = {
  pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '1px' },
  tab: {
    padding: '10px 20px', border: 'none', backgroundColor: 'transparent', 
    borderBottom: '2px solid transparent',
    cursor: 'pointer', fontWeight: '500', color: '#6B7280', fontSize: '16px'
  },
  tabActive: {
    padding: '10px 20px', border: 'none', backgroundColor: 'transparent', 
    borderBottom: '2px solid #2563EB', // Garis biru di bawah
    cursor: 'pointer', fontWeight: 'bold', color: '#2563EB', fontSize: '16px'
  },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  
  // Profile Styles
  profileHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
  avatarLarge: {
    width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E5E7EB',
    color: '#374151', fontSize: '32px', fontWeight: 'bold', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  },
  uploadButton: {
    marginTop: '8px', padding: '6px 12px', border: '1px solid #D1D5DB', 
    backgroundColor: 'white', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
  },
  
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '15px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '15px', minHeight: '80px', boxSizing: 'border-box' },
  
  divider: { border: 'none', borderTop: '1px solid #E5E7EB', margin: '20px 0' },
  sectionLabel: { color: '#6B7280', fontSize: '14px', marginBottom: '15px' },
  
  buttonRow: { textAlign: 'right', marginTop: '10px' },
  saveButton: { 
    backgroundColor: '#2563EB', color: 'white', padding: '10px 20px', border: 'none', 
    borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' 
  },
  alertSuccess: { padding: '15px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '20px' },
  alertError: { padding: '15px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', marginBottom: '20px' },
};

export default AdminSettingsPage;