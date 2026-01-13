import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';
import { LuBookUp } from 'react-icons/lu';

function UserDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-donations');
      setDonations(response.data);
      setLoading(false);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memuat daftar sumbangan.' });
      setLoading(false);
      console.error(err);
    }
  };

  const handleSubmitDonation = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);

    try {
      await api.post('/my-donations', {
        book_title: titleInput,
        author: authorInput,
      });
      setMessage({ type: 'success', text: 'Sumbangan berhasil diajukan!' });
      setTitleInput('');
      setAuthorInput('');
      fetchDonations(); // Refresh the list
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal mengajukan sumbangan.' });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}><LuBookUp size={30} style={{marginRight: '10px'}} /> Sumbangkan Bukumu</h1>

      <div style={styles.formSection}>
        <h2 style={styles.subHeading}>Ajukan Sumbangan Baru</h2>
        <form onSubmit={handleSubmitDonation} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="book_title" style={styles.label}>Judul Buku:</label>
            <input
              type="text"
              id="book_title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              style={styles.input}
              required
              disabled={submitting}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="author" style={styles.label}>Penulis:</label>
            <input
              type="text"
              id="author"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              style={styles.input}
              required
              disabled={submitting}
            />
          </div>
          <button type="submit" style={styles.submitButton} disabled={submitting}>
            {submitting ? 'Mengajukan...' : 'Ajukan Sumbangan'}
          </button>
          {message && (
            <p style={message.type === 'success' ? styles.successMessage : styles.errorMessage}>
              {message.text}
            </p>
          )}
        </form>
      </div>

      <div style={styles.donationListSection}>
        <h2 style={styles.subHeading}>Sumbangan Saya</h2>
        {loading ? (
          <p>Memuat sumbangan...</p>
        ) : donations.length === 0 ? (
          <p>Anda belum memiliki sumbangan yang tercatat.</p>
        ) : (
          <div style={styles.donationsGrid}>
            {donations.map((donation) => (
              <div key={donation.id} style={styles.donationCard}>
                <h3 style={styles.donationTitle}>{donation.book_title}</h3>
                <p style={styles.donationAuthor}>oleh {donation.author}</p>
                <div style={styles.donationStatus}>
                  Status: <span style={styles.statusBadge[donation.status]}>{donation.status}</span>
                </div>
                <p style={styles.donationDate}>Diajukan: {new Date(donation.donation_date).toLocaleDateString('id-ID')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
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
  subHeading: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  formSection: {
    marginBottom: '40px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  submitButton: {
    padding: '12px 20px',
    fontSize: '18px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  successMessage: {
    color: 'green',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  donationListSection: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  donationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  donationCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
  },
  donationTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#333',
  },
  donationAuthor: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  donationStatus: {
    fontSize: '14px',
    marginBottom: '10px',
    color: '#555',
  },
  statusBadge: {
    'Diterima': {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    'Diproses': {
      backgroundColor: '#ffc107',
      color: '#333',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    'Masuk Rak': {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    'Ditolak': {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
  },
  donationDate: {
    fontSize: '12px',
    color: '#888',
    margin: 0,
  },
};

export default UserDonationsPage;