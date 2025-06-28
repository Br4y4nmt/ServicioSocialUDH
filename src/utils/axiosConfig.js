// src/axiosConfig.js
import axios from 'axios';
import Swal from 'sweetalert2';

// Configura la URL base si usas una API externa
axios.defaults.baseURL = 'http://localhost:5000'; // <-- adapta si es necesario

// Interceptor para respuestas
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
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
