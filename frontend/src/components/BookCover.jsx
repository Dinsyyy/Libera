import React, { useState, useEffect } from 'react';

const BookCover = ({ url, title, style }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset error jika url berubah
    setError(false);

    if (!url) {
      setImgSrc(null);
      return;
    }

    // LOGIKA PINTAR:
    // 1. Jika URL dimulai dengan "http" (Link luar/OpenLibrary), pakai langsung.
    // 2. Jika tidak, anggap itu file lokal di folder storage Laravel.
    if (url.startsWith('http') || url.startsWith('https')) {
      setImgSrc(url);
    } else {
      // Pastikan tidak ada slash ganda
      const cleanUrl = url.replace(/^\//, '');
      setImgSrc(`http://127.0.0.1:8000/storage/${cleanUrl}`);
    }
  }, [url]);

  // TAMPILAN JIKA GAMBAR ERROR / KOSONG
  if (!imgSrc || error) {
    return (
      <div 
        style={{
          ...style,
          backgroundColor: '#E2E8F0', // Abu-abu terang
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#64748B',
          fontWeight: 'bold',
          padding: '10px',
          border: '1px solid #CBD5E1',
          overflow: 'hidden'
        }}
      >
        {/* Ikon Buku Sederhana */}
        <span style={{fontSize: '24px', marginBottom: '5px'}}>📖</span>
        <span style={{fontSize: '10px', lineHeight: '1.2'}}>
          {title || 'No Cover'}
        </span>
      </div>
    );
  }

  // TAMPILAN GAMBAR ASLI
  return (
    <img 
      src={imgSrc} 
      alt={title} 
      style={style} 
      // eslint-disable-next-line no-unused-vars
      onError={(e) => {
        // Log error ke console agar kita tahu kenapa gagal
        console.warn("Gagal memuat gambar:", imgSrc);
        setError(true);
      }} 
    />
  );
};

export default BookCover;