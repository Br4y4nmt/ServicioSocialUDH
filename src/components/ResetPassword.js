import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css'; 

// Asegúrate de que la ruta del logo sea la correcta
import logo from '../images/logo.png';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setSuccess('Contraseña restablecida correctamente. Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError('Hubo un error al restablecer la contraseña. Intenta nuevamente.');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        {/* Añadiendo el logo en la parte superior */}
        <img src={logo} alt="Logo" className="reset-password-logo" />
        <h2 className="reset-password-title">Restablecer Contraseña</h2>
        {error && <p className="reset-password-error-message">{error}</p>}
        {success && <p className="reset-password-success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="reset-password-form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="reset-password-form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="reset-password-btn">Restablecer Contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
