import React, { useEffect, useState } from 'react';
import './SidebarAlumno.css';
import ReportIcon from "../../../hooks/componentes/Icons/ReportIcon";
import InformesFinalesIcon from "../../../hooks/componentes/Icons/InformesFinalesIcon";
import PlanIcon from "../../../hooks/componentes/Icons/PlanIcon";
import ArrowLeftIcon from "../../../hooks/componentes/Icons/ArrowLeftIcon";
import { useNavigate, useLocation } from 'react-router-dom';

function SidebarDocente({
  collapsed,
  nombre,
  onToggleSidebar,
  activeSection,
  setActiveSection,
}) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [openMenus, setOpenMenus] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const isRevision = location.pathname === '/dashboard-docente';
  const isConformidad = location.pathname === '/revision-documento-docente';
  const isSeguimiento = location.pathname === '/seguimiento-docente';
  const isSolicitudesInformes = location.pathname === '/solicitudes-informes-finales';

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
  }, []);

  const toggleMenu = (index) => {
    setOpenMenus((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  useEffect(() => {
    if (['revision', 'conformidad'].includes(activeSection)) {
      setOpenMenus([0]);
    } else if (['seguimiento'].includes(activeSection)) {
      setOpenMenus([1]);
    } else if (['informes'].includes(activeSection)) {
      setOpenMenus([2]);
    } else {
      setOpenMenus([]);
    }
  }, [activeSection]);

  const isActiveMenu = (index) => {
    const map = {
      0: ['revision', 'conformidad'],
      1: ['seguimiento'],
      2: ['informes']
    };
    // Only the menu that contains the current activeSection is highlighted
    return map[index]?.includes(activeSection);
  };

  return (
    <aside
      className={`sidebar-alumno ${collapsed ? 'collapsed' : ''} ${
        !collapsed && window.innerWidth <= 768 ? 'show' : ''
      }`}
    >
      <button
        type="button"
        className="toggle-btn"
        onClick={onToggleSidebar}
      >
        <ArrowLeftIcon/>
      </button>

      {!collapsed && (
        <>
          <div className="sidebar-header">
            <img
              src={fotoPerfil || 'https://via.placeholder.com/100'}
              alt="Foto de perfil"
              className="profile-pic"
            />
            <h4 className="nombre">{nombre}</h4>
            <span className="rol">Supervisor</span>
          </div>

          <nav className="sidebar-nav">
            <ul>

              {/* REVISIÓN */}
              <li className="menu-item">
                <button
                  onClick={() => {
                    setActiveSection('revision');
                    toggleMenu(0);
                  }}
                  className={`menu-title ${isActiveMenu(0) ? 'menu-title--active' : ''}`}
                >
                  <PlanIcon size={32}/>
                  Revisión de Planes
                  <i className={`fas ${openMenus.includes(0) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(0) ? 'open' : ''}`}>
                  <li
                    className={isRevision ? 'selected' : ''}
                    onClick={() => navigate('/dashboard-docente')}
                  >
                    Solicitudes de supervisión
                  </li>
                  <li
                    className={isConformidad ? 'selected' : ''}
                    onClick={() => navigate('/revision-documento-docente')}
                  >
                    Revisión del plan
                  </li>
                </ul>
              </li>

              {/* SEGUIMIENTO */}
              <li className="menu-item">
                <button
                  onClick={() => {
                    setActiveSection('seguimiento');
                    toggleMenu(1);
                  }}
                  className={`menu-title ${isActiveMenu(1) ? 'menu-title--active' : ''}`}
                >
                  <InformesFinalesIcon size={32}/>
                  Seguimiento
                  <i className={`fas ${openMenus.includes(1) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(1) ? 'open' : ''}`}>
                  <li
                    className={isSeguimiento ? 'selected' : ''}
                    onClick={() => navigate('/seguimiento-docente')}
                  >
                    Seguimiento Servicio social
                  </li>
                </ul>
              </li>

              {/* INFORMES */}
              <li className="menu-item">
                <button
                  onClick={() => {
                    setActiveSection('informes');
                    toggleMenu(2);
                  }}
                  className={`menu-title ${isActiveMenu(2) ? 'menu-title--active' : ''}`}
                >
                  <ReportIcon size={32}/>
                  Informes Finales
                  <i className={`fas ${openMenus.includes(2) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(2) ? 'open' : ''}`}>
                  <li
                    className={isSolicitudesInformes ? 'selected' : ''}
                    onClick={() => navigate('/solicitudes-informes-finales')}
                  >
                    Solicitudes Informes Finales
                  </li>
                </ul>
              </li>

            </ul>
          </nav>
        </>
      )}
    </aside>
  );
}

export default SidebarDocente;