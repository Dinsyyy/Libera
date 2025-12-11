import React from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Lupa Password</h2>
        <p style={styles.message}>
          Fitur ini sedang dalam pengembangan. Untuk saat ini, silakan hubungi administrator
          jika Anda lupa password Anda.
        </p>
        <Link to="/" style={styles.link}>Kembali ke Login</Link>
      </div>
    </div>
  );
}

// (Style sederhana)
const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' },
  box: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '400px', textAlign: 'center' },
  title: { marginBottom: '24px', color: '#333' },
  message: { color: '#555', lineHeight: '1.6', marginBottom: '20px' },
  link: { color: '#34495e', textDecoration: 'none', fontSize: '14px' }
};

export default ForgotPasswordPage;