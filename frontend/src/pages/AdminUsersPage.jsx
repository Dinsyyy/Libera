import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance'; // Import API helper
import { theme } from '../theme'; // Import theme
import { LuTrash2 } from 'react-icons/lu'; // Import ikon

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
      const response = await api.get('/admin/users');
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
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal menghapus pengguna.');
      }
    }
  };

  if (loading) return <p>Memuat data pengguna...</p>;
  if (error) return <p style={{ color: theme.colors.error }}>{error}</p>;

  return (
    <div>
      <h1 style={styles.title}>Manajemen Anggota</h1>
      <div style={styles.tableContainer}>
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
                <td style={styles.td}>{new Date(user.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                <td style={styles.td}>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDelete(user.id)}
                    title="Hapus Pengguna"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  tableContainer: {
    overflowX: 'auto',
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
  },
  th: { 
    backgroundColor: theme.colors.background,
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    textAlign: 'left', 
    borderBottom: `1px solid ${theme.colors.border}`,
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: { 
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  deleteButton: { 
    background: 'none',
    border: 'none',
    color: theme.colors.error,
    cursor: 'pointer',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default AdminUsersPage;