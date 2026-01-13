import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { LuTrophy } from 'react-icons/lu';

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat leaderboard.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <p>Memuat leaderboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}><LuTrophy size={30} style={{marginRight: '10px'}} /> Papan Peringkat Pembaca</h1>
      {leaderboard.length === 0 ? (
        <p>Belum ada data di papan peringkat.</p>
      ) : (
        <div style={styles.leaderboardList}>
          {leaderboard.map((entry, index) => (
            <div key={entry.id} style={styles.leaderboardItem}>
              <span style={styles.rank}>{index + 1}.</span>
              <span style={styles.userName}>{entry.name}</span>
              <span style={styles.pagesRead}>{entry.total_pages_read || 0} Halaman</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#333',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  leaderboardItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
  },
  rank: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: '15px',
    color: '#555',
    minWidth: '40px',
  },
  userName: {
    fontSize: '18px',
    fontWeight: '600',
    flex: 1,
    color: '#333',
  },
  pagesRead: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2563EB',
  },
};

export default LeaderboardPage;