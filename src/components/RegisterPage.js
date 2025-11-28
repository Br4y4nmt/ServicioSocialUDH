import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css'; 
import {
  mostrarAlertaCodigoNoPermitido,
  mostrarAlertaWhatsappInvalido,
  mostrarAlertaRegistroExitoso,
  mostrarAlertaServicioUDHNoDisponible,
  mostrarAlertaErrorRegistro,
} from "../hooks/alerts/alertas"; 

function RegisterPage() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [dni, setDni] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [showDni, setShowDni] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

const handleRegister = async (e) => {
  e.preventDefault();

  const anio = codigo.startsWith('120')
    ? parseInt(codigo.substring(1, 5), 10)
    : parseInt(codigo.substring(0, 4), 10);

  if (isNaN(anio) || anio < 2021) {
    await mostrarAlertaCodigoNoPermitido();
    return;
  }

  if (!/^9\d{8}$/.test(whatsapp)) {
    await mostrarAlertaWhatsappInvalido();
    return;
  }

  setIsSubmitting(true);

  try {
    await axios.post('/api/auth/register', {
      email: `${codigo}@udh.edu.pe`,
      dni,
      whatsapp,
      codigo,
    });

    await mostrarAlertaRegistroExitoso();

    setTimeout(() => navigate('/login'), 2000);

  } catch (error) {
    console.error(
      'Error en el registro:',
      error.response ? error.response.data : error.message
    );

    if (error.response?.status === 503) {
      await mostrarAlertaServicioUDHNoDisponible();
    } 
    else {
      await mostrarAlertaErrorRegistro(error.response?.data?.message);
    }

  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="register-page">
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
    <div className="register-card">
      <h2>Regístrate</h2>
      <p className="subtitle">
      ¿Ya tienes una cuenta? <a href="/login" className="login-link">Inicia sesión aquí</a>
    </p>
      <form onSubmit={handleRegister}>
      <div className="form-group">
  <label>Código (10 dígitos)</label>
  <div className="input-group">
    <input
      type="text"
      value={codigo}
      onChange={(e) => {
        const input = e.target.value;
        if (/^\d{0,10}$/.test(input)) setCodigo(input); 
      }}
      maxLength="10"
      placeholder="Código institucional"
      className="input-no-border"
      required
    />
    <span className="input-suffix">@udh.edu.pe</span>
  </div>
</div>

<div className="form-group">
  <label>DNI</label>
  <div style={{ position: 'relative' }}>
    <input
      type={showDni ? 'text' : 'password'}
      value={dni}
      onChange={(e) => {
        const input = e.target.value;
        if (/^\d{0,8}$/.test(input)) setDni(input); 
      }}
      placeholder="Ingrese número DNI"
      className="form-control"
      required
      maxLength="8"
      inputMode="numeric"
      style={{ paddingRight: '2.5rem' }}
    />
    <button
  type="button"
  onClick={() => setShowDni(!showDni)}
  style={{
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    color: '#555', 
  }}
>
  {showDni ? (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.004.014-.007.028-.01.042a9.978 9.978 0 01-19.063 0A.727.727 0 012.458 12z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" stroke="currentColor" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.963 9.963 0 012.543-4.043M6.18 6.18A9.976 9.976 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.963 9.963 0 01-1.857 3.04M3 3l18 18" />
    </svg>
  )}
</button>
  </div>
</div>
  <div className="form-group">
  <label>Número de WhatsApp</label>
  <input
  type="tel"
  value={whatsapp}
  onChange={(e) => {
    const input = e.target.value;
    if (/^\d{0,9}$/.test(input)) setWhatsapp(input); 
  }}
  placeholder="Ingrese su número de WhatsApp"
  className="form-control"
  required
  pattern="9\d{8}"
  inputMode="numeric"
/>
</div>
  <div className="checkbox-group">
  <input type="checkbox" id="terms" required />
  <div className="checkbox-label-wrapper">
    <label htmlFor="terms">
      Acepto las <span className="highlight">condiciones del servicio</span> y las <span className="highlight">políticas de privacidad</span>
    </label>
  </div>
</div>
  <button
  type="submit"
  className="register-button"
  disabled={isSubmitting}
>
  {isSubmitting ? 'Registrando...' : 'REGISTRAR'}
</button>
</form>

    </div>
  </div>
</div>
  );
}

export default RegisterPage;
