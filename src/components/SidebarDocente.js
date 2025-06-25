import React, { useEffect, useState } from 'react';
import './SidebarDocente.css';
import { useNavigate, useLocation } from 'react-router-dom';


function SidebarDocente({ collapsed, nombre, onToggleSidebar, activeSection, setActiveSection }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Ejemplo para marcar activo según la ruta
  const isRevision = location.pathname === '/dashboard-docente';
  const isConformidad = location.pathname === '/revision-documento-docente';
  const isSeguimiento = location.pathname === '/seguimiento-docente';
  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
  }, []);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };
  useEffect(() => {
    // Si la sección activa está dentro del menú de "Revisión de Planes", abre ese menú (índice 0)
    if (['revision', 'conformidad'].includes(activeSection)) {
      setOpenMenu(0);
    } else if (['seguimiento'].includes(activeSection)) {
      setOpenMenu(1);
    } else {
      setOpenMenu(null);
    }
  }, [activeSection]);
  return (
    <aside className={`sidebar-docente ${collapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn-docente" onClick={onToggleSidebar}>
        <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      {!collapsed && (
        <>
          <div className="sidebar-header-docente">
            <img 
              src={fotoPerfil || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
              className="profile-pic-docente" 
              referrerPolicy="no-referrer"
            />
            <h4 className="nombre-docente">{nombre}</h4>
            <span className="rol-docente">Docente</span>
          </div>

          <nav className="sidebar-nav-docente">
            <ul>
              <li className="menu-item-docente">
              <button onClick={() => { setActiveSection('revision'); toggleMenu(0); }} className="menu-title-docente">
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="none" stroke="#2e9e7f" strokeWidth="3.036">
      <path d="M14,4.5H10.5a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2V6.5a2,2,0,0,0-2-2H24"></path>
      <path d="M12,4.5l1.4142-1.4142A2,2,0,0,1,14.8284,2.5H23a1,1,0,0,1,1,1v25l-5-5-5,5V4.5"></path>
      <line x1="14" y1="38" x2="34" y2="38"></line>
      <line x1="24" y1="10" x2="34" y2="10"></line>
      <line x1="24" y1="17" x2="34" y2="17"></line>
      <line x1="24" y1="24" x2="34" y2="24"></line>
      <line x1="14" y1="31" x2="34" y2="31"></line>
    </svg>
    <span>Revisión de Planes</span>
  </div>
</button>
                {openMenu === 0 && (
                  <ul className="submenu-docente">
                    <li 
                          className={isRevision ? 'selected-docente' : ''} 
                          onClick={() => navigate('/dashboard-docente')}
                        >
                          Revisión del plan
                        </li>
                        <li 
                    className={isConformidad ? 'selected-docente' : ''} 
                    onClick={() => navigate('/revision-documento-docente')}
                  >
                    Conformidad de Documento
                  </li>
                  </ul>
                )}
              </li>
              <li className="menu-item-docente">
              <button onClick={() => { setActiveSection('seguimiento'); toggleMenu(1); }} className="menu-title-docente">
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2e9e7f" width="32px" height="32px">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.219 4.219l1.061 1.061M18.719 18.719l1.061 1.061M3 12h1.5M19.5 12H21M4.219 19.781l1.061-1.061M18.719 5.281l1.061-1.061M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
      </svg>
      <span>Seguimiento</span>
    </div>
  </button>
                {openMenu === 1 && (
            <ul className="submenu-docente">
              <li 
            className={isSeguimiento ? 'selected-docente' : ''} 
            onClick={() => navigate('/seguimiento-docente')}
          >
            Seguimiento Servicio social
          </li>
  </ul>
)}

              </li>
            </ul>
          </nav>
        </>
      )}
    </aside>
  );
}

export default SidebarDocente;
