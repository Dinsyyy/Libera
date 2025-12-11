import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // (1) Import Link
import { useAuth } from '../contexts/useAuth';

// (2) Import Ikon Mata (kita akan gunakan emoji sederhana untuk saat ini)
// Jika Anda ingin ikon sungguhan, kita bisa install react-icons nanti

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // (3) State baru untuk show/hide password
  const [showPassword, setShowPassword] = useState(false); 

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email: email,
        password: password,
      });

      login(response.data.user, response.data.token);

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // ... (Logika error tetap sama) ...
      console.error('Login Gagal:', err);
      if (err.response && err.response.data) {
        if (err.response.status === 422 && err.response.data.errors) {
           setError(err.response.data.errors.email[0]); 
        } else {
           setError(err.response.data.message || 'Login gagal.');
        }
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login ke Akun Anda</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            {/* (PERUBAHAN 2) Label diubah */}
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            {/* (PERUBAHAN 4) Input password dibungkus */}
            <div style={styles.passwordContainer}>
              <input
                // (PERUBAHAN 4) Tipe diubah berdasarkan state
                type={showPassword ? 'text' : 'password'}
                id="password"
                style={styles.inputPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* (PERUBAHAN 4) Tombol Show/Hide */}
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={styles.passwordToggle}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        
        {/* (PERUBAHAN 1) Link Login Admin DIHAPUS */}
        
        {/* (PERUBAHAN 3 & 5) Link baru ditambahkan */}
        <div style={styles.linksContainer}>
          <Link to="/forgot-password" style={styles.link}>Lupa Password?</Link>
          <Link to="/register" style={styles.link}>Belum punya akun? Daftar</Link>
        </div>
      </div>
    </div>
  );
}

// (PERUBAHAN STYLE) Perbarui objek styles
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' },
  loginBox: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' },
  title: { marginBottom: '24px', color: '#333' },
  inputGroup: { marginBottom: '20px', textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', color: '#555' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', marginBottom: '16px' },
  
  // (STYLE BARU) Untuk password toggle
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  inputPassword: {
    width: '100%',
    padding: '12px 40px 12px 12px', // Beri ruang di kanan untuk ikon
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  passwordToggle: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '18px',
  },

  // (STYLE BARU) Untuk link daftar & lupa password
  linksContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  link: {
    color: '#34495e',
    textDecoration: 'none',
    fontSize: '14px',
  }
};

export default LoginPage;