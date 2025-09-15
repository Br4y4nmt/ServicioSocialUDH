import React, { useEffect, useState } from 'react';
import './SidebarGestor.css';

function SidebarGestor({ collapsed, onToggleSidebar, activeSection, setActiveSection }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    const nombre = localStorage.getItem('nombre');

    if (foto) setFotoPerfil(foto);
    if (nombre) setNombreUsuario(nombre);
    if (["facultades", "programas", "docentes","seguimiento.trami" , "labores", "lineas", "informes-finales", "estudiantes", "supervisores"].includes(activeSection)) {
      setOpenMenu(0);
    } else {
      setOpenMenu(null);
    }
  }, [activeSection]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  return (
    <aside className={`sidebar-gestor-box ${collapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-gestor-toggle-btn" onClick={onToggleSidebar}>
        <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      {!collapsed && (
        <>
          <div className="sidebar-gestor-header">
            <img 
              src={fotoPerfil || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
              className="sidebar-gestor-profile-pic" 
              referrerPolicy="no-referrer"
            />
            <h4 className="sidebar-gestor-nombre">{nombreUsuario}</h4>
            <span className="sidebar-gestor-rol">Gestor UDH</span>
          </div>

          <nav className="sidebar-gestor-nav">
            <ul>
              <li className="sidebar-gestor-menu-item">
              <button onClick={() => toggleMenu(0)} className="sidebar-gestor-menu-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#2e9e7f" strokeWidth="2" viewBox="0 0 24 24" width="24" height="24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.105c1.527-.878 3.236.83 2.358 2.358a1.724 1.724 0 001.105 2.592c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.105 2.591c.878 1.527-.83 3.236-2.358 2.358a1.724 1.724 0 00-2.592 1.105c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.105c-1.527.878-3.236-.83-2.358-2.358a1.724 1.724 0 00-1.105-2.592c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.105-2.591c-.878-1.527.83-3.236 2.358-2.358a1.724 1.724 0 002.592-1.105z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>

              Gestión Académica
            </span>

            <i className={`fas ${openMenu === 0 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>

                {openMenu === 0 && (
                  <ul className="sidebar-gestor-submenu">
                    <li className={activeSection === 'facultades' ? 'sidebar-gestor-selected' : ''} onClick={() => setActiveSection('facultades')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M3 11l9-6 9 6v2H3v-2z" /><path d="M21 20H3v-6h18v6z" />
                  </svg>
                  Facultades
                </span>
              </li>
                     <li className={activeSection === 'programas' ? 'sidebar-gestor-selected' : ''} onClick={() => setActiveSection('programas')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 7H20" />
                      <path d="M20 22V2" />
                    </svg>
                    Pro. Académicos
                  </span>
                </li>
               
                      <li className={activeSection === 'docentes' ? 'sidebar-gestor-selected' : ''} onClick={() => setActiveSection('docentes')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M5.5 21a8.38 8.38 0 0113 0" />
                    </svg>
                    Docentes
                  </span>
                </li>
                     <li className={activeSection === 'lineas' ? 'sidebar-gestor-selected' : ''} onClick={() => setActiveSection('lineas')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Líneas de Acción
                  </span>
                </li>

                 <li className={activeSection === 'labores' ? 'sidebar-gestor-selected' : ''} onClick={() => setActiveSection('labores')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M3 15c1.5 2 5.5 2 7 0l2-2 2 2c1.5 2 5.5 2 7 0" />
                      <path d="M12 8.5l-1.1-1.1a3 3 0 10-4.2 4.2L12 17l5.3-5.4a3 3 0 00-4.2-4.2L12 8.5z" />
                    </svg>
                    Servicios Sociales
                  </span>
                </li>
                 <li
                className={activeSection === 'estudiantes' ? 'sidebar-gestor-selected' : ''}
                onClick={() => setActiveSection('estudiantes')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#2e9e7f" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M22 12l-10 6L2 12l10-6 10 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c0 .6.4 1.2 1 1.5l5 2.5 5-2.5c.6-.3 1-.9 1-1.5v-5" />
                  </svg>
                  Estudiantes
                </span>
              </li>
                    <li className={activeSection === 'informes-finales' ? 'sidebar-gestor-selected' : ''} onClick={() => setActiveSection('informes-finales')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M7 8h10M7 12h4" />
                      <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                    </svg>
                    Informes Finales
                  </span>
                </li>
                <li
                    className={activeSection === 'supervisores' ? 'sidebar-gestor-selected' : ''}
                    onClick={() => setActiveSection('supervisores')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" stroke="#2e9e7f" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M5.5 21a8.38 8.38 0 0113 0" />
                        <path d="M16.5 11.5l1.5 1.5 3-3" /> 
                      </svg>
                      Desig. de supervisor
                    </span>
                  </li>
                    <li
                    className={activeSection === 'seguimiento.trami' ? 'sidebar-gestor-selected' : ''}
                    onClick={() => setActiveSection('seguimiento.trami')}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="#2e9e7f" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M9 12l2 2l4-4" />
                        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" />
                      </svg>
                      Seguimiento de Trámite
                    </span>
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

export default SidebarGestor;
