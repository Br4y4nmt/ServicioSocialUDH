import React, { useEffect, useState, useRef } from 'react';
import './Header.css';
import { FaBars } from 'react-icons/fa';
import PdfIcon from "../../../hooks/componentes/PdfIcon";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../UserContext';

function Header({ onToggleSidebar }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef();
  const rolUsuario = localStorage.getItem('id_rol');
  const navigate = useNavigate();
  const { logout } = useUser();

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
  }, []);

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
    try {
      logout();
    } catch (e) {
      localStorage.removeItem('user');
    }

    const keysToRemove = [
      'token',
      'id_usuario',
      'id_rol',
      'nombre_usuario',
      'foto_perfil',
      'correo_institucional',
      'codigo_estudiante',
      'programa_academico_id',
      'showBienvenida',
      'id_docente'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));

    window.location.href = '/login';
  };

  const handlePerfilClick = () => {
    setMenuAbierto(false);

    const rol_id = localStorage.getItem('id_rol');
    const routesByRol = {
      'alumno': '/mi-perfil',
      'docente supervisor': '/mi-perfil-docente',
    };

    const route = routesByRol[rol_id];
    if (!route) {
      alert('Rol no autorizado o desconocido.');
      return;
    }
    navigate(route);
  };

  const enlaceGuia =
    rolUsuario === 'docente supervisor'
      ? 'https://drive.google.com/file/d/1b1ecTv9eRWmvgt-q82q9rbee-z03Wkwe/view?usp=sharing'
      : 'https://drive.google.com/file/d/1tjKS3sYvq47OTkOm7uPUU3mfV_F_O3m9/view?usp=sharing';

  return (
    <header className="custom-header">
      <div className="left-section">
        <FaBars className="menu-icon" onClick={onToggleSidebar} />
      </div>

      <div className="right-section" ref={menuRef}>
        {rolUsuario !== 'gestor-udh' && (
          <div className="guia-btn-container">
            <span className="ver-float-label">¡Ver!</span>

            <button
              className="guia-btn"
              onClick={() => window.open(enlaceGuia, '_blank')}
            >
              <span className="pdf-icon">
                <PdfIcon />
              </span>

              <span className="guia-label">Guía</span>
            </button>
          </div>
        )}

        <div className="profile-container">
          <img
            src={fotoPerfil || 'https://via.placeholder.com/40'}
            alt="Usuario"
            className="profile-icon"
            onClick={() => {
              setMenuAbierto((prev) => !prev);
            }}
          />

          {menuAbierto && (
            <div className="dropdown-menu-fixed">
              {rolUsuario !== 'gestor-udh' && (
                <div className="dropdown-item" onClick={handlePerfilClick}>
                  Perfil
                </div>
              )}

              <div className="dropdown-item" onClick={handleLogout}>
                Cerrar sesión
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
