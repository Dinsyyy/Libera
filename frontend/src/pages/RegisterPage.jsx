import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { theme } from '../theme';
import { LuEye, LuEyeOff } from 'react-icons/lu';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.');
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
      });

      alert('Registrasi berhasil! Silakan login untuk melanjutkan.');
      navigate('/'); 

    } catch (err) {
      console.error('Registrasi Gagal:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
        setError(validationErrors);
      } else {
        setError('Gagal mendaftar. Pastikan email belum terdaftar dan password minimal 8 karakter.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <h2 style={styles.title}>Buat Akun Baru</h2>
        <p style={styles.subtitle}>Mulai perjalanan literasi digital Anda bersama kami.</p>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Nama Lengkap</label>
            <input 
              type="text" 
              id="name"
              style={styles.input} 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nama Anda"
              required 
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Alamat Email</label>
            <input 
              type="email" 
              id="email"
              style={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="anda@email.com"
              required 
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.passwordContainer}>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password"
                style={styles.input} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Minimal 8 karakter"
                required 
              />
              <span onClick={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                {showPassword ? <LuEyeOff size={20}/> : <LuEye size={20}/>}
              </span>
            </div>
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password_confirmation" style={styles.label}>Konfirmasi Password</label>
            <div style={styles.passwordContainer}>
              <input 
                type={showPasswordConfirmation ? 'text' : 'password'} 
                id="password_confirmation"
                style={styles.input} 
                value={passwordConfirmation} 
                onChange={(e) => setPasswordConfirmation(e.target.value)} 
                placeholder="Ulangi password Anda"
                required 
              />
              <span onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} style={styles.passwordToggle}>
                {showPasswordConfirmation ? <LuEyeOff size={20}/> : <LuEye size={20}/>}
              </span>
            </div>
          </div>
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Memproses...' : 'Daftar Akun'}
          </button>
        </form>
        
        <div style={styles.loginLink}>
          <p>Sudah punya akun? <Link to="/" style={styles.link}>Login di sini</Link></p>
        </div>
      </div>
    </div>
  );
}

// Styles are consistent with LoginPage
const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    backgroundColor: theme.colors.background,
    padding: `${theme.spacing.xl} 0`,
  },
  registerBox: { 
    padding: theme.spacing.xxl, 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.lg, 
    boxShadow: theme.shadows.lg, 
    width: '100%',
    maxWidth: '380px',
    textAlign: 'center' 
  },
  title: { 
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  inputGroup: { 
    marginBottom: theme.spacing.lg, 
    textAlign: 'left' 
  },
  label: { 
    display: 'block', 
    marginBottom: theme.spacing.sm, 
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  input: { 
    width: '100%', 
    padding: theme.spacing.md, 
    border: `1px solid ${theme.colors.border}`, 
    borderRadius: theme.borderRadius.md, 
    boxSizing: 'border-box',
    fontSize: theme.typography.body.fontSize,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    color: theme.colors.textSecondary,
  },
  button: { 
    width: '100%', 
    padding: theme.spacing.md, 
    backgroundColor: theme.colors.primary, 
    color: theme.colors.surface, 
    border: 'none', 
    borderRadius: theme.borderRadius.md, 
    cursor: 'pointer', 
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
    marginTop: theme.spacing.md,
  },
  error: { 
    color: theme.colors.error, 
    marginBottom: theme.spacing.md,
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    textAlign: 'left',
    fontSize: theme.typography.caption.fontSize,
  },
  loginLink: {
    marginTop: theme.spacing.xl,
    color: theme.colors.textSecondary,
  },
  link: {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
  }
};

export default RegisterPage;