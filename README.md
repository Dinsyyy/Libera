# Libera - Sistem Manajemen Perpustakaan Modern

[![Laravel v10.x](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React v18.x](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)

Libera adalah sistem manajemen perpustakaan komprehensif yang dirancang untuk menyederhanakan proses peminjaman dan pengelolaan buku. Aplikasi ini dilengkapi dengan API backend yang kuat yang dibangun dengan Laravel dan aplikasi web frontend yang ramah pengguna yang dibangun dengan React.

## Daftar Isi
- [Fitur](#fitur)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Panduan Instalasi](#panduan-instalasi)
  - [Prasyarat](#prasyarat)
  - [1. Pengaturan Backend (Laravel)](#1-pengaturan-backend-laravel)
  - [2. Pengaturan Frontend (React)](#2-pengaturan-frontend-react)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Kredensial Pengguna Default](#kredensial-pengguna-default)
- [Catatan Penting untuk Pengembangan](#catatan-penting-untuk-pengembangan)
- [Kontribusi](#kontribusi)

## Fitur

Libera menawarkan serangkaian fitur untuk pengguna dan administrator:

### Fitur Pengguna
- **Manajemen Pengguna:** Registrasi dan otentikasi pengguna yang aman.
- **Katalog Buku:** Jelajahi dan cari buku yang tersedia dengan mudah.
- **Sistem Peminjaman & Pengembalian:** Proses peminjaman dan pengembalian buku yang sederhana dan efisien.
- **Pratinjau Buku:** Lihat pratinjau sinopsis buku dalam format seperti buku.
- **Pelacak Progres Membaca:** Catat progres membaca Anda (halaman saat ini, status) untuk setiap buku.
- **Ulasan & Penilaian:** Beri peringkat dan tulis ulasan untuk buku.
- **Papan Peringkat Pembaca:** Lihat peringkat pengguna berdasarkan total halaman yang dibaca.
- **Pelacak Sumbangan Buku:** Ajukan dan lacak status buku yang Anda sumbangkan.
- **Denda (Frontend):** Lihat detail denda untuk buku yang dikembalikan terlambat.
- **Aktivitas Terbaru:** Lacak aktivitas Anda baru-baru ini di dasbor.

### Fitur Admin
- **Dasbor Admin:** Dasbor yang kuat untuk pustakawan mengelola buku, pengguna, dan transaksi.
- **Log Aktivitas Admin:** Lihat aktivitas sistem terbaru seperti pengguna baru, buku baru, dan transaksi.

## Teknologi yang Digunakan

### Backend (Laravel)
- **Laravel 10.x:** Framework PHP untuk API RESTful.
- **MySQL/SQLite:** Sistem manajemen basis data.
- **Laravel Sanctum:** Otentikasi API ringan.
- **Laravel Notifications:** Untuk notifikasi pengguna.
- **Carbon:** Ekstensi API PHP untuk tanggal dan waktu.

### Frontend (React)
- **React 18.x:** Library JavaScript untuk membangun antarmuka pengguna.
- **Vite:** Build tool untuk pengembangan frontend yang cepat.
- **React Router DOM:** Untuk navigasi aplikasi.
- **Axios:** Klien HTTP berbasis janji untuk permintaan API.
- **React Icons:** Koleksi ikon yang dapat disesuaikan.
- **Recharts:** Pustaka diagram yang dapat disusun ulang untuk visualisasi data (untuk admin dashboard).

## Struktur Proyek

Proyek ini diatur dalam dua direktori utama:

- `/backend`: Berisi API backend berbasis Laravel.
- `/frontend`: Berisi aplikasi frontend berbasis React.

## Panduan Instalasi

Untuk menjalankan proyek Libera di mesin lokal Anda, ikuti langkah-langkah di bawah ini.

### Prasyarat
- [PHP](https://www.php.net/downloads.php) >= 8.1
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) >= 18.x
- [NPM](https://www.npmjs.com/) atau [Yarn](https://yarnpkg.com/)

### 1. Pengaturan Backend (Laravel)

Pertama, siapkan API backend:

```bash
# Navigasi ke direktori backend
cd backend

# Instal dependensi PHP
composer install

# Buat salinan file .env (jika belum ada)
cp .env.example .env

# Edit file .env Anda:
# - Konfigurasi koneksi database Anda (misalnya, MySQL atau SQLite).
#   Untuk SQLite, Anda dapat membuat file database.sqlite kosong di folder database/
#   dan mengatur DB_CONNECTION=sqlite di .env.
# - Pastikan APP_URL diatur dengan benar (misalnya, http://127.0.0.1:8000)

# Generate kunci aplikasi
php artisan key:generate

# Jalankan migrasi basis data dan isi basis data dengan data sampel
# PERINGATAN: Perintah ini akan MENGHAPUS SEMUA DATA yang ada di database Anda
# dan mengisinya dengan data sampel baru.
php artisan migrate:fresh --seed
```

### 2. Pengaturan Frontend (React)

Selanjutnya, siapkan aplikasi frontend:

```bash
# Navigasi ke direktori frontend dari root proyek
cd frontend

# Instal dependensi JavaScript
npm install
```

## Menjalankan Aplikasi

### Backend

Untuk memulai server pengembangan Laravel, jalankan perintah berikut dari direktori `/backend`:

```bash
php artisan serve
```

API akan tersedia di `http://127.0.0.1:8000`.

### Frontend

Untuk memulai server pengembangan React, jalankan perintah berikut dari direktori `/frontend`:

```bash
npm run dev
```

Aplikasi frontend akan tersedia di `http://localhost:5173`. Pastikan server backend berjalan sebelum mengakses frontend.

## Kredensial Pengguna Default

Setelah menjalankan `php artisan migrate:fresh --seed`, Anda akan memiliki beberapa pengguna yang telah diisi:

- **Admin:**
  - Email: `admin@libera.com`
  - Password: `password`
- **Pengguna Biasa:**
  - Email: `user@libera.com`
  - Password: `password`
- **20 Pengguna Biasa Tambahan:** Dibuat dengan data acak, semua dengan password `password`.

## Catatan Penting untuk Pengembangan

### Kebijakan Keamanan Konten (CSP)
Selama pengembangan, header Kebijakan Keamanan Konten (CSP) yang sangat permisif telah diterapkan melalui middleware backend untuk mengatasi masalah pemblokiran skrip/stylesheet. Ini **TIDAK AMAN untuk produksi**. Untuk lingkungan produksi, CSP harus dikonfigurasi secara ketat.

### Masalah Ikon `react-icons/lu`
Jika Anda mengalami error seperti `Uncaught SyntaxError: The requested module ... does not provide an export named 'LuCheckCircle'`, ini menunjukkan masalah dengan paket `react-icons` Anda. Coba langkah-langkah berikut:
1. Navigasi ke direktori `frontend`.
2. Hapus `node_modules` dan `package-lock.json` (atau `yarn.lock`).
3. Jalankan `npm install` atau `yarn install` lagi.
4. Jika masalah berlanjut, coba `npm install react-icons@latest` atau `yarn add react-icons@latest`.

## Kontribusi

Kami menyambut kontribusi pada proyek Libera. Jangan ragu untuk melakukan fork repositori, membuat perubahan Anda, dan mengirimkan pull request.
