import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosInstance';
import { useAuth } from '../contexts/useAuth';
import BookCover from '../components/BookCover';
import { Link } from 'react-router-dom';
import { LuCalendarClock, LuFlame, LuSparkles, LuArrowRight, LuBook } from "react-icons/lu";

function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    reminders: [],
    bookOfTheDay: null,
    trending: [],
    genreRecommendations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/user/home');
        setData({
          reminders: response.data.reminders,
          bookOfTheDay: response.data.book_of_the_day,
          trending: response.data.trending,
          genreRecommendations: response.data.genre_recommendations,
        });
      } catch (err) {
        console.error("Gagal memuat beranda", err);
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchHomeData()]);
      setLoading(false);
    }

    fetchAllData();
  }, []);

  return (
    <div>
      {/* 1. HEADER SAMBUTAN */}
      <div style={styles.header}>
        <h1 style={styles.greeting}>Hai, {user?.name?.split(' ')[0]}! 👋</h1>
        <p style={{color: '#6B7280', margin: 0}}>Mau baca buku apa hari ini?</p>
      </div>

      {loading ? <p>Memuat konten...</p> : (
        <>
          {/* 2. PENGINGAT JATUH TEMPO (Hanya muncul jika ada) */}
          {data.reminders.length > 0 && (
            <div style={styles.reminderContainer}>
              <div style={styles.reminderHeader}>
                <LuCalendarClock size={20} color="#DC2626" />
                <span style={{fontWeight: 'bold', color: '#991B1B'}}>Pengingat Jatuh Tempo</span>
              </div>
              {data.reminders.map((item) => (
                <div key={item.id} style={styles.reminderItem}>
                  <span>Buku <b>{item.book?.title}</b> harus kembali pada {item.due_date}.</span>
                </div>
              ))}
            </div>
          )}

          {/* BOOK OF THE DAY */}
          {data.bookOfTheDay && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}><LuSparkles color="#F59E0B" /> Buku Hari Ini</h3>
              </div>
              <Link to={`/books/${data.bookOfTheDay.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                <div style={styles.bookOfTheDayContainer}>
                  <BookCover url={data.bookOfTheDay.cover_image_url} title={data.bookOfTheDay.title} style={styles.bookOfTheDayCover} />
                  <div style={styles.bookOfTheDayContent}>
                    <h4 style={styles.bookOfTheDayTitle}>{data.bookOfTheDay.title}</h4>
                    <p style={styles.bookOfTheDayAuthor}>{data.bookOfTheDay.author}</p>
                    <p style={styles.bookOfTheDaySynopsis}>
                      {data.bookOfTheDay.synopsis ? data.bookOfTheDay.synopsis.substring(0, 150) + '...' : 'Sinopsis tidak tersedia.'}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )}


          {/* 3. SECTION TRENDING (SLIDER) */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}><LuFlame color="#F59E0B" /> Sedang Trending</h3>
            </div>
            
            {/* Horizontal Scroll Container */}
            <div style={styles.sliderContainer}>
              {data.trending.map((book) => (
                <Link to={`/books/${book.id}`} key={book.id} style={{textDecoration: 'none'}}>
                  <div style={styles.trendingCard}>
                    <BookCover url={book.cover_image_url} title={book.title} style={styles.trendingCover} />
                    <div style={{padding: '10px'}}>
                      <h4 style={styles.bookTitle}>{book.title}</h4>
                      <p style={styles.bookAuthor}>{book.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 4. SECTION REKOMENDASI BERDASARKAN GENRE (GRID) */}
          {data.genreRecommendations.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <h3 style={styles.sectionTitle}><LuSparkles color="#8B5CF6" /> Rekomendasi Untukmu</h3>
                <Link to="/catalog" style={styles.seeAll}>Lihat Semua <LuArrowRight /></Link>
              </div>

              {data.genreRecommendations.map((genreGroup) => (
                <div key={genreGroup.category} style={styles.genreRecommendationGroup}>
                  <h4 style={styles.genreTitle}>{genreGroup.category}</h4>
                  <div style={styles.grid}>
                    {genreGroup.books.map((book) => (
                      <Link to={`/books/${book.id}`} key={book.id} style={{textDecoration: 'none'}}>
                        <div style={styles.recCard}>
                          <div style={{display: 'flex', gap: '15px'}}>
                            <BookCover url={book.cover_image_url} title={book.title} style={styles.recCover} />
                            <div style={{padding: '10px 0'}}>
                              <span style={styles.badge}>{book.category || 'Umum'}</span>
                              <h4 style={styles.recTitle}>{book.title}</h4>
                              <p style={styles.recAuthor}>{book.author}</p>
                              <p style={styles.recSynopsis}>
                                {book.synopsis ? book.synopsis.substring(0, 60) + '...' : 'Sinopsis tidak tersedia.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  header: { marginBottom: '30px' },
  greeting: { fontSize: '28px', fontWeight: '800', margin: '0 0 5px 0', color: '#111827' },
  
  // Reminder Styles
  reminderContainer: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px', padding: '15px', marginBottom: '30px' },
  reminderHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' },
  reminderItem: { fontSize: '14px', color: '#7F1D1D', marginBottom: '5px' },

  section: { marginBottom: '60px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 },
  seeAll: { fontSize: '14px', color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' },
  
  // Transaction List Styles
  transactionContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
  transactionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB'
  },
  transactionCover: {
    width: '50px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  transactionBookInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  returnButton: {
    backgroundColor: '#2563EB',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '12px',
  },

  // Book of the Day Styles
  bookOfTheDayContainer: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    border: '1px solid #E5E7EB',
    alignItems: 'center',
  },
  bookOfTheDayCover: {
    width: '120px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  bookOfTheDayContent: {
    flex: 1,
  },
  bookOfTheDayTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#111827',
  },
  bookOfTheDayAuthor: {
    fontSize: '14px',
    color: '#6B7280',
    margin: '0 0 10px 0',
  },
  bookOfTheDaySynopsis: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.5',
    margin: 0,
  },

  // Slider Styles (Trending)
  sliderContainer: { display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '10px', scrollBehavior: 'smooth' },
  trendingCard: { minWidth: '160px', width: '160px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E5E7EB' },
  trendingCover: { width: '100%', height: '220px', objectFit: 'cover' },
  bookTitle: { fontSize: '14px', fontWeight: 'bold', margin: '0 0 5px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  bookAuthor: { fontSize: '12px', color: '#6B7280', margin: 0 },

  // Grid Styles (Rekomendasi)
  genreRecommendationGroup: {
    marginBottom: '30px',
  },
  genreTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    color: '#333',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  recCard: { width: '100%', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E5E7EB', height: '100%' },
  recCover: { width: '100px', height: '140px', objectFit: 'cover' },
  badge: { fontSize: '10px', backgroundColor: '#F3F4F6', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#4B5563' },
  recTitle: { fontSize: '16px', fontWeight: 'bold', margin: '8px 0 4px 0', color: '#111827' },
  recAuthor: { fontSize: '13px', color: '#6B7280', margin: '0 0 8px 0' },
  recSynopsis: { fontSize: '12px', color: '#9CA3AF', margin: 0, lineHeight: '1.4' }
};

export default UserDashboard;