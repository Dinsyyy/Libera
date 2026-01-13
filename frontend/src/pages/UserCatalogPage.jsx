import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';
import { theme } from '../theme';
import { LuSearch } from 'react-icons/lu';

function UserCatalogPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      const bookData = response.data.data || response.data;
      setBooks(bookData);
      
      const uniqueCategories = [...new Set(bookData.map(b => b.category).filter(Boolean))];
      setAllCategories(uniqueCategories);

      setLoading(false);
    } catch (err) {
      console.error("Error Fetching:", err);
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
      <div style={styles.header}>
        <h1 style={styles.title}>Katalog Buku</h1>
        <p style={styles.subtitle}>Temukan petualangan literasi Anda berikutnya.</p>
      </div>

      <div style={styles.filterBar}>
        <div style={styles.searchContainer}>
          <LuSearch style={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Cari berdasarkan judul atau penulis..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.categoryButtonGroup}>
          <button 
            style={category === '' ? styles.categoryButtonActive : styles.categoryButton}
            onClick={() => setCategory('')}
          >
            Semua Kategori
          </button>
          {allCategories.map(cat => (
            <button 
              key={cat} 
              style={category === cat ? styles.categoryButtonActive : styles.categoryButton}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? <p>Memuat buku...</p> : (
        <div style={styles.bookGrid}>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} style={styles.link}>
                <div style={styles.card}>
                  <BookCover url={book.cover_image_url} title={book.title} style={styles.cover} />
                  <div style={styles.info}>
                    <span style={{...styles.badge, ...styles.categoryBadge(book.category)}}>{book.category || 'Umum'}</span>
                    <h3 style={styles.bookTitle}>{book.title}</h3>
                    <p style={styles.author}>oleh {book.author}</p>
                  </div>
                  <div style={styles.footer}>
                     <span style={book.stock > 0 ? styles.stockAvailable : styles.stockEmpty}>
                        {book.stock > 0 ? `Tersedia: ${book.stock}` : 'Stok Habis'}
                     </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p style={styles.noBooks}>Tidak ada buku yang cocok dengan pencarian Anda.</p>
          )}
        </div>
      )}
    </div>
  );
}

const categoryColors = {
  'Fiksi': '#3B82F6',
  'Teknologi': '#10B981',
  'Sains': '#8B5CF6',
  'Sejarah': '#F59E0B',
  'Bisnis': '#D946EF',
  'Default': '#6B7280',
};

const styles = {
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: { ...theme.typography.h1, color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  subtitle: { ...theme.typography.body, color: theme.colors.textSecondary, marginTop: 0 },
  filterBar: { display: 'flex', flexDirection: 'column', gap: theme.spacing.md, marginBottom: theme.spacing.xl, alignItems: 'stretch' },
  searchContainer: {
    width: '100%', // Take full width
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.colors.textSecondary,
  },
  searchInput: { 
    width: '100%', 
    padding: `${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} 40px`,
    borderRadius: theme.borderRadius.md, 
    border: `1px solid ${theme.colors.border}`,
    fontSize: theme.typography.body.fontSize,
  },
  categoryButtonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    width: '100%', // Take full width
    marginTop: theme.spacing.sm, // Add some space from search bar
  },
  categoryButton: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    cursor: 'pointer',
    fontSize: theme.typography.body.fontSize,
    transition: 'background-color 0.2s, color 0.2s',
  },
  categoryButtonActive: {
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.primary}`,
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
    cursor: 'pointer',
    fontSize: theme.typography.body.fontSize,
    fontWeight: 'bold',
  },
  bookGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: theme.spacing.xl },
  link: { textDecoration: 'none', color: 'inherit' },
  card: { 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.lg, 
    boxShadow: theme.shadows.sm, 
    overflow: 'hidden', 
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cover: { width: '100%', height: '280px', objectFit: 'cover' },
  info: { 
    padding: theme.spacing.md,
    flex: '1',
  },
  badge: { 
    ...theme.typography.caption,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`, 
    borderRadius: theme.borderRadius.sm, 
    textTransform: 'uppercase', 
    fontWeight: 'bold', 
  },
  categoryBadge: (category) => ({
    backgroundColor: categoryColors[category] || categoryColors['Default'],
    color: theme.colors.surface,
  }),
  bookTitle: { 
    ...theme.typography.h3,
    fontSize: '18px',
    margin: `${theme.spacing.sm} 0`, 
    lineHeight: '1.4',
    color: theme.colors.textPrimary,
  },
  author: { ...theme.typography.caption, color: theme.colors.textSecondary, margin: 0 },
  footer: {
    padding: `0 ${theme.spacing.md} ${theme.spacing.md}`,
  },
  stockAvailable: {
    ...theme.typography.caption,
    color: theme.colors.success,
    fontWeight: '600',
  },
  stockEmpty: {
    ...theme.typography.caption,
    color: theme.colors.error,
    fontWeight: '600',
  },
  noBooks: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.xxl,
  }
};

export default UserCatalogPage;