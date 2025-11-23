/* global google */
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import Swal from 'sweetalert2';
import React, { useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const isProcessing = useRef(false);
  const unmounted = useRef(false);
  const [loadingGoogle, setLoadingGoogle] = React.useState(false);


  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const handleCredentialResponse = useCallback(async (response) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setLoadingGoogle(true); 

    try {
      const res = await axios.post('/api/auth/google', {
        token: response.credential,
      });

      const {
        token,
        rol,
        id_usuario,
        id_docente,
        nombre_completo,
        foto_perfil,
        codigo_estudiante,
        email,
        programa_academico_id,
      } = res.data;
      console.log('TOKEN JWT del usuario:', token);

      const userData = {
        token,
        rol,
        id: id_usuario,
        nombreCompleto: nombre_completo,
        fotoPerfil: foto_perfil,
        codigoEstudiante: codigo_estudiante,
        email,
        programaAcademicoId: programa_academico_id,
      };

      login(userData);

      if (rol === 'docente supervisor') {
        localStorage.setItem('id_docente', id_docente);
      }

      localStorage.setItem('id_usuario', id_usuario);
      localStorage.setItem('id_rol', rol);
      localStorage.setItem('nombre_usuario', nombre_completo);
      localStorage.setItem('foto_perfil', foto_perfil);
      localStorage.setItem('correo_institucional', email);
      localStorage.setItem('codigo_estudiante', codigo_estudiante);
      localStorage.setItem('programa_academico_id', programa_academico_id);

      if (rol === 'alumno') {
        localStorage.setItem('showBienvenida', 'true');
        navigate('/dashboard-alumno', { replace: true });
      } else if (rol === 'docente supervisor') {
        localStorage.setItem('showBienvenida', 'true');
        navigate('/dashboard-docente', { replace: true });
      } else if (rol === 'gestor-udh') {
        navigate('/dashboard-gestor', { replace: true });
      } else if (rol === 'programa-academico') {
        navigate('/dashboard-programa-academico', { replace: true });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Rol no válido',
          confirmButtonColor: '#d33',
          timer: 2500,
        });
      }

    } catch (error) {
      console.error('Error en login Google:', error.response ? error.response.data : error.message);
      console.log('Mostrando alerta de usuario no registrado');

      if (window.google?.accounts?.id) {
        google.accounts.id.cancel();
        google.accounts.id.disableAutoSelect();
      }

      Swal.fire({
        icon: 'error',
        title: 'Usuario no registrado',
        text: error.response?.data?.message || 'Tu cuenta no está registrada.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar',
        allowOutsideClick: false,
        allowEscapeKey: false
      });

    } finally {
      if (!unmounted.current) {
        setLoadingGoogle(false); 
      }
       isProcessing.current = false;
    }
}, [login, navigate]);

useEffect(() => {
  const loadGoogleSDK = () => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initGoogleButton();
    };
    document.body.appendChild(script);
  };

  const initGoogleButton = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });

      const container = document.getElementById('google-signin-button');
      if (container) {
        container.innerHTML = ''; 
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: 300,
        });
      }
    }
  };


  if (!window.google?.accounts?.id) {
    loadGoogleSDK();
  } else {
    initGoogleButton();
  }
}, [handleCredentialResponse, GOOGLE_CLIENT_ID]);


  return (
  <div className="login-page">
    <div className="image-container">
      <img src="/SERVICIOSOCIAL1.png" alt="Fondo UDH Labor Social" />
    </div>
    <div className="form-container">
      <div className="login-card">
        <h2 className="login-title">Iniciar sesión</h2>


        <p className="register-text">¿Aún no tienes una cuenta?</p>

        <Link to="/register" style={{ textDecoration: 'none' }} className="link-no-style">
          <button className="register-button-login">REGÍSTRATE AQUÍ</button>
        </Link>

        <p className="subtitle-login">Inicia sesión con tu cuenta de Google</p>
        <div style={{ position: 'relative', display: 'inline-block', height: '10px' }}>
          <div
            id="google-signin-button"
            style={{
              opacity: loadingGoogle ? 0.5 : 1,
              pointerEvents: loadingGoogle ? 'none' : 'auto',
              height: '100%'
            }}
          ></div>
          {loadingGoogle && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="spinner-login"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

}

export default LoginPage;
