import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Import API helper kita
import { useAuth } from '../contexts/AuthContext'; // Import hook Auth
import { Link } from 'react-router-dom'; // Untuk link ke buku

function UserDashboard() {
  const { user } = useAuth(); // Dapatkan data user yang login
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect akan berjalan saat halaman pertama kali dibuka
  useEffect(() => {
    const fetchMyTransactions = async () => {
      try {
        setLoading(true);
        // Panggil API untuk mengambil transaksi SAYA (token otomatis)
        const response = await api.get('/my-transactions');
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data peminjaman.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMyTransactions();
  }, []); // [] = hanya jalan sekali

  // Fungsi untuk memformat tanggal (agar lebih rapi)
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div>
      <h1 style={styles.welcomeTitle}>Selamat Datang, {user?.name}!</h1>
      <p style={styles.welcomeSubtitle}>
        Ini adalah dashboard Anda. Di sini Anda bisa melihat buku yang sedang Anda pinjam.
      </p>

      <hr style={styles.divider} />

      <h2 style={styles.sectionTitle}>Buku yang Sedang Anda Pinjam</h2>

      {loading && <p>Memuat...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          {transactions.filter(t => t.status === 'dipinjam').length === 0 ? (
            // Tampilan jika tidak ada buku yang dipinjam
            <p style={styles.noBooks}>
              Anda sedang tidak meminjam buku.
              <Link to="/catalog" style={styles.catalogLink}> Mulai cari buku?</Link>
            </p>
          ) : (
            // Tampilan jika ADA buku yang dipinjam
            <div style={styles.bookList}>
              {transactions
                .filter(t => t.status === 'dipinjam') // Hanya tampilkan yang 'dipinjam'
                .map((trans) => (
                  <div key={trans.id} style={styles.bookItem}>
                    <img
                      src={trans.book?.cover_image_url || 'https://via.placeholder.com/100x150.png?text=Libera'}
                      alt={trans.book?.title}
                      style={styles.bookCover}
                    />
                    <div style={styles.bookDetails}>
                      <h3 style={styles.bookTitle}>{trans.book?.title}</h3>
                      <p style={styles.bookAuthor}>{trans.book?.author}</p>
                      <p style={styles.dateInfo}>
                        Dipinjam: {formatDate(trans.borrow_date)}
                      </p>
                      <p style={styles.dateInfo}>
                        <strong>Jatuh Tempo: {formatDate(trans.due_date)}</strong>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {/* (Nanti bisa tambahkan "Riwayat Peminjaman" di sini) */}
    </div>
  );
}

// (CSS Sederhana untuk Dashboard Pengguna)
const styles = {
  welcomeTitle: {
    margin: 0,
  },
  welcomeSubtitle: {
    fontSize: '18px',
    color: '#555',
    marginTop: '5px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #eee',
    margin: '30px 0',
  },
  sectionTitle: {
    marginBottom: '20px',
  },
  noBooks: {
    fontSize: '16px',
    color: '#777',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '8px',
    textAlign: 'center',
  },
  catalogLink: {
    color: '#34495e',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  bookList: {
    display: 'grid',
    gap: '20px',
  },
  bookItem: {
    display: 'flex',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    gap: '20px',
  },
  bookCover: {
    width: '100px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    margin: '0 0 5px 0',
  },
  bookAuthor: {
    margin: '0 0 15px 0',
    color: '#777',
    fontStyle: 'italic',
  },
  dateInfo: {
    margin: '5px 0',
    fontSize: '14px',
  },
};

export default UserDashboard;