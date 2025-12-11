import axios from 'axios';

// 1. Tentukan URL dasar API Back-end Anda
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// 2. Buat "instance" Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 3. Buat "Interceptor"
// Ini adalah fungsi yang akan "mencegat" setiap request SEBELUM dikirim
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Lanjutkan request
  },
  (error) => {
    // Jika ada error saat setting request, tolak
    return Promise.reject(error);
  }
);

// 4. Ekspor instance yang sudah "pintar" ini
export default api;