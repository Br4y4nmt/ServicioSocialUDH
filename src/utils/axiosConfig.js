// src/axiosConfig.js
import axios from 'axios';
import Swal from 'sweetalert2';
axios.defaults.baseURL = 'http://localhost:5000';
//axios.defaults.baseURL = 'https://serviciosocialback.sistemasudh.com';

axios.interceptors.response.use(
  response => response,
  error => {
    const requestUrl = error?.config?.url;
    const isGoogleAuth = requestUrl?.includes('/api/auth/google');

    if (error.response && error.response.status === 401 && !isGoogleAuth) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('id_usuario');
        window.location.href = '/login';
      });
    }

    return Promise.reject(error);
  }
);
