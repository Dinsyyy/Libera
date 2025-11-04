import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom'; // Untuk link ke detail

function UserCatalogPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      // Panggil API GET /api/books (token otomatis terkirim)
      const response = await api.get('/books');
      setBooks(response.data.data); // Ambil data dari paginasi
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data buku.');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading) return <p>Memuat buku...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1 style={styles.title}>Cari Katalog Kami</h1>
      {/* (Nanti tambahkan Search Bar di sini) */}

      {/* Grid untuk Kartu Buku */}
      <div style={styles.bookGrid}>
        {books.map((book) => (
          // Setiap kartu adalah Link ke halaman detail
          <Link to={`/books/${book.id}`} key={book.id} style={styles.bookCardLink}>
            <div style={styles.bookCard}>
              <img 
                src={book.cover_image_url || 'https://via.placeholder.com/200x300.png?text=LiberaBook'} 
                alt={book.title} 
                style={styles.bookCover} 
              />
              <h3 style={styles.bookTitle}>{book.title}</h3>
              <p style={styles.bookAuthor}>{book.author}</p>
              <span style={book.stock > 0 ? styles.stockAvailable : styles.stockEmpty}>
                {book.stock > 0 ? `Tersedia (${book.stock})` : 'Stok Habis'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// (CSS Sederhana untuk Katalog)
const styles = {
  title: {
    marginBottom: '30px',
  },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '30px',
  },
  bookCardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  bookCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  bookCover: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    backgroundColor: '#eee',
  },
  bookTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '10px 15px 5px 15px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bookAuthor: {
    fontSize: '14px',
    color: '#777',
    padding: '0 15px 10px 15px',
  },
  stockAvailable: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'green',
    padding: '0 15px 15px 15px',
  },
  stockEmpty: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'red',
    padding: '0 15px 15px 15px',
  }
};

export default UserCatalogPage;