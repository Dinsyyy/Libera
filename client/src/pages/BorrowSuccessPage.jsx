import React from 'react';
import { Link } from 'react-router-dom'; // Untuk link kembali

function BorrowSuccessPage() {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1 style={styles.title}>Peminjaman Berhasil! 🥳</h1>
        <p style={styles.message}>
          Buku Anda telah berhasil dipinjam. Silakan cek dashboard Anda
          untuk melihat detail peminjaman dan tanggal jatuh tempo.
        </p>
        <div style={styles.buttonGroup}>
          <Link to="/catalog" style={styles.buttonSecondary}>
            Cari Buku Lain
          </Link>
          <Link to="/dashboard" style={styles.buttonPrimary}>
            Lihat Dashboard Saya
          </Link>
        </div>
      </div>
    </div>
  );
}

// (CSS Sederhana untuk Halaman Sukses)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50px',
  },
  box: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center',
    maxWidth: '600px',
  },
  title: {
    color: '#2ecc71',
  },
  message: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
    margin: '20px 0 30px 0',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  buttonPrimary: {
    padding: '12px 20px',
    backgroundColor: '#34495e',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
  buttonSecondary: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#34495e',
    border: '1px solid #34495e',
    textDecoration: 'none',
    borderRadius: '4px',
  }
};

export default BorrowSuccessPage;