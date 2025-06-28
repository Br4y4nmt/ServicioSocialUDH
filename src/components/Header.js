// src/components/Header.js
import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Header({ onToggleSidebar }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef();
  const rolUsuario = localStorage.getItem('id_rol');
  const navigate = useNavigate();

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  
  const handlePerfilClick = () => {
    setMenuAbierto(false);
  
   const rol_id = localStorage.getItem('id_rol'); 
  
    if (rol_id === 'alumno') {
      navigate('/mi-perfil');
    } else if (rol_id === 'docente supervisor') {
      navigate('/mi-perfil-docente');
    } else {
      alert('Rol no autorizado o desconocido.');
    }
  };
  const enlaceGuia = rolUsuario === 'docente supervisor'
  ? 'https://drive.google.com/file/d/1b1ecTv9eRWmvgt-q82q9rbee-z03Wkwe/view?usp=sharing' // ← Link para docentes
  : 'https://drive.google.com/file/d/1tjKS3sYvq47OTkOm7uPUU3mfV_F_O3m9/view?usp=sharing'; // ← Link para alumnos

  return (
    <header className="custom-header">
      <div className="left-section">
        <FaBars className="menu-icon" onClick={onToggleSidebar} />
      </div>

      <div className="right-section" ref={menuRef}>
        
     <div className="guia-btn-container">

      <span className="ver-float-label">¡Ver!</span>
      <button className="guia-btn"
       onClick={() => window.open(enlaceGuia, '_blank')}>
       
    <span className="pdf-icon">
  <svg
    width="22"
    height="22"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path fill="#E2E5E7" d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"/>
    <path fill="#B0B7BD" d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"/>
    <polygon fill="#CAD1D8" points="480,224 384,128 480,128"/>
    <path fill="#F15642" d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z"/>
    <g fill="#FFFFFF">
      <path d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48
        c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z
        M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z"/>
      <path d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296
        c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z"/>
      <path d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68h-32.624v26.864
        c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912
        c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z"/>
    </g>
    <path fill="#CAD1D8" d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"/>
  </svg>
</span>
    <span className="guia-label">Guía</span>
  </button>
</div>
        <div className="profile-container">
        <img
            src={fotoPerfil || 'https://via.placeholder.com/40'}
            alt="Usuario"
            className="profile-icon"
            onClick={() => {
              
              setMenuAbierto(prev => !prev);
            }}
          />

            {menuAbierto && (
              <div className="dropdown-menu-fixed">
                <div className="dropdown-item" onClick={handlePerfilClick}>
                Perfil
              </div>
                <div className="dropdown-item" onClick={handleLogout}>Cerrar sesión</div>
              </div>
            )}

        </div>
      </div>
    </header>
  );
}

export default Header;
