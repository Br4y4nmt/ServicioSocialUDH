import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Asegúrate de crear este archivo
import logo from '../images/logo.png'; // Importando el logo

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Revisa tu correo para restablecer la contraseña.');
    } catch (error) {
      setMessage('Hubo un error. Intenta nuevamente.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <img src={logo} alt="Logo Municipalidad Huánuco" className="forgot-password-logo" />
        <h2>Recuperación de Contraseña</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="forgot-form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu correo electrónico"
              className="forgot-form-input"
            />
          </div>
          <button type="submit" className="forgot-btn">Enviar Enlace</button>
        </form>
        {message && <p className="forgot-message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
