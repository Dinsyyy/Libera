import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';

function UserCatalogPage() {
  // Definisi State (Hanya boleh ada satu kali)
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        
        // LOG DEBUGGING (Cek di Console Browser)
        console.log("Response API:", response);
        console.log("Data Buku:", response.data.data || response.data);

        setBooks(response.data.data || response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error Fetching:", err);
        // Tampilkan alert biar Anda tahu kalau error
        alert("Gagal mengambil data buku: " + err.message); 
        setLoading(false);
      }
    };

  const filteredBooks = books.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = category === '' || book.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h1 style={styles.title}>Katalog Buku</h1>

      <div style={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Cari judul atau penulis..." 
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          style={styles.categorySelect}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Semua Kategori</option>
          <option value="Fiksi">Fiksi</option>
          <option value="Sains">Sains</option>
          <option value="Teknologi">Teknologi</option>
          <option value="Sejarah">Sejarah</option>
          <option value="Bisnis">Bisnis</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      {loading ? <p>Memuat buku...</p> : (
        <div style={styles.bookGrid}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} style={styles.link}>
                <div style={styles.card}>
                  <BookCover url={book.cover_image_url} title={book.title} style={styles.cover} />
                  <div style={styles.info}>
                    <span style={styles.badge}>{book.category || 'Umum'}</span>
                    <h3 style={styles.bookTitle}>{book.title}</h3>
                    <p style={styles.author}>{book.author}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>Tidak ada buku yang ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { marginBottom: '20px', color: '#111827' },
  filterBar: { display: 'flex', gap: '10px', marginBottom: '20px' },
  searchInput: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' },
  categorySelect: { padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' },
  bookGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px' },
  link: { textDecoration: 'none', color: 'inherit' },
  card: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden', height: '100%' },
  cover: { width: '100%', height: '240px', objectFit: 'cover' },
  info: { padding: '12px' },
  badge: { fontSize: '10px', backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold', color: '#6b7280' },
  bookTitle: { fontSize: '15px', fontWeight: 'bold', margin: '5px 0', lineHeight: '1.3' },
  author: { fontSize: '13px', color: '#6b7280' }
};

export default UserCatalogPage;