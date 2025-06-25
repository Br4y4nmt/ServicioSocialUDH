import React, { useEffect, useState } from 'react';
import './SidebarProgramaAcademico.css'; // Crea este nuevo CSS con clases únicas

function SidebarProgramaAcademico({ collapsed, onToggleSidebar, activeSection, setActiveSection }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    const nombre = localStorage.getItem('nombre_usuario');

    if (foto) setFotoPerfil(foto);
    if (nombre) setNombreUsuario(nombre);
  }, []);

  return (
    <aside className={`sidebar-pa-box ${collapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-pa-toggle-btn" onClick={onToggleSidebar}>
        <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      {!collapsed && (
        <>
          <div className="sidebar-pa-header">
            <img 
              src={fotoPerfil || 'https://via.placeholder.com/100'} 
              alt="Foto de perfil" 
              className="sidebar-pa-profile-pic" 
              referrerPolicy="no-referrer"
            />
            <h4 className="sidebar-pa-nombre">{nombreUsuario}</h4>
            <span className="sidebar-pa-rol">Programa Académico</span>
          </div>

         <nav className="sidebar-pa-nav">
        <ul>
          <li 
            className={activeSection === 'docentes' ? 'sidebar-pa-selected' : ''} 
            onClick={() => setActiveSection('docentes')}
          >
            <i className="fas fa-chalkboard-teacher"></i> Docentes
          </li>

          <li
            className={activeSection === 'informes-finales' ? 'sidebar-pa-selected' : ''}
            onClick={() => setActiveSection('informes-finales')}
          >
            <i className="fas fa-file-alt"></i> Informes Finales
          </li>
        </ul>
      </nav>
        </>
      )}
    </aside>
  );
}

export default SidebarProgramaAcademico;
