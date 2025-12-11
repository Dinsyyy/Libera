import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

// Ini adalah komponen Modal Form
// Props:
// - initialData: Data buku (jika sedang 'edit') atau null (jika 'tambah')
// - onClose: Fungsi untuk menutup modal
// - onSuccess: Fungsi untuk refresh daftar buku setelah sukses

function BookFormModal({ initialData, onClose, onSuccess }) {
  // 1. Siapkan state untuk semua field di form
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publisher: '',
    publication_year: '',
    isbn: '',
    stock: 0,
    synopsis: '',
    cover_image_url: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Tentukan apakah ini mode 'edit'
  const isEditMode = initialData != null;

  // 3. useEffect ini akan mengisi form jika kita dalam mode 'edit'
  useEffect(() => {
    if (isEditMode) {
      // Jika mode edit, isi form dengan 'initialData'
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        publisher: initialData.publisher || '',
        publication_year: initialData.publication_year || '',
        isbn: initialData.isbn || '',
        stock: initialData.stock || 0,
        synopsis: initialData.synopsis || '',
        cover_image_url: initialData.cover_image_url || '',
      });
    }
  }, [initialData, isEditMode]);

  // 4. Fungsi untuk menangani perubahan di input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. Fungsi yang dijalankan saat form di-submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        // Jika mode EDIT, panggil API 'PUT'
        await api.put(`/admin/books/${initialData.id}`, formData);
      } else {
        // Jika mode TAMBAH, panggil API 'POST'
        await api.post('/admin/books', formData);
      }

      onSuccess(); // Panggil fungsi onSuccess (untuk refresh tabel)
      onClose();   // Tutup modal

    } catch (err) {
      console.error('Gagal menyimpan buku:', err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Tangani error validasi dari Laravel
        const validationErrors = Object.values(err.response.data.errors).join(', ');
        setError(validationErrors);
      } else {
        setError('Gagal menyimpan data. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Tampilan (JSX) dari modal
  return (
    // Latar belakang gelap (backdrop)
    <div style={styles.backdrop} onClick={onClose}>
      {/* Kotak Modal (jangan tutup modal jika diklik di sini) */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{isEditMode ? 'Edit Buku' : 'Tambah Buku Baru'}</h3>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Kita buat form jadi 2 kolom */}
          <div style={styles.formGrid}>
            {/* Kolom Kiri */}
            <div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Judul Buku</label>
                <input name="title" value={formData.title} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Penulis</label>
                <input name="author" value={formData.author} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Penerbit</label>
                <input name="publisher" value={formData.publisher} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Tahun Terbit</label>
                <input name="publication_year" value={formData.publication_year} onChange={handleChange} style={styles.input} />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ISBN</label>
                <input name="isbn" value={formData.isbn} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Stok</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} style={styles.input} required />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>URL Cover Buku</label>
                <input name="cover_image_url" value={formData.cover_image_url} onChange={handleChange} style={styles.input} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Sinopsis</label>
                <textarea name="synopsis" value={formData.synopsis} onChange={handleChange} style={styles.textarea} />
              </div>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Batal
            </button>
            <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// (CSS Sederhana untuk Modal)
const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '800px',
    maxWidth: '90%',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' },
  buttonGroup: {
    marginTop: '20px',
    textAlign: 'right',
  },
  cancelButton: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  submitButton: {
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#2ecc71',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: { color: 'red', marginBottom: '15px', fontSize: '14px' },
};

export default BookFormModal;