import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../contexts/useAuth';
import { LuCamera } from "react-icons/lu";

function UserSettingsPage() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  // State Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  // State Foto
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      // Tampilkan foto profil yang ada (jika ada)
      // Backend Laravel biasanya mengirim path relatif, kita perlu URL lengkap
      // Tapi di langkah controller tadi kita sudah kirim URL lengkap atau bisa handle di sini
      if (user.profile_photo_path) {
        // Cek apakah URL sudah lengkap atau perlu ditambah base URL
        const photoUrl = user.profile_photo_path.startsWith('http') 
          ? user.profile_photo_path 
          : `http://127.0.0.1:8000/storage/${user.profile_photo_path}`;
        setPhotoPreview(photoUrl);
      }
    }
  }, [user]);

  // Handle Pilih File
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      // Buat preview lokal agar user bisa lihat sebelum upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // GUNAKAN FORMDATA UNTUK UPLOAD FILE
    const formData = new FormData();
    formData.append('_method', 'PUT'); // Trik agar Laravel mengenali ini sebagai PUT request
    formData.append('name', name);
    formData.append('email', email);
    if (password) {
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
    }
    if (photoFile) {
      formData.append('photo', photoFile);
    }

    try {
      // Kita POST ke endpoint profile (dengan _method: PUT di dalam body)
      // Ini karena HTML form upload file standar tidak support PUT langsung di beberapa server
      const response = await api.post('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Update data user di sesi lokal (termasuk foto baru)
      const token = localStorage.getItem('token');
      // Pastikan objek user yang disimpan punya full URL untuk foto
      const updatedUser = response.data.user;
      if (updatedUser.profile_photo_path && !updatedUser.profile_photo_path.startsWith('http')) {
         updatedUser.profile_photo_path = `http://127.0.0.1:8000/storage/${updatedUser.profile_photo_path}`;
      }

      login(updatedUser, token);

      setMessage({ type: 'success', text: 'Profil dan foto berhasil diperbarui!' });
      setPassword('');
      setPasswordConfirmation('');
      setPhotoFile(null); // Reset file input

    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal update profil.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{marginBottom: '20px'}}>Pengaturan Akun</h1>
      
      {message && (
        <div style={{
          padding: '10px', marginBottom: '20px', borderRadius: '5px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b'
        }}>
          {message.text}
        </div>
      )}

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <form onSubmit={handleSubmit}>
          
          {/* --- BAGIAN FOTO PROFIL --- */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
                backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#6B7280' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              
              {/* Tombol Kamera Kecil */}
              <button 
                type="button"
                onClick={() => fileInputRef.current.click()}
                style={{
                  position: 'absolute', bottom: '0', right: '0',
                  backgroundColor: '#2563EB', color: 'white', border: 'none',
                  borderRadius: '50%', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}
              >
                <LuCamera size={16} />
              </button>
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>Foto Profil</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>Format: JPG, PNG. Maks 2MB.</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} // Sembunyikan input asli
                accept="image/*"
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nama Lengkap</label>
            <input 
              type="text" 
              style={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input 
              type="email" 
              style={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <hr style={{ margin: '20px 0', borderTop: '1px solid #eee' }} />
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>Ganti Password (Opsional):</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Password Baru</label>
              <input 
                type="password" 
                style={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Konfirmasi Password</label>
              <input 
                type="password" 
                style={styles.input}
                value={passwordConfirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }
};

export default UserSettingsPage;