import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';

function UserReadingProgressPage() {
  const [readingProgress, setReadingProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadingProgress = async () => {
      try {
        setLoading(true);
        const response = await api.get('/my-reading-progress');
        setReadingProgress(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat progres membaca.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchReadingProgress();
  }, []);

  if (loading) return <p>Memuat progres membaca...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Progres Membaca Anda</h1>
      {readingProgress.length === 0 ? (
        <p>Anda belum memiliki progres membaca yang tercatat.</p>
      ) : (
        <div style={styles.progressGrid}>
          {readingProgress.map((progress) => (
            <div key={progress.id} style={styles.progressCard}>
              <Link to={`/books/${progress.book.id}`} style={styles.bookLink}>
                <BookCover url={progress.book.cover_image_url} title={progress.book.title} style={styles.bookCover} />
                <div style={styles.bookInfo}>
                  <h2 style={styles.bookTitle}>{progress.book.title}</h2>
                  <p style={styles.bookAuthor}>{progress.book.author}</p>
                </div>
              </Link>
              <div style={styles.progressDetails}>
                <p>Halaman: <strong>{progress.current_page}</strong> / {progress.book.total_pages}</p>
                <p>Status: <span style={styles.statusBadge[progress.status]}>{
                  progress.status === 'reading' ? 'Sedang Membaca' :
                  progress.status === 'finished' ? 'Selesai' :
                  'Dijeda'
                }</span></p>
                <p>Terakhir Dibaca: {new Date(progress.last_read_date).toLocaleDateString('id-ID')}</p>
              </div>
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
  },
  progressGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  progressCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
  },
  bookLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    textDecoration: 'none',
    color: 'inherit',
    borderBottom: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  bookCover: {
    width: '60px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginRight: '15px',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#333',
  },
  bookAuthor: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  progressDetails: {
    padding: '15px',
    fontSize: '14px',
    color: '#555',
  },
  statusBadge: {
    reading: {
      backgroundColor: '#f0ad4e',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    finished: {
      backgroundColor: '#5cb85c',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    paused: {
      backgroundColor: '#5bc0de',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
  },
};

export default UserReadingProgressPage;