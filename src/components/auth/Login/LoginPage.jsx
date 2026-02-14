/* global google */
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../../UserContext';
import React, { useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  alertError,
} from "../../../hooks/alerts/alertas";
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

      const routesByRol = {
        'alumno': '/dashboard-alumno',
        'docente supervisor': '/dashboard-docente',
        'gestor-udh': '/dashboard-gestor',
        'programa-academico': '/dashboard-programa-academico',
      };

      const route = routesByRol[rol];
      if (!route) {
        await alertError('Rol no válido', 'Tu rol no tiene una ruta válida en la aplicación.');
      } else {
        if (rol === 'alumno' || rol === 'docente supervisor') {
          localStorage.setItem('showBienvenida', 'true');
        }
        navigate(route, { replace: true });
      }

    } catch (error) {
      console.error('Error en login Google:', error.response ? error.response.data : error.message);

      if (window.google?.accounts?.id) {
        google.accounts.id.cancel();
        google.accounts.id.disableAutoSelect();
      }

      // Si no hay respuesta, es un error de red / servidor caído
      if (!error.response) {
        await alertError('Servidor no disponible', 'No se pudo conectar al servidor. Intenta nuevamente más tarde.');
      } else if (error.response.status === 404) {
        // Usuario no registrado según backend
        await alertError('Usuario no registrado', error.response.data?.message || 'Tu cuenta no está registrada.');
      } else {
        // Otros errores recibidos desde el backend
        await alertError('Error de inicio de sesión', error.response.data?.message || 'Ocurrió un error al iniciar sesión.');
      }
    } finally {
      if (!unmounted.current) {
        setLoadingGoogle(false); 
      }
       isProcessing.current = false;
    }
}, [login, navigate]);

useEffect(() => {
  const SDK_SRC = 'https://accounts.google.com/gsi/client';

  const initGoogleButton = () => {
    if (window.google && window.google.accounts && window.google.accounts.id && !window._googleSignInInitialized) {
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
      window._googleSignInInitialized = true;
    }
  };

  const existing = document.querySelector(`script[src="${SDK_SRC}"]`);

  if (!window.google?.accounts?.id) {
    if (existing) {
      if (existing.getAttribute('data-gsi-loaded') === 'true') {
        initGoogleButton();
      } else {
        const onLoad = () => initGoogleButton();
        existing.addEventListener('load', onLoad, { once: true });
      }
    } else {
      const script = document.createElement('script');
      script.src = SDK_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        script.setAttribute('data-gsi-loaded', 'true');
        initGoogleButton();
      };
      document.body.appendChild(script);
    }
  } else {
    initGoogleButton();
  }

  return () => {
  };
}, [handleCredentialResponse, GOOGLE_CLIENT_ID]);


  return (
  <div className="login-page">
    <div className="image-container">
      <picture>
        <source srcSet="/SERVICIOSOCIAL1.webp" type="image/webp" />
        <img
          src="/SERVICIOSOCIAL1.png"
          alt="Fondo UDH Labor Social"
          width="1200"
          height="800"
          loading="lazy"
        />
      </picture>
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
