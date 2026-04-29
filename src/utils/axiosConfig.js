import axios from 'axios';
import Swal from 'sweetalert2';
//axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.baseURL = 'https://serviciosocial.udh.edu.pe';

let isHandlingSessionExpiry = false;

axios.interceptors.response.use(
  response => response,
  error => {
    const requestUrl = error?.config?.url;
    const isGoogleAuth = requestUrl?.includes('/api/auth/google');

    if (error.response && error.response.status === 401 && !isGoogleAuth) {
      if (isHandlingSessionExpiry) {
        return Promise.reject(error);
      }

      isHandlingSessionExpiry = true;
      Swal.fire({
        icon: 'warning',
        iconColor: '#39B49E',
        title: 'Sesion expirada',
        text: 'Tu sesion ha caducado. Por favor, vuelve a iniciar sesion.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#011B4B',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          const btn = Swal.getConfirmButton();

          if (btn) {
            btn.addEventListener('mouseenter', () => {
              btn.style.backgroundColor = '#35a590';
            });

            btn.addEventListener('mouseleave', () => {
              btn.style.backgroundColor = '#011B4B';
            });
          }
        }
      }).then(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('id_usuario');
        window.location.href = '/login';
      }).finally(() => {
        isHandlingSessionExpiry = false;
      });
    }

    return Promise.reject(error);
  }
);
