import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth'; // Import useAuth to get current user

const chunkString = (str, length) => {
  if (!str) return [];
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
};

function BookDetailPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current authenticated user

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowMessage, setBorrowMessage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [duration, setDuration] = useState(7);
  const [borrowType, setBorrowType] = useState('fisik');
  const [readingProgress, setReadingProgress] = useState(null);
  const [currentPageInput, setCurrentPageInput] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('reading');
  const [progressMessage, setProgressMessage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [ratingInput, setRatingInput] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [reviewMessage, setReviewMessage] = useState(null);


  const synopsisPages = useMemo(() => {
    return chunkString(book?.synopsis, 800) || [];
  }, [book]);

  // (3) useEffect untuk mengambil data buku saat halaman dibuka
  useEffect(() => {
    const fetchBookDetailsAndReviews = async () => {
      try {
        setLoading(true);
        const bookResponse = await api.get(`/books/${id}`);
        setBook(bookResponse.data);

        // Fetch reading progress for this book
        try {
          const progressResponse = await api.get(`/reading-progress/${id}`);
          setReadingProgress(progressResponse.data);
          setCurrentPageInput(progressResponse.data.current_page);
          setCurrentStatus(progressResponse.data.status);
        } catch (progressErr) {
          if (progressErr.response && progressErr.response.status === 404) {
            setReadingProgress(null);
            setCurrentPageInput(0);
            setCurrentStatus('reading');
          } else {
            console.error("Gagal memuat progres membaca:", progressErr);
          }
        }

        // Fetch reviews for this book
        try {
          const reviewsResponse = await api.get(`/books/${id}/reviews`);
          setReviews(reviewsResponse.data);
          const userReview = reviewsResponse.data.find(rev => user && rev.user_id === user.id);
          if (userReview) {
            setMyReview(userReview);
            setRatingInput(userReview.rating);
            setCommentInput(userReview.comment);
          } else {
            setMyReview(null);
            setRatingInput(0);
            setCommentInput('');
          }
        } catch (reviewsErr) {
          console.error("Gagal memuat ulasan:", reviewsErr);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat detail buku.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookDetailsAndReviews();
  }, [id, user]); // (Akan jalan lagi jika ID di URL atau user berubah)

  // (4) Fungsi untuk tombol "Pinjam Buku Ini"
  const handleBorrow = async () => {
    setBorrowMessage(null); // Bersihkan pesan lama

    try {
      // Panggil API POST /api/books/{id}/borrow dengan durasi
      await api.post(`/books/${id}/borrow`, { duration_days: duration });

      // Jika sukses, arahkan ke halaman sukses
      navigate('/borrow/success');

    } catch (err) {
      // Tangani error (misal: stok habis atau sudah pinjam)
      if (err.response && err.response.data && err.response.data.message) {
        setBorrowMessage(err.response.data.message); 
      } else {
        setBorrowMessage('Gagal meminjam buku. Coba lagi nanti.');
      }
      console.error(err);
    }
  };

  const handleSaveProgress = async () => {
    setProgressMessage(null);
    try {
      const response = await api.post('/reading-progress', {
        book_id: id,
        current_page: currentPageInput,
        status: currentStatus,
      });
      setReadingProgress(response.data.reading_progress);
      setProgressMessage('Progres membaca berhasil disimpan!');
    } catch (err) {
      console.error('Gagal menyimpan progres membaca:', err);
      setProgressMessage(err.response?.data?.message || 'Gagal menyimpan progres membaca.');
    }
  };

  const handleSubmitReview = async () => {
    setReviewMessage(null);
    try {
      await api.post('/reviews', {
        book_id: id,
        rating: ratingInput,
        comment: commentInput,
      });
      setReviewMessage('Ulasan berhasil dikirim!');
      // Refetch reviews to update the list and average rating
      const reviewsResponse = await api.get(`/books/${id}/reviews`);
      setReviews(reviewsResponse.data);
      // Also update the book's average rating on the page
      const updatedBookResponse = await api.get(`/books/${id}`);
      setBook(updatedBookResponse.data);

      const userReview = reviewsResponse.data.find(rev => user && rev.user_id === user.id);
      if (userReview) {
        setMyReview(userReview);
        setRatingInput(userReview.rating);
        setCommentInput(userReview.comment);
      } else {
        setMyReview(null);
        setRatingInput(0);
        setCommentInput('');
      }

    } catch (err) {
      console.error('Gagal mengirim ulasan:', err);
      setReviewMessage(err.response?.data?.message || 'Gagal mengirim ulasan.');
    }
  };

  const togglePreview = () => {
    if (!isPreviewOpen) {
      setPreviewPage(0);
    }
    setIsPreviewOpen(!isPreviewOpen);
  };

  // (5) Tampilan loading, error, atau datanya
  if (loading) return <p>Memuat...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!book) return <p>Buku tidak ditemukan.</p>;

  // (6) Render tampilan (JSX) sesuai wireframe
  return (
    <>
      <div style={styles.container}>
        <img
          src={book.cover_image_url || 'https://via.placeholder.com/300x450.png?text=LiberaBook'}
          alt={book.title}
          style={styles.coverImage}
        />
        <div style={styles.details}>
          <h1 style={styles.title}>{book.title}</h1>
          <p style={styles.author}>oleh {book.author}</p>

          <div style={styles.metaGrid}>
            <div><strong>Penerbit</strong><p>{book.publisher || '-'}</p></div>
            <div><strong>Tahun Terbit</strong><p>{book.publication_year || '-'}</p></div>
            <div><strong>ISBN</strong><p>{book.isbn || '-'}</p></div>
            <div><strong>Stok</strong><p>{book.stock}</p></div>
          </div>

          <h3 style={styles.synopsisTitle}>Sinopsis</h3>
          <p style={styles.synopsis}>{book.synopsis ? (book.synopsis.substring(0, 200) + '...') : 'Tidak ada sinopsis.'}</p>
          
          {/* Bagian Progres Membaca */}
          {book.total_pages > 0 && (
            <div style={styles.readingProgressContainer}>
              <h3 style={{margin: '0 0 15px 0'}}>Progres Membaca Anda</h3>
              <p style={{margin: '0 0 10px 0', fontSize: '14px'}}>Total Halaman: <strong>{book.total_pages}</strong></p>

              <div style={styles.progressInputGroup}>
                <label style={styles.progressLabel}>Halaman Saat Ini:</label>
                <input
                  type="number"
                  min="0"
                  max={book.total_pages}
                  value={currentPageInput}
                  onChange={(e) => setCurrentPageInput(Math.min(book.total_pages, Math.max(0, Number(e.target.value))))}
                  style={styles.progressInput}
                  disabled={!book.total_pages}
                />
              </div>

              <div style={styles.progressInputGroup}>
                <label style={styles.progressLabel}>Status:</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  style={styles.progressSelect}
                  disabled={!book.total_pages}
                >
                  <option value="reading">Sedang Membaca</option>
                  <option value="finished">Selesai</option>
                  <option value="paused">Dijeda</option>
                </select>
              </div>
              
              <button 
                onClick={handleSaveProgress} 
                style={styles.saveProgressButton}
                disabled={!book.total_pages}
              >
                Simpan Progres
              </button>
              {progressMessage && (
                <p style={styles.progressSuccess}>{progressMessage}</p>
              )}
            </div>
          )}

          {/* Opsi Durasi Pinjam */}
          <div style={styles.borrowTypeSelector}>
            <span style={styles.borrowTypeLabel}>Tipe Peminjaman:</span>
            <div style={{ display: 'flex', gap: '15px' }}>
              <label style={styles.borrowOption}>
                <input
                  type="radio"
                  name="borrowType"
                  value="fisik"
                  checked={borrowType === 'fisik'}
                  onChange={() => setBorrowType('fisik')}
                  style={styles.radioInput}
                  disabled={book.stock <= 0}
                />
                <span style={styles.radioLabel}>Fisik</span>
              </label>
              <label style={styles.borrowOption}>
                <input
                  type="radio"
                  name="borrowType"
                  value="virtual"
                  checked={borrowType === 'virtual'}
                  onChange={() => setBorrowType('virtual')}
                  style={styles.radioInput}
                  disabled={book.stock <= 0}
                />
                <span style={styles.radioLabel}>Virtual</span>
              </label>
            </div>

          </div>

          <div style={styles.durationSelector}>
            <label style={styles.durationLabel} htmlFor="duration">Lama Peminjaman:</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={styles.durationSelect}
              disabled={book.stock <= 0}
            >
              <option value={7}>7 Hari</option>
              <option value={14}>14 Hari</option>
            </select>
          </div>

          {/* Tombol Aksi */}
          <div style={styles.actionButtons}>
            <button
              style={book.stock > 0 ? styles.borrowButton : styles.disabledButton}
              onClick={handleBorrow}
              disabled={book.stock <= 0} // Nonaktifkan jika stok 0
            >
              {book.stock > 0 ? 'Pinjam Buku Ini' : 'Stok Habis'}
            </button>
            <button style={styles.previewButton} onClick={togglePreview}>
              Baca Preview
            </button>
          </div>

          {/* Tampilkan pesan error pinjam (jika ada) */}
          {borrowMessage && <p style={styles.errorMessage}>{borrowMessage}</p>}
        </div>
      </div>

      {/* Bagian Ulasan Pengguna */}
      <div style={{...styles.container, marginTop: '20px', flexDirection: 'column'}}>
        <h2 style={{...styles.synopsisTitle, border: 'none', paddingTop: 0, marginTop: 0, marginBottom: '20px'}}>Ulasan Pengguna</h2>
        
        <div style={styles.reviewSummary}>
          <p>Rating Rata-rata: <strong>{book.average_rating || 'N/A'}</strong> ({book.total_reviews || 0} ulasan)</p>
        </div>

        {user && ( // Only show review form if user is logged in
          <div style={styles.reviewForm}>
            <h3>{myReview ? 'Edit Ulasan Anda' : 'Beri Penilaian Anda'}</h3>
            <div style={styles.starRating}>
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{ cursor: 'pointer', fontSize: '24px', color: (i < ratingInput) ? '#FFD700' : '#ccc' }}
                  onClick={() => setRatingInput(i + 1)}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <div style={styles.reviewInputGroup}>
              <label htmlFor="comment" style={styles.reviewLabel}>Komentar:</label>
              <textarea
                id="comment"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                style={styles.reviewTextarea}
                rows="4"
              ></textarea>
            </div>
            <button onClick={handleSubmitReview} style={styles.submitReviewButton}>
              {myReview ? 'Update Ulasan' : 'Kirim Ulasan'}
            </button>
            {reviewMessage && <p style={styles.progressSuccess}>{reviewMessage}</p>}
          </div>
        )}

        <div style={styles.reviewList}>
          {reviews.filter(rev => !user || rev.user_id !== user.id).length > 0 ? ( // Filter out current user's review if it exists
            reviews.filter(rev => !user || rev.user_id !== user.id).map(review => (
              <div key={review.id} style={styles.reviewItem}>
                <p style={styles.reviewerName}>{review.user.name} - 
                  {[...Array(review.rating)].map((_, i) => <span key={i} style={{color: '#FFD700'}}>&#9733;</span>)}
                </p>
                <p style={styles.reviewComment}>{review.comment}</p>
                <p style={styles.reviewDate}>{new Date(review.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            ))
          ) : (
            <p>Belum ada ulasan lain untuk buku ini.</p>
          )}
        </div>
      </div>

      {isPreviewOpen && (
        <div style={styles.modalOverlay} onClick={togglePreview}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px'}}>Preview: {book.title}</h2>
            <div style={styles.modalBody}>
              <p style={styles.synopsis}>
                {synopsisPages.length > 0 ? synopsisPages[previewPage] : 'Tidak ada pratinjau yang tersedia.'}
              </p>
            </div>
            <div style={styles.modalFooter}>
              <p style={styles.disclaimer}>
                *Ini adalah pratinjau dari sinopsis buku. Konten buku sebenarnya tidak tersedia.
              </p>
              <div style={styles.paginationControls}>
                <button 
                  style={styles.navButton} 
                  onClick={() => setPreviewPage(p => p - 1)} 
                  disabled={previewPage === 0}
                >
                  &laquo; Sebelumnya
                </button>
                <span style={styles.pageNumber}>
                  Halaman {previewPage + 1} dari {synopsisPages.length}
                </span>
                <button 
                  style={styles.navButton} 
                  onClick={() => setPreviewPage(p => p + 1)}
                  disabled={previewPage >= synopsisPages.length - 1}
                >
                  Selanjutnya &raquo;
                </button>
              </div>
              <button style={styles.closeButton} onClick={togglePreview}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// (CSS Sederhana untuk Halaman Detail)
const styles = {
  container: {
    display: 'flex',
    gap: '40px',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  coverImage: {
    width: '300px',
    height: '450px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    margin: '0 0 10px 0',
  },
  author: {
    fontSize: '18px',
    color: '#555',
    margin: '0 0 20px 0',
    fontStyle: 'italic',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    margin: '20px 0',
  },
  synopsisTitle: {
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    marginTop: '20px',
  },
  synopsis: {
    lineHeight: '1.7',
    color: '#333',
  },
  readingProgressContainer: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  progressInputGroup: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items to spread out
  },
  progressLabel: {
    fontWeight: 'bold',
    marginRight: '10px',
    flexShrink: 0, // Prevent label from shrinking
  },
  progressInput: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100px', // Fixed width for input
    textAlign: 'center',
  },
  progressSelect: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  saveProgressButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  progressSuccess: {
    color: 'green',
    marginTop: '10px',
    fontWeight: 'bold',
  },
  durationSelector: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  durationLabel: {
    fontWeight: 'bold',
    marginRight: '10px',
  },
  durationSelect: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  borrowTypeSelector: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  borrowTypeLabel: {
    fontWeight: 'bold',
    marginRight: '10px',
    marginBottom: '10px',
    display: 'block',
  },
  borrowOption: {
    display: 'inline-flex',
    alignItems: 'center',
    marginRight: '15px',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '8px',
    // You might need to adjust size for consistency
  },
  radioLabel: {
    fontSize: '16px',
    color: '#333',
  },
  borrowDisclaimer: {
    fontSize: '12px',
    color: '#777',
    fontStyle: 'italic',
    marginTop: '10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px',
  },
  borrowButton: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#34495e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  previewButton: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#16a085',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  disabledButton: {
    padding: '15px 25px',
    fontSize: '18px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'not-allowed',
  },
  errorMessage: {
    color: 'red',
    marginTop: '15px',
    fontWeight: 'bold',
  },
  // Review Styles
  reviewSummary: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    paddingBottom: '15px',
    borderBottom: '1px solid #eee',
  },
  starRating: {
    marginBottom: '15px',
  },
  star: {
    cursor: 'pointer',
    fontSize: '24px',
    color: '#ccc',
    marginRight: '2px',
  },
  reviewForm: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #eee',
    marginBottom: '30px',
  },
  reviewInputGroup: {
    marginBottom: '15px',
  },
  reviewLabel: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  reviewTextarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    resize: 'vertical',
  },
  submitReviewButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  reviewList: {
    marginTop: '30px',
  },
  reviewItem: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #eee',
    marginBottom: '15px',
  },
  reviewerName: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  reviewDate: {
    fontSize: '12px',
    color: '#888',
    marginTop: '5px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.5',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    minHeight: '200px',
    lineHeight: '1.8',
  },
  modalFooter: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: '12px',
    color: '#777',
    fontStyle: 'italic',
    marginBottom: '20px',
  },
  paginationControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  pageNumber: {
    fontSize: '14px',
    color: '#555',
    fontWeight: 'bold',
  },
  navButton: {
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default BookDetailPage;