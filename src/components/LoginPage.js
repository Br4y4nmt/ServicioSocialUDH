/* global google */

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import Swal from 'sweetalert2';
import React, { useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const GOOGLE_CLIENT_ID = '497036889492-inreil77morni6uqbdtmesjurnj4kefs.apps.googleusercontent.com';

  const handleCredentialResponse = useCallback(async (response) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
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
      // Verificar si el usuario tiene el rol de docente supervisor
    if (rol === 'docente supervisor') {
      // Guardar el id_docente en localStorage solo si el rol es docente supervisor
      localStorage.setItem('id_docente', id_docente);
    }

      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: `Hola ${nombre_completo}, acceso exitoso.`,
        confirmButtonColor: '#28a745',
        timer: 2000,
        showConfirmButton: false,
      });


      localStorage.setItem('id_usuario', id_usuario);
      localStorage.setItem('id_rol', rol);
      localStorage.setItem('nombre_usuario', nombre_completo);
      localStorage.setItem('foto_perfil', foto_perfil);
      localStorage.setItem('correo_institucional', email);
      localStorage.setItem('codigo_estudiante', codigo_estudiante);
      localStorage.setItem('programa_academico_id', programa_academico_id);
      console.log('Token obtenido:', token);
      setTimeout(() => {
        
        if (rol === 'alumno') {
          navigate('/dashboard-alumno', { replace: true });
        } else if (rol === 'docente supervisor') {
          navigate('/dashboard-docente', { replace: true });
        } else if (rol === 'gestor-udh') {
          navigate('/dashboard-gestor', { replace: true });
        } else if (rol === 'programa-academico') {
          navigate('/dashboard-programa-academico', { replace: true });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Rol no válido',
            confirmButtonColor: '#d33',
            timer: 2500,
          });
        }
      }, 500); // Delay breve
    } catch (error) {
      console.error('❌ Error en login Google:', error.response ? error.response.data : error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión con Google',
        text: error.response?.data?.message || 'No se pudo iniciar sesión',
        confirmButtonColor: '#d33',
        timer: 2500,
      });
    }
  }, [login, navigate]);

  useEffect(() => {
    const loadGoogleSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && !window.__gsi_initialized__) {
          google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          window.__gsi_initialized__ = true;

          google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              shape: 'pill',
              text: 'continue_with',
              width: 300,
            }
          );
        }
      };
      document.body.appendChild(script);
    };

    if (!window.google?.accounts?.id) {
      loadGoogleSDK();
    }
  }, [handleCredentialResponse]);

  return (
    <div className="login-page">
      <div className="image-container">
        <img src="/SERVICIOSOCIAL1.png" alt="Fondo UDHLabor Social" />
      </div>
      <div className="form-container">
        <div className="login-card">
          <h2>Iniciar sesión</h2>
          <p className="register-text">
            ¿Aún no tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
          <p className="subtitle">Inicia sesión con tu cuenta de Google</p>
          <div id="google-signin-button"></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
