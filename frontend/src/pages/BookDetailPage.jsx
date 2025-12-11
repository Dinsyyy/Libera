import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom'; // (1) Import hooks

function BookDetailPage() {
  // (2) Dapatkan 'id' dari URL (misal: /books/1 -> id = 1)
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowMessage, setBorrowMessage] = useState(null); // Untuk pesan sukses/gagal

  // (3) useEffect untuk mengambil data buku saat halaman dibuka
  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        setLoading(true);
        // Panggil API GET /api/books/{id} (token otomatis)
        const response = await api.get(`/books/${id}`);
        setBook(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat detail buku.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookDetail();
  }, [id]); // (Akan jalan lagi jika ID di URL berubah)

  // (4) Fungsi untuk tombol "Pinjam Buku Ini"
  const handleBorrow = async () => {
    setBorrowMessage(null); // Bersihkan pesan lama

    try {
      // Panggil API POST /api/books/{id}/borrow (token otomatis)
      await api.post(`/books/${id}/borrow`);

      // Jika sukses, arahkan ke halaman sukses
      navigate('/borrow/success');

    } catch (err) {
      // Tangani error (misal: stok habis)
      if (err.response && err.response.data && err.response.data.message) {
        setBorrowMessage(err.response.data.message); // Tampilkan "Stok buku telah habis."
      } else {
        setBorrowMessage('Gagal meminjam buku. Coba lagi nanti.');
      }
      console.error(err);
    }
  };

  // (5) Tampilan loading, error, atau datanya
  if (loading) return <p>Memuat...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!book) return <p>Buku tidak ditemukan.</p>;

  // (6) Render tampilan (JSX) sesuai wireframe
  return (
    <div style={styles.container}>
      <img 
        src={book.cover_image_url || 'https://via.placeholder.com/300x450.png?text=LiberaBook'} 
        alt={book.title}
        style={styles.coverImage}
      />
      <div style={styles.details}>
        <h1 style={styles.title}>{book.title}</h1>
        <p style={styles.author}>oleh {book.author}</p>

        <div style={styles.metaGrid}>
          <div><strong>Penerbit</strong><p>{book.publisher || '-'}</p></div>
          <div><strong>Tahun Terbit</strong><p>{book.publication_year || '-'}</p></div>
          <div><strong>ISBN</strong><p>{book.isbn || '-'}</p></div>
          <div><strong>Stok</strong><p>{book.stock}</p></div>
        </div>

        <h3 style={styles.synopsisTitle}>Sinopsis</h3>
        <p style={styles.synopsis}>{book.synopsis || 'Tidak ada sinopsis.'}</p>

        {/* Tombol Aksi */}
        <button 
          style={book.stock > 0 ? styles.borrowButton : styles.disabledButton}
          onClick={handleBorrow}
          disabled={book.stock <= 0} // Nonaktifkan jika stok 0
        >
          {book.stock > 0 ? 'Pinjam Buku Ini' : 'Stok Habis'}
        </button>

        {/* Tampilkan pesan error pinjam (jika ada) */}
        {borrowMessage && <p style={styles.errorMessage}>{borrowMessage}</p>}
      </div>
    </div>
  );
}

// (CSS Sederhana untuk Halaman Detail)
const styles = {
  container: {
    display: 'flex',
    gap: '40px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  coverImage: {
    width: '300px',
    height: '450px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    margin: '0 0 10px 0',
  },
  author: {
    fontSize: '18px',
    color: '#555',
    margin: '0 0 20px 0',
    fontStyle: 'italic',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    margin: '20px 0',
  },
  synopsisTitle: {
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    marginTop: '20px',
  },
  synopsis: {
    lineHeight: '1.6',
    color: '#333',
  },
  borrowButton: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#34495e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  disabledButton: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
    marginTop: '20px',
  },
  errorMessage: {
    color: 'red',
    marginTop: '15px',
  }
};

export default BookDetailPage;