import React, { useEffect, useState } from 'react';
import './SidebarAlumno.css';
import DocumentIcon from "../../../hooks/componentes/Icons/DocumentIcon";
import ReportIcon from "../../../hooks/componentes/Icons/ReportIcon";
import ExecutionIcon from "../../../hooks/componentes/Icons/ExecutionIcon";
import PlanIcon from "../../../hooks/componentes/Icons/PlanIcon";
import ArrowLeftIcon from "../../../hooks/componentes/Icons/ArrowLeftIcon";
import { alertInfo } from "../../../hooks/alerts/alertas";

function SidebarAlumno({ 
  collapsed, 
  nombre, 
  onToggleSidebar, 
  activeSection, 
  setActiveSection, 
  estadoPlan, 
  estadoConformidad,
  estadoSolicitudTermino,
  isPerfilIncompleto = false
}) {

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [openMenus, setOpenMenus] = useState([]);

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);

    if (isPerfilIncompleto) {
      setOpenMenus([]);
      return;
    }

    if (['designacion', 'conformidad'].includes(activeSection)) {
      setOpenMenus([0]);
    } else if (activeSection === 'seguimiento') {
      setOpenMenus([1]);
    } else if (['informe', 'informe-final'].includes(activeSection)) {
      setOpenMenus([2]);
    } else if (activeSection === 'reglamento') {
      setOpenMenus([3]);
    } else {
      setOpenMenus([]);
    }
  }, [activeSection, isPerfilIncompleto]);

  const toggleMenu = (index) => {
    if (isPerfilIncompleto) return;
    setOpenMenus((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isActiveMenu = (index) => {
    const map = {
      0: ['designacion', 'conformidad'],
      1: ['seguimiento'],
      2: ['informe-final'],
      3: ['reglamento']
    };

    // Only consider the activeSection mapping for the active highlight.
    return map[index]?.includes(activeSection);
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
            <span className="rol">Estudiante</span>
          </div>

          <nav className="sidebar-nav">
            <ul>

              {/* PLAN */}
              <li className="menu-item">
                <button 
                  onClick={() => toggleMenu(0)} 
                  className={`menu-title ${isActiveMenu(0) ? "menu-title--active" : ""} ${isPerfilIncompleto ? "menu-disabled" : ""}`}
                  disabled={isPerfilIncompleto}
                >
                  <PlanIcon size={32}/>
                  Plan de Servicio Social
                  <i className={`fas ${openMenus.includes(0) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(0) ? "open" : ""}`}>
                  <li
                    className={activeSection === 'designacion' ? 'selected' : ''}
                    onClick={() => {
                      setActiveSection('designacion');
                      if (window.innerWidth <= 768) onToggleSidebar();
                    }}
                  >
                    Designación de supervisor
                  </li>

                  <li
                    className={activeSection === 'conformidad' ? 'selected' : ''}
                    onClick={async () => {
                      if (estadoPlan === 'aceptado') {
                        setActiveSection('conformidad');
                        if (window.innerWidth <= 768) onToggleSidebar();
                      } else {
                        await alertInfo('Solicitud pendiente', 'El docente aún no ha aceptado tu solicitud.');
                      }
                    }}
                  >
                    Conformidad de plan
                  </li>
                </ul>
              </li>

              {/* EJECUCIÓN */}
              <li className="menu-item">
                <button 
                  onClick={() => toggleMenu(1)} 
                  className={`menu-title ${isActiveMenu(1) ? "menu-title--active" : ""} ${isPerfilIncompleto ? "menu-disabled" : ""}`}
                  disabled={isPerfilIncompleto}
                >
                  <ExecutionIcon size={32} />
                  Ejecución
                  <i className={`fas ${openMenus.includes(1) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(1) ? "open" : ""}`}>
                  <li
                    className={activeSection === 'seguimiento' ? 'selected' : ''}
                    onClick={async () => {
                      if (estadoConformidad === 'aceptado') {
                        setActiveSection('seguimiento');
                        if (window.innerWidth <= 768) onToggleSidebar();
                      } else {
                        await alertInfo('Conformidad pendiente', 'Tu asesor aún no ha aprobado la conformidad.');
                      }
                    }}
                  >
                    Seguimiento
                  </li>
                </ul>
              </li>

              {/* INFORME */}
              <li className="menu-item">
                <button 
                  onClick={() => toggleMenu(2)} 
                  className={`menu-title ${isActiveMenu(2) ? "menu-title--active" : ""} ${isPerfilIncompleto ? "menu-disabled" : ""}`}
                  disabled={isPerfilIncompleto}
                >
                  <ReportIcon size={32} />
                  Informe Final
                  <i className={`fas ${openMenus.includes(2) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(2) ? "open" : ""}`}>
                  <li
                    className={activeSection === 'informe-final' ? 'selected' : ''}
                    onClick={async () => {
                      if (estadoSolicitudTermino?.trim().toLowerCase() === 'aprobada') {
                        setActiveSection('informe-final');
                        if (window.innerWidth <= 768) onToggleSidebar();
                      } else {
                        await alertInfo('Acceso restringido', 'No puedes acceder al informe final aún.');
                      }
                    }}
                  >
                    Informe final
                  </li>
                </ul>
              </li>

              {/* DOCUMENTOS */}
              <li className="menu-item">
                <button 
                  onClick={() => toggleMenu(3)} 
                  className={`menu-title ${isActiveMenu(3) ? "menu-title--active" : ""} ${isPerfilIncompleto ? "menu-disabled" : ""}`}
                  disabled={isPerfilIncompleto}
                >
                  <DocumentIcon size={32} />
                  Documentos
                  <i className={`fas ${openMenus.includes(3) ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                <ul className={`submenu ${openMenus.includes(3) ? "open" : ""}`}>
                  <li
                    className={activeSection === 'reglamento' ? 'selected' : ''}
                    onClick={() => {
                      setActiveSection('reglamento');
                      if (window.innerWidth <= 768) onToggleSidebar();
                    }}
                  >
                    Documentos oficiales
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

export default SidebarAlumno;