import React, { useState } from 'react';
import './ImpersonateLogin.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ImpersonateLogin() {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const gestorToken = localStorage.getItem('authToken');

      const res = await axios.post(
        '/api/admin/impersonate-master',
        { email, masterPassword },
        { headers: { Authorization: `Bearer ${gestorToken}` } }
      );

      sessionStorage.setItem('originalToken', gestorToken);
      sessionStorage.setItem('originalNombre', localStorage.getItem('nombre'));
      sessionStorage.setItem('originalFoto', localStorage.getItem('foto_perfil'));

      const userData = {
        token: res.data.token,
        rol: res.data.usuario.rol,
        id: res.data.usuario.id,
        nombreCompleto: res.data.usuario.nombre || 'Usuario impersonado',
        fotoPerfil: res.data.usuario.foto_perfil || '',
        email: res.data.usuario.email,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('id_usuario', res.data.usuario.id);
      localStorage.setItem('id_rol', res.data.usuario.rol);
      localStorage.setItem('nombre', res.data.usuario.nombre || 'Usuario impersonado');
      localStorage.setItem('foto_perfil', res.data.usuario.foto_perfil || '');
      localStorage.setItem('correo_institucional', res.data.usuario.email);

      // ✅ Notificación elegante
      toast.success(`Ahora impersonando a: ${res.data.usuario.email}`, {
        position: 'top-right',
        autoClose: 3000,
      });

      if (res.data.usuario.rol === 'alumno') {
        window.open('/dashboard-alumno', '_blank');
      } else if (res.data.usuario.rol === 'docente supervisor') {
        window.open('/dashboard-docente', '_blank');
      } else if (res.data.usuario.rol === 'gestor-udh') {
        window.open('/dashboard-gestor', '_blank');
      } else if (res.data.usuario.rol === 'programa-academico') {
        window.open('/dashboard-programa-academico', '_blank');
      } else {
        toast.warning('⚠️ Rol no válido en impersonación');
      }
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 403 && msg === 'Clave maestra incorrecta') {
        setError('❌ Clave maestra incorrecta, intenta de nuevo.');
      } else if (status === 404 && msg === 'Usuario no encontrado') {
        setError('⚠️ No existe un usuario con ese correo.');
      } else {
        setError(msg || 'Error al impersonar. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="impersonate-container">
      <h2>Ingresar a una cuenta</h2>
      <form onSubmit={handleSubmit} className="impersonate-form">
        <input
          type="email"
          placeholder="Correo del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Clave maestra"
          value={masterPassword}
          onChange={(e) => setMasterPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <ToastContainer />
    </div>
  );
}

export default ImpersonateLogin;
