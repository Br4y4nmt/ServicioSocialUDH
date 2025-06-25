import React, { useEffect, useState } from 'react';
import './SidebarAlumno.css';
import Swal from 'sweetalert2';

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
  const [openMenu, setOpenMenu] = useState(0); // Para manejar qué menú está abierto
  


  useEffect(() => {
    const foto = localStorage.getItem('foto_perfil');
    if (foto) setFotoPerfil(foto);
  
    // 👉 Abrir automáticamente el menú correcto según la sección activa
    if (activeSection === 'designacion' || activeSection === 'conformidad') {
      setOpenMenu(0); // Menú de "Plan de Servicio Social"
    } else if (activeSection === 'seguimiento') {
      setOpenMenu(1); // Menú de "Ejecución"
    } else if (activeSection === 'informe') {
      setOpenMenu(2); // (si después agregas otro)
    } else if (activeSection === 'informe-final') {
      setOpenMenu(2); // (si después agregas otro)
    }
  }, [activeSection]);

  const toggleMenu = (index) => {
    setOpenMenu(openMenu === index ? null : index); // Toggle open menu
  };
  
  return (
    <aside  className={`sidebar-alumno 
  ${collapsed ? 'collapsed' : ''} 
  ${!collapsed && window.innerWidth <= 768 ? 'show' : ''}`}>
    <button className="toggle-btn" onClick={onToggleSidebar}>
      <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
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
              <button onClick={() => toggleMenu(0)} className="menu-title">
                  <svg fill="#2e9e7f" height="32px" width="32px" viewBox="0 0 32 32" className="text-[#2e9e7f] group-hover:text-black dark:group-hover:text-[#2e9e7f] dark:text-white w-8 h-8 transition-transform transform group-hover:translate-x-2 duration-300">
                     <path d="M24,14.059V5.584L18.414,0H0v32h24v-0.059c4.499-0.5,7.998-4.309,8-8.941C31.998,18.366,28.499,14.556,24,14.059z M17.998,2.413L21.586,6h-3.588V2.413z M2,30V1.998h14v6.001h6v6.06c-1.752,0.194-3.352,0.89-4.652,1.941H4v2h11.517c-0.412,0.616-0.743,1.289-0.994,2H4v2h10.059C14.022,22.329,14,22.661,14,23c0,2.829,1.308,5.351,3.349,7H2z M23,29.883c-3.801-0.009-6.876-3.084-6.885-6.883c0.009-3.801,3.084-6.876,6.885-6.885c3.799,0.009,6.874,3.084,6.883,6.885C29.874,26.799,26.799,29.874,23,29.883z M20,12H4v2h16V12z"></path>
                      <polygon points="22,27 19,27 19,24"></polygon>
                        <rect
                    height="4.243"
                    transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 56.5269 20.5858)"
                    width="7.071"
                    x="20.464"
                    y="19.879"
                  ></rect>
                  </svg>
 
                  Plan de Servicio Social
                  <i className={`fas ${openMenu === 0 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
                {openMenu === 0 && (
                  <ul className="submenu">
                  <li 
                className={activeSection === 'designacion' ? 'selected' : ''} 
                onClick={() => {
                setActiveSection('designacion');
                if (window.innerWidth <= 768) onToggleSidebar(); // 👈 Oculta sidebar en responsive
              }}

              >
                Designación de Supervisor
              </li>

                <li 
                className={activeSection === 'conformidad' ? 'selected' : ''} 
                onClick={() => {
            if (estadoPlan === 'aceptado') {
              setActiveSection('conformidad');
              if (window.innerWidth <= 768) onToggleSidebar(); // 👈 Oculta sidebar
            } else {
              Swal.fire({
                      icon: 'info',
                      title: 'Solicitud pendiente',
                      text: 'El docente aún no ha aceptado tu solicitud.',
                      confirmButtonText: 'Entendido'
                    });
                  }
                }}
              >
                Conformidad de Plan
              </li>
                </ul>
                )}
              </li>
              <li className="menu-item">
              <button onClick={() => toggleMenu(1)} className="menu-title">
    {/* SVG del ícono de configuración */}
    <svg fill="#2e9e7f" height="32px" width="32px" viewBox="0 0 24 24" className="text-[#2e9e7f] group-hover:text-black dark:group-hover:text-[#2e9e7f] dark:text-white w-8 h-8 transition-transform transform group-hover:translate-x-2 duration-300">
      <path d="M12 17c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5zm0-8c-1.654 0-3 1.346-3 3s1.346 3 3 3 3-1.346 3-3-1.346-3-3-3z"></path>
      <path d="M22.59 9.09c-.18-.06-.93-.09-.93-.09-.55 0-1-.45-1-1 0-.28.12-.54.31-.72 0 0 .49-.54.57-.72.4-.75.28-1.71-.35-2.34l-1.41-1.41c-.39-.39-.9-.58-1.41-.58-.32 0-.64.08-.93.23-.18.08-.7.56-.7.56-.18.2-.44.32-.74.32-.55 0-1-.45-1-1V2c0-.21-.03-.41-.09-.59C14.66.59 13.89 0 13 0h-2c-.89 0-1.66.59-1.91 1.41-.06.18-.09.38-.09.59v.34c0 .55-.45 1-1 1-.3 0-.56-.12-.74-.32 0 0-.52-.48-.7-.56-.29-.15-.61-.23-.93-.23-.51 0-1.02.19-1.41.58L2.81 4.22c-.63.63-.75 1.59-.35 2.34.08.18.57.72.57.72.19.18.31.44.31.72 0 .55-.45 1-1 1 0 0-.75.03-.93.09C.59 9.34 0 10.11 0 11v2c0 .89.59 1.66 1.41 1.91.18.06.93.09.93.09.55 0 1 .45 1 1 0 .28-.12.54-.31.72 0 0-.49.54-.57.72-.4.75-.28 1.71.35 2.34l1.41 1.41c.39.39.9.58 1.41.58.32 0 .64-.08.93-.23.18-.08.7-.56.7-.56.18-.2.44-.32.74-.32.55 0 1 .45 1 1V22c0 .21.03.41.09.59.25.82 1.02 1.41 1.91 1.41h2c.89 0 1.66-.59 1.91-1.41.06-.18.09-.38.09-.59v-.34c0-.55.45-1 1-1 .3 0 .56.12.74.32 0 0 .52.48.7.56.29.15.61.23.93.23.51 0 1.02-.19 1.41-.58l1.41-1.41c.63-.63.75-1.59.35-2.34-.08-.18-.57-.72-.57-.72-.19-.18-.31-.44-.31-.72 0-.55.45-1 1-1 0 0 .75-.03.93-.09.82-.25 1.41-1.02 1.41-1.91v-2c0-.89-.59-1.66-1.41-1.91zM22 12.5c0 .27-.21.49-.48.5-1.59.07-2.86 1.39-2.86 3 0 .75.29 1.48.79 2.03.08.09.13.2.13.33 0 .14-.05.25-.13.34l-.73.72c-.09.09-.21.15-.35.15-.13 0-.25-.05-.34-.13-.54-.5-1.27-.78-2.03-.78-1.61 0-2.93 1.28-3.01 2.87-.01.26-.22.47-.49.47h-1c-.27 0-.48-.21-.49-.47-.08-1.59-1.4-2.87-3.01-2.87-.76 0-1.49.28-2.03.78-.09.08-.21.13-.34.13-.14 0-.26-.06-.35-.15l-.73-.72c-.08-.09-.13-.2-.13-.34 0-.13.05-.24.13-.33.5-.55.79-1.28.79-2.03 0-1.61-1.27-2.93-2.86-3-.27-.01-.48-.23-.48-.5v-1c0-.28.22-.5.5-.5 1.58-.08 2.84-1.4 2.84-3 0-.74-.28-1.45-.77-2 0 0-.01-.01-.01-.02-.09-.08-.14-.21-.14-.34 0-.14.06-.27.15-.36l.69-.7h.01c.09-.1.21-.16.36-.16.14 0 .26.06.35.15.55.49 1.27.77 2.02.77 1.6 0 2.91-1.26 3-2.84 0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5.09 1.58 1.4 2.84 3 2.84.75 0 1.47-.28 2.02-.77.09-.09.21-.15.35-.15.15 0 .27.06.36.16h.01l.69.7c.09.09.15.22.15.36 0 .13-.05.26-.14.34 0 .01-.01.02-.01.02-.49.55-.77 1.26-.77 2c0 1.6 1.26 2.92 2.84 3 .28 0 .5.22.5.5v1z"></path>
    </svg>
                  Ejecución
                  <i className={`fas ${openMenu === 1 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </button>
                {openMenu === 1 && (
                  <ul className="submenu">
                    <li 
  className={activeSection === 'seguimiento' ? 'selected' : ''} 
  onClick={() => {
  if (estadoConformidad === 'aceptado') {
    setActiveSection('seguimiento');
    if (window.innerWidth <= 768) onToggleSidebar();
  } else {
    Swal.fire({
        icon: 'info',
        title: 'Conformidad pendiente',
        text: 'Tu asesor aún no ha aprobado el esquema plan.',
        confirmButtonText: 'Entendido'
      });
    }
  }}
>
  Seguimiento
</li>
  </ul>
    )}
    </li>
              <li className="menu-item">
              <button onClick={() => toggleMenu(2)} className="menu-title">
    {/* SVG del ícono de Informe Final */}
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="none" stroke="#2e9e7f" strokeWidth="3.036" className="text-[#2e9e7f] group-hover:text-black dark:group-hover:text-[#2e9e7f] dark:text-white w-8 h-8 transition-transform transform group-hover:translate-x-2 duration-300">
  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
  <g id="SVGRepo_iconCarrier">
    <path d="M14,4.5H10.5a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2V6.5a2,2,0,0,0-2-2H24"></path>
    <path d="M12,4.5l1.4142-1.4142A2,2,0,0,1,14.8284,2.5H23a1,1,0,0,1,1,1v25l-5-5-5,5V4.5"></path>
    <line x1="14" y1="38" x2="34" y2="38"></line>
    <line x1="24" y1="10" x2="34" y2="10"></line>
    <line x1="24" y1="17" x2="34" y2="17"></line>
    <line x1="24" y1="24" x2="34" y2="24"></line>
    <line x1="14" y1="31" x2="34" y2="31"></line>
  </g>
</svg>
    
    Informe Final
    <i className={`fas ${openMenu === 2 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
  </button>
                {openMenu === 2 && (
                  <ul className="submenu">
                 <li
  className={activeSection === 'informe-final' ? 'selected' : ''}
  onClick={() => {
    if (estadoSolicitudTermino?.trim().toLowerCase() === 'aprobada') {
      setActiveSection('informe-final');
      if (window.innerWidth <= 768) onToggleSidebar(); // Oculta sidebar en responsive
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Acceso restringido',
        text: 'Aún no puedes acceder al Informe Final. Tu carta de término aún no ha sido aprobada.',
        confirmButtonText: 'Entendido'
      });
    }
  }}
>
  Informe Final
</li>
 </ul>
   )}
  </li>

<li className="menu-item">
  <button onClick={() => toggleMenu(3)} className="menu-title">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#2e9e7f] group-hover:text-black dark:group-hover:text-[#2e9e7f] dark:text-white w-8 h-8 transition-transform transform group-hover:translate-x-2 duration-300">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M5 8C5 5.17157 5 3.75736 5.87868 2.87868C6.75736 2 8.17157 2 11 2H13C15.8284 2 17.2426 2 18.1213 2.87868C19 3.75736 19 5.17157 19 8V16C19 18.8284 19 20.2426 18.1213 21.1213C17.2426 22 15.8284 22 13 22H11C8.17157 22 6.75736 22 5.87868 21.1213C5 20.2426 5 18.8284 5 16V8Z" stroke="#2e9e7f" strokeWidth="1.5"></path>
        <path opacity="0.7" d="M9 13H15" stroke="#2e9e7f" strokeWidth="1.5" strokeLinecap="round"></path>
        <path d="M9 9H15" stroke="#2e9e7f" strokeWidth="1.5" strokeLinecap="round"></path>
        <path opacity="0.4" d="M9 17H12" stroke="#2e9e7f" strokeWidth="1.5" strokeLinecap="round"></path>
        <path opacity="0.5" d="M2 19V5" stroke="#2e9e7f" strokeWidth="1.5" strokeLinecap="round"></path>
        <path opacity="0.5" d="M22 19V5" stroke="#2e9e7f" strokeWidth="1.5" strokeLinecap="round"></path>
      </g>
    </svg>
    Documentos
    <i className={`fas ${openMenu === 3 ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
  </button>
  {openMenu === 3 && (
    <ul className="submenu">
      <li 
        className={activeSection === 'reglamento' ? 'selected' : ''} 
        onClick={() => {
          setActiveSection('reglamento');
          if (window.innerWidth <= 768) onToggleSidebar(); // 👈 Oculta sidebar
        }}
      >
        Reglamento
      </li>
      <li 
        className={activeSection === 'plan-trabajo' ? 'selected' : ''} 
        onClick={() => {
          setActiveSection('plan-trabajo');
          if (window.innerWidth <= 768) onToggleSidebar(); // 👈 Oculta sidebar
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
