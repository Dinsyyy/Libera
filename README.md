# 📚 LiberaApp - Sistem Manajemen Perpustakaan Modern

![Lisensi](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.2%2B-blueviolet)
![Laravel](https://img.shields.io/badge/Laravel-11.x-orange)
![React](https://img.shields.io/badge/React-19.x-blue)
![Vite](https://img.shields.io/badge/Vite-5.x-yellow)

**LiberaApp** adalah aplikasi manajemen perpustakaan berbasis web yang modern, dirancang untuk memberikan kemudahan bagi pengguna dalam meminjam buku dan bagi administrator dalam mengelola koleksi perpustakaan.

## ✨ Fitur Utama

Aplikasi ini memiliki dua peran utama: **Pengguna** dan **Admin**, dengan fitur yang disesuaikan untuk masing-masing peran.

### 👤 Untuk Pengguna

- **🔐 Otentikasi Aman:** Sistem registrasi dan login yang aman untuk para pengguna.
- **📖 Katalog Buku:** Jelajahi koleksi buku yang tersedia dengan mudah.
- **🔍 Detail Buku:** Lihat informasi lengkap setiap buku, termasuk sinopsis dan ketersediaan.
- **🚀 Proses Peminjaman:** Pinjam buku favoritmu hanya dengan beberapa klik.
- **📊 Dasbor Pengguna:** Pantau riwayat peminjaman dan status buku yang sedang dipinjam.

### 👑 Untuk Admin

- **📈 Dasbor Analitik:** Dapatkan ringkasan statistik perpustakaan, seperti jumlah buku, pengguna, dan transaksi.
- **📚 Manajemen Buku (CRUD):** Tambah, lihat, edit, dan hapus data buku dengan antarmuka yang intuitif.
- **👥 Manajemen Pengguna:** Kelola data pengguna yang terdaftar di sistem.
- **🔄 Manajemen Transaksi:** Pantau dan kelola semua transaksi peminjaman yang terjadi.
- **⚙️ Pengaturan Profil:** Kelola profil admin dengan mudah.

## 🛠️ Tumpukan Teknologi

- **Backend:** Laravel 11
- **Frontend:** React 19 (dijalankan dengan Vite)
- **Database:** SQLite (untuk kemudahan instalasi)
- **Styling:** CSS Murni

## 🚀 Panduan Instalasi

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di lingkungan lokal Anda.

### Prerequisites

- PHP 8.2+
- Composer
- Node.js & NPM

### 1. Clone Repositori

```bash
git clone git clone https://github.com/Dinsyyy/Libera.git
cd libera-app
```

### 2. Setup Backend (API)

Buka terminal baru dan jalankan perintah berikut dari direktori `api`.

```bash
# Pindah ke direktori api
cd api

# Salin file environment
cp .env.example .env

# Instal dependensi PHP
composer install

# Buat kunci aplikasi
php artisan key:generate

# Jalankan migrasi dan seeding database
# (Ini akan membuat database SQLite dan mengisinya dengan data awal)
php artisan migrate --seed

# Jalankan server backend
php artisan serve
```

Server API Anda sekarang berjalan di `http://127.0.0.1:8000`.

### 3. Setup Frontend (Client)

Buka terminal **lain** dan jalankan perintah berikut dari direktori `client`.

```bash
# Pindah ke direktori client
cd client

# Instal dependensi JavaScript
npm install

# Jalankan server pengembangan frontend
npm run dev
```

Aplikasi frontend Anda sekarang dapat diakses di `http://localhost:5173`.
