import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import BookCover from '../components/BookCover';
import { LuBookOpen } from 'react-icons/lu'; // Assuming you have an icon for borrowed books

function UserBorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-transactions'); // This API fetches all transactions, we'll filter active ones
      const activeLoans = response.data.filter(t => t.status === 'dipinjam');
      setBorrowedBooks(activeLoans);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat daftar buku yang dipinjam.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      await api.post(`/my-transactions/${transactionId}/return`);
      alert('Buku berhasil dikembalikan!');
      fetchBorrowedBooks(); // Refresh the list
    } catch (error) {
      console.error('Gagal mengembalikan buku:', error);
      alert('Gagal mengembalikan buku. Silakan coba lagi.');
    }
  };

  if (loading) return <p>Memuat daftar buku...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}><LuBookOpen size={30} style={{marginRight: '10px'}} /> Buku yang Sedang Anda Pinjam</h1>
      {borrowedBooks.length === 0 ? (
        <p>Anda tidak sedang meminjam buku apa pun.</p>
      ) : (
        <div style={styles.bookGrid}>
          {borrowedBooks.map((transaction) => (
            <div key={transaction.id} style={styles.bookCard}>
              <Link to={`/books/${transaction.book.id}`} style={styles.bookLink}>
                <BookCover url={transaction.book.cover_image_url} title={transaction.book.title} style={styles.bookCover} />
              </Link>
              <div style={styles.bookInfo}>
                <Link to={`/books/${transaction.book.id}`} style={styles.bookTitleLink}>
                  <h2 style={styles.bookTitle}>{transaction.book.title}</h2>
                </Link>
                <p style={styles.bookAuthor}>{transaction.book.author}</p>
                <p style={styles.dueDate}>Jatuh tempo: {transaction.due_date}</p>
                <button onClick={() => handleReturn(transaction.id)} style={styles.returnButton}>
                  Kembalikan
                </button>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  bookCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
  },
  bookLink: {
    display: 'block',
    width: '100%',
    height: '250px', // Fixed height for cover
    overflow: 'hidden',
  },
  bookCover: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bookInfo: {
    padding: '15px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  bookTitleLink: {
    textDecoration: 'none',
    color: 'inherit',
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
    margin: '0 0 10px 0',
  },
  dueDate: {
    fontSize: '14px',
    color: '#dc3545',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
  },
  returnButton: {
    padding: '10px 15px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: 'auto', // Push to bottom
    alignSelf: 'flex-start',
  },
};

export default UserBorrowedBooksPage;