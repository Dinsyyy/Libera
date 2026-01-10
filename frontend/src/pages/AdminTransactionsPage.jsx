import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { theme } from '../theme';

function AdminTransactionPage() {
  const [activeTab, setActiveTab] = useState('borrow');
  
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrowForm, setBorrowForm] = useState({ user_id: '', book_id: '', due_date: '' });
  
  const [activeLoans, setActiveLoans] = useState([]);
  const [returnTransactionId, setReturnTransactionId] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'return') {
      fetchActiveLoans();
    }
  }, [activeTab]);

  const fetchInitialData = async () => {
    try {
      const [resUsers, resBooks] = await Promise.all([
        api.get('/admin/users'),
        api.get('/books')
      ]);
      setUsers(resUsers.data.data || []);
      setBooks(resBooks.data.data || resBooks.data || []);
    } catch (error) {
      console.error("Gagal memuat data dropdown", error);
      setMessage({ type: 'error', text: 'Gagal memuat data untuk form.' });
    }
  };

  const fetchActiveLoans = async () => {
    try {
      const response = await api.get('/admin/active-loans');
      setActiveLoans(response.data.data || []);
    } catch (error) {
      console.error("Gagal memuat pinjaman aktif", error);
      setMessage({ type: 'error', text: 'Gagal memuat data pinjaman aktif.' });
    }
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/admin/transactions', borrowForm);
      setMessage({ type: 'success', text: 'Peminjaman berhasil dicatat!' });
      setBorrowForm({ user_id: '', book_id: '', due_date: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal mencatat peminjaman.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post(`/admin/transactions/${returnTransactionId}/return`);
      setMessage({ type: 'success', text: 'Buku berhasil dikembalikan!' });
      setReturnTransactionId('');
      fetchActiveLoans();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal memproses pengembalian.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Manajemen Transaksi</h1>
      
      <div style={styles.tabs}>
        <button 
          style={{...styles.tab, ...(activeTab === 'borrow' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('borrow')}
        >
          Peminjaman Buku
        </button>
        <button 
          style={{...styles.tab, ...(activeTab === 'return' ? styles.tabActive : {})}}
          onClick={() => setActiveTab('return')}
        >
          Pengembalian Buku
        </button>
      </div>

      {message && (
        <div style={{...styles.alert, ...(message.type === 'success' ? styles.alertSuccess : styles.alertError)}}>
          {message.text}
        </div>
      )}

      <div style={styles.formContainer}>
        {activeTab === 'borrow' && (
          <form onSubmit={handleBorrowSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="user_id" style={styles.label}>Pilih Anggota</label>
              <select 
                id="user_id"
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
              <label htmlFor="book_id" style={styles.label}>Pilih Buku</label>
              <select 
                id="book_id"
                style={styles.select}
                value={borrowForm.book_id}
                onChange={(e) => setBorrowForm({...borrowForm, book_id: e.target.value})}
                required
              >
                <option value="">-- Pilih Buku --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id} disabled={book.stock < 1}>
                    {book.title} {book.stock < 1 ? `(Stok: ${book.stock})` : `(Stok: ${book.stock})`}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="due_date" style={styles.label}>Tanggal Jatuh Tempo</label>
              <input 
                id="due_date"
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

        {activeTab === 'return' && (
          <form onSubmit={handleReturnSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="return_transaction_id" style={styles.label}>Pilih Buku yang Dikembalikan</label>
              <select 
                id="return_transaction_id"
                style={styles.select}
                value={returnTransactionId}
                onChange={(e) => setReturnTransactionId(e.target.value)}
                required
              >
                <option value="">-- Pilih Transaksi Peminjaman --</option>
                {activeLoans.length === 0 && <option disabled>Tidak ada buku yang sedang dipinjam</option>}
                {activeLoans.map(loan => (
                  <option key={loan.id} value={loan.id}>
                    {loan.book.title} - {loan.user.name} (Jatuh Tempo: {new Date(loan.due_date).toLocaleDateString('id-ID')})
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

const styles = {
  title: { 
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
  },
  tabs: { 
    display: 'flex', 
    gap: theme.spacing.sm, 
    marginBottom: theme.spacing.lg 
  },
  tab: {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`, 
    border: 'none', 
    backgroundColor: 'transparent', 
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer', 
    fontWeight: '600', 
    color: theme.colors.textSecondary,
    transition: 'background-color 0.2s, color 0.2s',
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
  },
  formContainer: {
    padding: theme.spacing.xl,
  },
  formGroup: { 
    marginBottom: theme.spacing.lg 
  },
  label: { 
    display: 'block', 
    marginBottom: theme.spacing.sm, 
    fontWeight: '600', 
    color: theme.colors.textPrimary 
  },
  select: { 
    width: '100%', 
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md, 
    border: `1px solid ${theme.colors.border}`, 
    fontSize: theme.typography.body.fontSize,
    backgroundColor: theme.colors.surface,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: { 
    width: '100%', 
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md, 
    border: `1px solid ${theme.colors.border}`, 
    fontSize: theme.typography.body.fontSize,
    backgroundColor: theme.colors.surface,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  submitButton: { 
    backgroundColor: theme.colors.primary, 
    color: theme.colors.surface, 
    padding: `${theme.spacing.md} ${theme.spacing.lg}`, 
    border: 'none', 
    borderRadius: theme.borderRadius.md, 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontSize: theme.typography.body.fontSize,
    transition: 'background-color 0.2s',
  },
  alert: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  alertSuccess: { 
    backgroundColor: '#D1FAE5', // Specific green
    color: '#065F46',
  },
  alertError: { 
    backgroundColor: '#FEE2E2', // Specific red
    color: '#991B1B',
  },
};

export default AdminTransactionPage;