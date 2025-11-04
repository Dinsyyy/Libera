import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Import API helper

function AdminDashboard() {
  // Siapkan state untuk menyimpan data statistik
  const [stats, setStats] = useState({
    total_books: 0,
    total_users: 0,
    books_borrowed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard-stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) { 
        setError('Gagal memuat statistik.');
        setLoading(false);
        console.error('Gagal mengambil statistik dashboard:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>
      
      {/* Tampilkan Loading atau Error */}
      {loading && <p>Memuat statistik...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Tampilkan Stat Cards */}
      {!loading && !error && (
        <div style={styles.statGrid}>
          <StatCard title="Total Buku" value={stats.total_books} />
          <StatCard title="Total Pengguna" value={stats.total_users} />
          <StatCard title="Buku Dipinjam" value={stats.books_borrowed} />
        </div>
      )}
      
      {/* (FITUR BARU) Placeholder Aktivitas */}
      <div style={styles.activityBox}>
        <h2 style={styles.activityTitle}>Aktivitas Terbaru</h2>
        <p style={styles.placeholder}>[Placeholder untuk log aktivitas]</p>
      </div>
    </div>
  );
}

// Komponen helper untuk Kartu Statistik
function StatCard({ title, value }) {
  return (
    <div style={styles.statCard}>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.cardValue}>{value}</p>
    </div>
  );
}

// (STYLE BARU) Sesuai wireframe
const styles = {
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 kolom
    gap: '30px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  cardTitle: {
    fontSize: '16px',
    color: '#555',
    margin: '0 0 10px 0',
  },
  cardValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  activityBox: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  activityTitle: {
    margin: '0 0 20px 0',
  },
  placeholder: {
    textAlign: 'center',
    color: '#999',
    padding: '50px 0',
  }
};

export default AdminDashboard;