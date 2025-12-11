import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Import API helper

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users'); // Panggil API baru kita
      setUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data pengguna.');
      setLoading(false);
      console.error('Gagal mengambil data pengguna:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await api.delete(`/admin/users/${id}`); // Panggil API delete
        fetchUsers(); // Refresh daftar
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
      }
    }
  };

  if (loading) return <p>Memuat...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1 style={styles.title}>Kelola Database Pengguna</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nama</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Tanggal Bergabung</th>
            <th style={styles.th}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.name}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
              <td style={styles.td}>
                <button 
                  style={styles.deleteButton}
                  onClick={() => handleDelete(user.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// (Style mirip AdminBooksPage)
const styles = {
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '30px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  th: { backgroundColor: '#f9f9f9', padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid #eee' },
  td: { padding: '12px 15px', borderBottom: '1px solid #eee' },
  deleteButton: { backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px 10px' }
};

export default AdminUsersPage;