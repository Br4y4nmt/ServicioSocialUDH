import React, { useEffect, useState } from 'react';
import FacultyIcon from "../../../hooks/componentes/Icons/FacultyIcon";
import AcademicManagementIcon from "../../../hooks/componentes/Icons/AcademicManagementIcon";
import TeacherClipboardIcon from "../../../hooks/componentes/Icons/TeacherClipboardIcon";
import ActionLinesIcon  from "../../../hooks/componentes/Icons/ActionLinesIcon";
import SocialServiceIcon  from "../../../hooks/componentes/Icons/SocialServiceIcon";
import StudentsIcon  from "../../../hooks/componentes/Icons/StudentsIcon";
import ImpersonateIcon  from "../../../hooks/componentes/Icons/ImpersonateIcon";
import DashboardIcon from "../../../hooks/componentes/Icons/DashboardIcon";
import CambioAsesorIcon from "../../../hooks/componentes/Icons/CambioAsesorIcon";
import CambiosTiempoIcon from "../../../hooks/componentes/Icons/CambiosTiempoIcon";
import TrackingCheckIcon  from "../../../hooks/componentes/Icons/TrackingCheckIcon";
import SupervisorCheckIcon  from "../../../hooks/componentes/Icons/SupervisorCheckIcon";
import FinalReportIcon  from "../../../hooks/componentes/Icons/FinalReportIcon";
import ProgramAcademicIcon from "../../../hooks/componentes/Icons/ProgramAcademicIcon";
import './SidebarGestor.css';

function SidebarGestor({ collapsed, onToggleSidebar, activeSection, setActiveSection }) {
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [openMenu, setOpenMenu] = useState(null);

  const isImpersonating = !!sessionStorage.getItem('originalToken');

  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    const nombre = localStorage.getItem('nombre');

    if (foto) setFotoPerfil(foto);
    if (nombre) setNombreUsuario(nombre);
    if ([
      "facultades",
      "programas",
      "docentes",
      "cambio-asesor",
      "cambios-tiempo",
      "dasborasd",
      "impersonate",
      "seguimiento.trami",
      "labores",
      "lineas",
      "informes-finales",
      "estudiantes",
      "supervisores",
      "estudiantes-concluidos"
    ].includes(activeSection)) {
      setOpenMenu(0);
    } else {
      setOpenMenu(null);
    }
  }, [activeSection]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const salirDeImpersonacion = () => {
    const originalToken = sessionStorage.getItem('originalToken');
    if (originalToken) {
      localStorage.setItem('authToken', originalToken);
      sessionStorage.removeItem('originalToken');
      window.location.href = '/';
    } else {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
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

            {isImpersonating && (
              <button
                className="sidebar-gestor-impersonate-exit"
                onClick={salirDeImpersonacion}
              >
                Salir de impersonación
              </button>
            )}
          </div>

          <nav className="sidebar-gestor-nav">
            <ul>
              <li className="sidebar-gestor-menu-item">
                <button onClick={() => toggleMenu(0)} className="sidebar-gestor-menu-title">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AcademicManagementIcon size={28} color="#2e9e7f" />
                    Gestión Académica
                  </span>

                  <i className={`fas ${openMenu === 0 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>

                {openMenu === 0 && (
                  <ul className="sidebar-gestor-submenu">
                    <li
                      className={
                        activeSection === "dasborasd"
                          ? "sidebar-gestor-selected sidebar-gestor-menu-simple"
                          : "sidebar-gestor-menu-simple"
                      }
                      onClick={() => setActiveSection("dasborasd")}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <DashboardIcon size={20} color="#2e9e7f" />
                        Dashboard
                      </span>
                    </li>
                    <li
                      className={activeSection === 'informes-finales' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('informes-finales')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FinalReportIcon size={18} color="#2e9e7f" />
                        Informes Finales
                      </span>
                    </li>
                    <li
                      className={activeSection === 'estudiantes-concluidos' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('estudiantes-concluidos')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SupervisorCheckIcon size={18} color="#2e9e7f" />
                        Estudiantes concluidos
                      </span>
                    </li>
                    <li
                      className={activeSection === 'facultades' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('facultades')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FacultyIcon size={24} color="#2e9e7f" />
                        Facultades
                      </span>
                    </li>
                    <li
                      className={activeSection === 'programas' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('programas')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ProgramAcademicIcon size={22} color="#2e9e7f" />
                        Pro. Académicos
                      </span>
                    </li>
                    <li
                      className={activeSection === 'docentes' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('docentes')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TeacherClipboardIcon size={22} color="#2e9e7f" />
                        Docentes
                      </span>
                    </li>
                    <li
                      className={activeSection === 'lineas' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('lineas')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ActionLinesIcon size={20} color="#2e9e7f" />
                        Líneas de Acción
                      </span>
                    </li>
                    <li
                      className={activeSection === 'labores' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('labores')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SocialServiceIcon size={18} color="#2e9e7f" />
                        Servicios Sociales
                      </span>
                    </li>
                    <li
                      className={activeSection === 'estudiantes' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('estudiantes')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <StudentsIcon size={18} color="#2e9e7f" />
                        Estudiantes
                      </span>
                    </li>

                    <li
                      className={activeSection === 'supervisores' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('supervisores')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SupervisorCheckIcon size={18} color="#2e9e7f" />
                        Desig. de supervisor
                      </span>
                    </li>
                    <li
                      className={activeSection === 'seguimiento.trami' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('seguimiento.trami')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrackingCheckIcon size={18} color="#2e9e7f" />
                        Seguimiento de Trámite
                      </span>
                    </li>
                    <li
                      className={activeSection === 'impersonate' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('impersonate')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ImpersonateIcon size={20} color="#2e9e7f" />
                        Ingresar a una cuenta
                      </span>
                    </li>
                    <li
                      className={activeSection === 'cambios-tiempo' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('cambios-tiempo')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CambiosTiempoIcon size={18} color="#2e9e7f" />
                        Cambios Tiempo
                      </span>
                    </li>
                    <li
                      className={activeSection === 'cambio-asesor' ? 'sidebar-gestor-selected' : ''}
                      onClick={() => setActiveSection('cambio-asesor')}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CambioAsesorIcon size={18} color="#2e9e7f" />
                        Cambio de Asesor
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
