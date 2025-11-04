import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  // Siapkan state untuk form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Cek apakah password konfirmasi cocok
    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Panggil API register (kita tidak pakai api helper karena ini publik)
      await axios.post('http://127.0.0.1:8000/api/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      // Jika sukses, beri tahu user dan arahkan ke login
      alert('Registrasi berhasil! Silakan login.');
      navigate('/'); // Arahkan ke halaman login

    } catch (err) {
      console.error('Registrasi Gagal:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Tangani error validasi dari Laravel
        const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
        setError(validationErrors);
      } else {
        setError('Gagal mendaftar. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h2 style={styles.title}>Daftar Akun Baru</h2>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nama Lengkap</label>
            <input type="text" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input type="email" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Konfirmasi Password</label>
            <input type="password" style={styles.input} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
          </div>
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        
        <div style={styles.linksContainer}>
          <Link to="/" style={styles.link}>Sudah punya akun? Login</Link>
        </div>
      </div>
    </div>
  );
}

// (Gunakan style yang mirip dengan login)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7f6', padding: '20px 0' },
  registerBox: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' },
  title: { marginBottom: '24px', color: '#333' },
  inputGroup: { marginBottom: '20px', textAlign: 'left' },
  label: { display: 'block', marginBottom: '8px', color: '#555' },
  input: { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#34495e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', marginBottom: '16px' },
  linksContainer: { marginTop: '20px' },
  link: { color: '#34495e', textDecoration: 'none', fontSize: '14px' }
};

export default RegisterPage;