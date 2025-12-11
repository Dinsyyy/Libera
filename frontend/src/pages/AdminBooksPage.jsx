import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import BookFormModal from '../components/BookFormModal'; // <-- (1) Import Modal

function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- (2) State Baru untuk Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 'null' berarti mode 'Tambah', objek buku berarti mode 'Edit'
  const [editingBook, setEditingBook] = useState(null); 
  // ---------------------------------

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data buku.');
      setLoading(false);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini?')) {
      try {
        await api.delete(`/admin/books/${id}`);
        fetchBooks(); // <-- Lebih baik panggil fetchBooks() untuk data terbaru
      } catch (err) {
        setError('Gagal menghapus buku.');
        console.error(err);
      }
    }
  };

  // --- (3) Fungsi-fungsi Baru untuk Modal ---
  const handleOpenAddModal = () => {
    setEditingBook(null); // Pastikan null (mode tambah)
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book); // Set buku yang mau diedit
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  // Fungsi ini akan dipanggil oleh Modal setelah sukses
  const handleSuccess = () => {
    fetchBooks(); // Refresh tabel
  };
  // ----------------------------------------

  if (loading) return <p>Memuat data buku...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1>Kelola Database Buku</h1>
        {/* (4) Hubungkan tombol ke fungsi modal */}
        <button style={styles.addButton} onClick={handleOpenAddModal}>
          + Tambah Buku Baru
        </button>
      </div>

      <table style={styles.table}>
        {/* ... (<thead> tetap sama seperti sebelumnya) ... */}
        <thead>
          <tr>
            <th style={styles.th}>Judul Buku</th>
            <th style={styles.th}>Penulis</th>
            <th style={styles.th}>Stok</th>
            <th style={styles.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td style={styles.td}>{book.title}</td>
              <td style={styles.td}>{book.author}</td>
              <td style={styles.td}>{book.stock}</td>
              <td style={styles.td}>
                {/* (5) Hubungkan tombol Edit ke fungsi modal */}
                <button 
                  style={styles.actionButton}
                  onClick={() => handleOpenEditModal(book)}
                >
                  Edit
                </button>
                <button 
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={() => handleDelete(book.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* (6) Tampilkan Modal jika isModalOpen true */}
      {isModalOpen && (
        <BookFormModal
          initialData={editingBook}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// (Styles tetap SAMA seperti sebelumnya)
const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  addButton: { padding: '10px 15px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  th: { backgroundColor: '#f9f9f9', padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #eee' },
  td: { padding: '12px 15px', borderBottom: '1px solid #eee' },
  actionButton: { marginRight: '8px', padding: '6px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#ecf0f1' },
  deleteButton: { backgroundColor: '#e74c3c', color: 'white' }
};

export default AdminBooksPage;