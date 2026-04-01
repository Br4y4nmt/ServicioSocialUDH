import React, { useEffect, useState } from 'react';
import './SidebarAlumno.css';
import ReportIcon from "../../../hooks/componentes/Icons/ReportIcon";
import InformesFinalesIcon from "../../../hooks/componentes/Icons/InformesFinalesIcon";
import StudentMonitoringIcon from "../../../hooks/componentes/Icons/StudentMonitoringIcon";
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
  const [openMenu, setOpenMenu] = useState(null);

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
    setOpenMenu(openMenu === index ? null : index);
  };

  useEffect(() => {
    if (['revision', 'conformidad'].includes(activeSection)) {
      setOpenMenu(0);
    } else if (['seguimiento'].includes(activeSection)) {
      setOpenMenu(1);
    } else if (['informes'].includes(activeSection)) {
      setOpenMenu(2);
    } else {
      setOpenMenu(null);
    }
  }, [activeSection]);

  return (
    <aside
      className={`sidebar-alumno ${collapsed ? 'collapsed' : ''} ${
        !collapsed && window.innerWidth <= 768 ? 'show' : ''
      }`}
    >
      <button className="toggle-btn" onClick={onToggleSidebar}>
        <ArrowLeftIcon/>
      </button>

      {!collapsed && (
        <>
          <div className="sidebar-header">
            <img
              src={fotoPerfil || 'https://via.placeholder.com/100'}
              alt="Foto de perfil"
              className="profile-pic"
              referrerPolicy="no-referrer"
            />
            <h4 className="nombre">{nombre}</h4>
            <span className="rol">Supervisor</span>
          </div>

          <nav className="sidebar-nav">
            <ul>
              <li className="menu-item">
                <button
                  onClick={() => {
                    setActiveSection('revision');
                    toggleMenu(0);
                  }}
                  className={`menu-title ${
                    openMenu === 0 ? 'menu-title--active' : ''
                  }`}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <ReportIcon size={32} color="#2e9e7f" />
                    <span>Revisión de Planes</span>
                  </div>

                  <i
                    className={`fas ${
                      openMenu === 0 ? 'fa-chevron-up' : 'fa-chevron-down'
                    }`}
                  ></i>
                </button>

                {openMenu === 0 && (
                  <ul className="submenu">
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
                )}
              </li>

              <li className="menu-item">
                <button
                  onClick={() => {
                    setActiveSection('seguimiento');
                    toggleMenu(1);
                  }}
                  className={`menu-title ${
                    openMenu === 1 ? 'menu-title--active' : ''
                  }`}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <StudentMonitoringIcon size={32} color="#2e9e7f" />
                    <span>Seguimiento</span>
                  </div>

                  <i
                    className={`fas ${
                      openMenu === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                    }`}
                  ></i>
                </button>

                {openMenu === 1 && (
                  <ul className="submenu">
                    <li
                      className={isSeguimiento ? 'selected' : ''}
                      onClick={() => navigate('/seguimiento-docente')}
                    >
                      Seguimiento Servicio social
                    </li>
                  </ul>
                )}
              </li>

              <li className="menu-item">
                <button
                  onClick={() => {
                    setActiveSection('informes');
                    toggleMenu(2);
                  }}
                  className={`menu-title ${
                    openMenu === 2 ? 'menu-title--active' : ''
                  }`}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <InformesFinalesIcon size={32} color="#2e9e7f" />
                    <span>Informes Finales</span>
                  </div>

                  <i
                    className={`fas ${
                      openMenu === 2 ? 'fa-chevron-up' : 'fa-chevron-down'
                    }`}
                  ></i>
                </button>

                {openMenu === 2 && (
                  <ul className="submenu">
                    <li
                      className={isSolicitudesInformes ? 'selected' : ''}
                      onClick={() => navigate('/solicitudes-informes-finales')}
                    >
                      Solicitudes Informes Finales
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
