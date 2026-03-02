import React, { useEffect, useState } from 'react';
import './SidebarDocente.css';
import ReportIcon from "../../../hooks/componentes/Icons/ReportIcon";
import InformesFinalesIcon from "../../../hooks/componentes/Icons/InformesFinalesIcon";
import StudentMonitoringIcon from "../../../hooks/componentes/Icons/StudentMonitoringIcon";
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
            <span className="rol-docente">Supervisor</span>
          </div>

          <nav className="sidebar-nav-docente">
            <ul>
              <li className="menu-item-docente">
                <button
                  onClick={() => {
                    setActiveSection('revision');
                    toggleMenu(0);
                  }}
                  className={`menu-title-docente ${
                    openMenu === 0 ? 'menu-title-docente--active' : ''
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
                    } menu-title-docente__chevron`}
                  ></i>
                </button>

                {openMenu === 0 && (
                  <ul className="submenu-docente">
                    <li
                      className={isRevision ? 'selected-docente' : ''}
                      onClick={() => navigate('/dashboard-docente')}
                    >
                      Solicitudes de supervisión
                    </li>
                    <li
                      className={isConformidad ? 'selected-docente' : ''}
                      onClick={() => navigate('/revision-documento-docente')}
                    >
                      Revisión del plan
                    </li>
                  </ul>
                )}
              </li>

              <li className="menu-item-docente">
                <button
                  onClick={() => {
                    setActiveSection('seguimiento');
                    toggleMenu(1);
                  }}
                  className={`menu-title-docente ${
                    openMenu === 1 ? 'menu-title-docente--active' : ''
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
                    } menu-title-docente__chevron`}
                  ></i>
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

              <li className="menu-item-docente">
                <button
                  onClick={() => {
                    setActiveSection('informes');
                    toggleMenu(2);
                  }}
                  className={`menu-title-docente ${
                    openMenu === 2 ? 'menu-title-docente--active' : ''
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
                    } menu-title-docente__chevron`}
                  ></i>
                </button>

                {openMenu === 2 && (
                  <ul className="submenu-docente">
                    <li
                      className={isSolicitudesInformes ? 'selected-docente' : ''}
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
