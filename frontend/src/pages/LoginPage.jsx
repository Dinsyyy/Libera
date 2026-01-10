import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { theme } from '../theme';
import { LuEye, LuEyeOff } from 'react-icons/lu';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      login(response.data.user, response.data.token);

      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Selamat Datang Kembali</h2>
        <p style={styles.subtitle}>Login untuk mengakses perpustakaan digital Anda.</p>
        
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
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
                placeholder="••••••••"
                required
              />
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={styles.passwordToggle}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <LuEyeOff size={20}/> : <LuEye size={20}/>}
              </span>
            </div>
          </div>
          <div style={styles.forgotPassword}>
            <Link to="/forgot-password" style={styles.link}>Lupa Password?</Link>
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        
        <div style={styles.registerLink}>
          <p>Belum punya akun? <Link to="/register" style={styles.link}>Daftar di sini</Link></p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh', 
    backgroundColor: theme.colors.background 
  },
  loginBox: { 
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
    padding: `${theme.spacing.md} ${theme.spacing.md}`, 
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
  forgotPassword: {
    textAlign: 'right',
    marginBottom: theme.spacing.lg,
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
  },
  error: { 
    color: theme.colors.error, 
    marginBottom: theme.spacing.md,
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  registerLink: {
    marginTop: theme.spacing.xl,
    color: theme.colors.textSecondary,
  },
  link: {
    color: theme.colors.primary,
    textDecoration: 'none',
    fontWeight: '600',
  }
};

export default LoginPage;