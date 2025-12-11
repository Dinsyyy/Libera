import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

function AdminTransactionPage() {
  const [activeTab, setActiveTab] = useState('borrow'); // 'borrow' atau 'return'
  
  // --- STATE UNTUK PEMINJAMAN ---
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowForm, setBorrowForm] = useState({ user_id: '', book_id: '', due_date: '' });
  
  // --- STATE UNTUK PENGEMBALIAN ---
  const [activeLoans, setActiveLoans] = useState([]);
  const [returnTransactionId, setReturnTransactionId] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Pesan sukses/error

  // Ambil data Users dan Books saat halaman dimuat
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Ambil data Active Loans setiap kali tab 'return' aktif
  useEffect(() => {
    if (activeTab === 'return') {
      fetchActiveLoans();
    }
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      const [resUsers, resBooks] = await Promise.all([
        api.get('/admin/users'),
        api.get('/books') // Ambil semua buku
      ]);
      setUsers(resUsers.data.data);
      setBooks(resBooks.data.data || resBooks.data); // Handle format paginasi
    } catch (error) {
      console.error("Gagal memuat data dropdown", error);
    }
  };

  const fetchActiveLoans = async () => {
    try {
      const response = await api.get('/admin/active-loans');
      setActiveLoans(response.data.data);
    } catch (error) {
      console.error("Gagal memuat pinjaman aktif", error);
    }
  };

  // --- HANDLE SUBMIT PEMINJAMAN ---
  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/admin/transactions', borrowForm);
      setMessage({ type: 'success', text: 'Peminjaman berhasil dicatat!' });
      setBorrowForm({ user_id: '', book_id: '', due_date: '' }); // Reset form
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal mencatat peminjaman.' });
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE SUBMIT PENGEMBALIAN ---
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post(`/admin/transactions/${returnTransactionId}/return`);
      setMessage({ type: 'success', text: 'Buku berhasil dikembalikan!' });
      setReturnTransactionId('');
      fetchActiveLoans(); // Refresh list
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal memproses pengembalian.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.pageTitle}>Manajemen Transaksi</h1>
      
      {/* --- TAB NAVIGASI --- */}
      <div style={styles.tabs}>
        <button 
          style={activeTab === 'borrow' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('borrow')}
        >
          Peminjaman Buku
        </button>
        <button 
          style={activeTab === 'return' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('return')}
        >
          Pengembalian Buku
        </button>
      </div>

      {/* --- NOTIFIKASI --- */}
      {message && (
        <div style={message.type === 'success' ? styles.alertSuccess : styles.alertError}>
          {message.text}
        </div>
      )}

      {/* --- KONTEN FORM --- */}
      <div style={styles.card}>
        
        {/* === FORM PEMINJAMAN === */}
        {activeTab === 'borrow' && (
          <form onSubmit={handleBorrowSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pilih Anggota</label>
              <select 
                style={styles.select} 
                value={borrowForm.user_id}
                onChange={(e) => setBorrowForm({...borrowForm, user_id: e.target.value})}
                required
              >
                <option value="">-- Pilih Anggota --</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Pilih Buku</label>
              <select 
                style={styles.select}
                value={borrowForm.book_id}
                onChange={(e) => setBorrowForm({...borrowForm, book_id: e.target.value})}
                required
              >
                <option value="">-- Pilih Buku --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id} disabled={book.stock < 1}>
                    {book.title} {book.stock < 1 ? '(Stok Habis)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tanggal Jatuh Tempo</label>
              <input 
                type="date" 
                style={styles.input}
                value={borrowForm.due_date}
                onChange={(e) => setBorrowForm({...borrowForm, due_date: e.target.value})}
                required
              />
            </div>

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Memproses...' : 'Catat Peminjaman'}
            </button>
          </form>
        )}

        {/* === FORM PENGEMBALIAN === */}
        {activeTab === 'return' && (
          <form onSubmit={handleReturnSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Pilih Buku yang Dikembalikan</label>
              <select 
                style={styles.select}
                value={returnTransactionId}
                onChange={(e) => setReturnTransactionId(e.target.value)}
                required
              >
                <option value="">-- Pilih Transaksi Peminjaman --</option>
                {activeLoans.length === 0 && <option disabled>Tidak ada buku yang sedang dipinjam</option>}
                {activeLoans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {loan.book.title} - Peminjam: {loan.user.name} (Tempo: {loan.due_date})
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Memproses...' : 'Konfirmasi Pengembalian'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

// (STYLES)
const styles = {
  pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#111827' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: {
    padding: '10px 20px', border: 'none', backgroundColor: '#E5E7EB', 
    borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: '#4B5563'
  },
  tabActive: {
    padding: '10px 20px', border: 'none', backgroundColor: '#111827', 
    borderRadius: '8px', cursor: 'pointer', fontWeight: '500', color: 'white'
  },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' },
  select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '16px' },
  submitButton: { 
    backgroundColor: '#2563EB', color: 'white', padding: '12px 24px', border: 'none', 
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' 
  },
  alertSuccess: { padding: '15px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '20px' },
  alertError: { padding: '15px', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '8px', marginBottom: '20px' },
};

export default AdminTransactionPage;