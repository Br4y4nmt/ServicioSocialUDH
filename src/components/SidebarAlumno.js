import React, { useEffect, useState } from 'react';
import './SidebarAlumno.css';
import DocumentIcon from "../hooks/componentes/Icons/DocumentIcon";
import ReportIcon from "../hooks/componentes/Icons/ReportIcon";
import ExecutionIcon from "../hooks/componentes/Icons/ExecutionIcon";
import PlanIcon from "../hooks/componentes/Icons/PlanIcon";
import {
  mostrarAlertaSolicitudPendiente,
  mostrarAlertaConformidadPendiente,
  mostrarAlertaAccesoRestringidoInformeFinal,
} from "../hooks/alerts/alertas";

function SidebarAlumno({ 
  collapsed, 
  nombre, 
  onToggleSidebar, 
  activeSection, 
  setActiveSection, 
  estadoPlan, 
  estadoConformidad,
  estadoSolicitudTermino 
}) {

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [openMenu, setOpenMenu] = useState(0);
  

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
    if (activeSection === 'designacion' || activeSection === 'conformidad') {
      setOpenMenu(0); 
    } else if (activeSection === 'seguimiento') {
      setOpenMenu(1); 
    } else if (activeSection === 'informe') {
      setOpenMenu(2); 
    } else if (activeSection === 'informe-final') {
      setOpenMenu(2); 
    }
  }, [activeSection]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };
  
 return (
  <aside
    className={`sidebar-alumno 
      ${collapsed ? 'collapsed' : ''} 
      ${!collapsed && window.innerWidth <= 768 ? 'show' : ''}`}
  >
    <button
    type="button"
    className="toggle-btn"
    onClick={onToggleSidebar}
    aria-label={collapsed ? 'Abrir menú lateral' : 'Cerrar menú lateral'}
    aria-expanded={!collapsed}
  >
    <i
      className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}
      aria-hidden="true"
    ></i>
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
          <span className="rol">Estudiante</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className="menu-item">
              <button 
                onClick={() => toggleMenu(0)} 
                className={`menu-title ${openMenu === 0 ? "menu-title--active" : ""}`}
              >
                <PlanIcon size={32} color="#2e9e7f" />
                Plan de Servicio Social
                <i
                  className={`fas ${
                    openMenu === 0 ? 'fa-chevron-up' : 'fa-chevron-down'
                  }`}
                ></i>
              </button>

              {openMenu === 0 && (
                <ul className="submenu">
                  <li
                    className={activeSection === 'designacion' ? 'selected' : ''}
                    onClick={() => {
                      setActiveSection('designacion');
                      if (window.innerWidth <= 768) onToggleSidebar();
                    }}
                  >
                    Designación de Supervisor
                  </li>

                  <li
                    className={activeSection === 'conformidad' ? 'selected' : ''}
                    onClick={async () => {
                      if (estadoPlan === 'aceptado') {
                        setActiveSection('conformidad');
                        if (window.innerWidth <= 768) onToggleSidebar();
                      } else {
                        await mostrarAlertaSolicitudPendiente();
                      }
                    }}
                  >
                    Conformidad de Plan
                  </li>
                </ul>
              )}
            </li>

            <li className="menu-item">
              <button onClick={() => toggleMenu(1)} className={`menu-title ${openMenu === 1 ? "menu-title--active" : ""}`}>
                <ExecutionIcon size={32} color="#2e9e7f" />
                Ejecución
                <i
                  className={`fas ${
                    openMenu === 1 ? 'fa-chevron-up' : 'fa-chevron-down'
                  }`}
                ></i>
              </button>

              {openMenu === 1 && (
                <ul className="submenu">
                  <li
                    className={activeSection === 'seguimiento' ? 'selected' : ''}
                    onClick={async () => {
                      if (estadoConformidad === 'aceptado') {
                        setActiveSection('seguimiento');
                        if (window.innerWidth <= 768) onToggleSidebar();
                      } else {
                        await mostrarAlertaConformidadPendiente();
                      }
                    }}
                  >
                    Seguimiento
                  </li>
                </ul>
              )}
            </li>

            <li className="menu-item">
              <button onClick={() => toggleMenu(2)} className={`menu-title ${openMenu === 2 ? "menu-title--active" : ""}`}>
                <ReportIcon size={32} color="#2e9e7f" />
                Informe Final
                <i
                  className={`fas ${
                    openMenu === 2 ? 'fa-chevron-up' : 'fa-chevron-down'
                  }`}
                ></i>
              </button>

              {openMenu === 2 && (
                <ul className="submenu">
                  <li
                    className={activeSection === 'informe-final' ? 'selected' : ''}
                    onClick={async () => {
                      if (
                        estadoSolicitudTermino
                          ?.trim()
                          .toLowerCase() === 'aprobada'
                      ) {
                        setActiveSection('informe-final');
                        if (window.innerWidth <= 768) onToggleSidebar();
                      } else {
                        await mostrarAlertaAccesoRestringidoInformeFinal();
                      }
                    }}
                  >
                    Informe Final
                  </li>
                </ul>
              )}
            </li>

            <li className="menu-item">
              <button onClick={() => toggleMenu(3)} className={`menu-title ${openMenu === 3 ? "menu-title--active" : ""}`}>
                <DocumentIcon size={32} color="#2e9e7f" />
                Documentos
                <i
                  className={`fas ${
                    openMenu === 3 ? 'fa-chevron-up' : 'fa-chevron-down'
                  }`}
                ></i>
              </button>

              {openMenu === 3 && (
                <ul className="submenu">
                  <li
                    className={activeSection === 'reglamento' ? 'selected' : ''}
                    onClick={() => {
                      setActiveSection('reglamento');
                      if (window.innerWidth <= 768) onToggleSidebar();
                    }}
                  >
                    Reglamento
                  </li>

                  <li
                    className={activeSection === 'plan-trabajo' ? 'selected' : ''}
                    onClick={() => {
                      setActiveSection('plan-trabajo');
                      if (window.innerWidth <= 768) onToggleSidebar();
                    }}
                  >
                    Plan de Trabajo
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

export default SidebarAlumno;
