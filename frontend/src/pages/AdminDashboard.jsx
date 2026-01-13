import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { LuBookOpen, LuUsers, LuArrowLeftRight, LuTrendingUp, LuBook, LuUserPlus, LuGift, LuActivity } from "react-icons/lu";

function AdminDashboard() {
  // Siapkan state untuk menyimpan data statistik
  const [stats, setStats] = useState({
    total_books: 0,
    total_users: 0,
    books_borrowed: 0,
    latestActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data saat halaman dimuat
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/dashboard-stats');
        setStats({
          total_books: response.data.total_books,
          total_users: response.data.total_users,
          books_borrowed: response.data.books_borrowed,
          latestActivities: response.data.latest_activities,
        });
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
        <>
          <div style={styles.statGrid}>
            <StatCard title="Total Buku" value={stats.total_books} icon={<LuBookOpen />} />
            <StatCard title="Total Pengguna" value={stats.total_users} icon={<LuUsers />} />
            <StatCard title="Buku Dipinjam" value={stats.books_borrowed} icon={<LuArrowLeftRight />} />
          </div>

          {/* Aktivitas Terbaru */}
          {stats.latestActivities.length > 0 && (
            <div style={styles.activitySection}>
              <h2 style={styles.activityTitle}>Aktivitas Terbaru</h2>
              <div style={styles.activityList}>
                {stats.latestActivities.map((activity, index) => (
                  <div key={index} style={styles.activityItem}>
                    <span style={styles.activityIcon}>
                      {activity.type === 'borrowed' && <LuBook color="#2563EB" />}
                      {activity.type === 'returned' && <LuBook color="#10B981" />}
                      {activity.type === 'user_registered' && <LuUserPlus color="#6D28D9" />}
                      {activity.type === 'book_added' && <LuBookOpen color="#F59E0B" />}
                      {activity.type === 'donation_request' && <LuGift color="#D946EF" />}
                      {/* Add more types if needed, e.g., 'review' */}
                    </span>
                    <p style={styles.activityDescription}>{activity.description}</p>
                    <span style={styles.activityTimestamp}>
                      {new Date(activity.timestamp).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Komponen helper untuk Kartu Statistik
function StatCard({ title, value, icon }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.cardHeader}>
        {icon && <span style={styles.cardIcon}>{icon}</span>}
        <h3 style={styles.cardTitle}>{title}</h3>
      </div>
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
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  cardIcon: {
    fontSize: '24px',
    color: '#3B82F6', // Example color
  },
  cardTitle: {
    fontSize: '16px',
    color: '#555',
    margin: 0,
  },
  cardValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  activitySection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginTop: '40px',
  },
  activityTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0 0 20px 0',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  activityIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  activityDescription: {
    flexGrow: 1,
    margin: 0,
    fontSize: '15px',
    color: '#333',
  },
  activityTimestamp: {
    fontSize: '12px',
    color: '#6B7280',
    flexShrink: 0,
  },
  placeholder: {
    textAlign: 'center',
    color: '#999',
    padding: '50px 0',
  }
};

export default AdminDashboard;