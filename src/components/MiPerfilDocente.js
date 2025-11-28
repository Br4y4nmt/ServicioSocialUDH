import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarDocente from '../components/SidebarDocente';
import axios from 'axios';
import {
  mostrarAlertaCelularInvalido,
  mostrarAlertaSinCambios,
  mostrarAlertaCelularActualizado,
  mostrarAlertaErrorActualizarCelular,
} from '../hooks/alerts/alertas';
import './DashboardAlumno.css';
import { useUser } from '../UserContext';  

function MiPerfilDocente() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [nombre, setNombre] = useState('');
  const [, setFacultades] = useState([]);
  const [, setProgramas] = useState([]);
  const { user } = useUser();  
  const token = user?.token; 

  const [perfil, setPerfil] = useState({
    nombre_docente: '',
    dni: '',
    email: '',
    celular: '',
    facultad_id: '',
    programa_academico_id: '',
  });
  
  const [celularOriginal, setCelularOriginal] = useState('');

  useEffect(() => {
    setNombre(localStorage.getItem('nombre_usuario') || 'NOMBRE DEL DOCENTE');

    const usuario_id = localStorage.getItem('id_usuario');
    if (!usuario_id) return;

  const fetchPerfil = async () => {
      try {
        const res = await axios.get(
          `/api/docentes/datos/usuario/${usuario_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const data = res.data;

        setPerfil({
          nombre_docente: data.nombre_docente || '',
          dni: data.dni || '',
          email: data.email || '',
          celular: data.celular || '',
          facultad_nombre: data.Facultade?.nombre_facultad || '',
          programa_nombre: data.ProgramaDelDocente?.nombre_programa || ''
        });

        setCelularOriginal(data.celular || ''); 
      } catch (error) {
        console.error('Error al obtener perfil docente:', error);
      }
    };


  const fetchFacultades = async () => {
      try {
        const res = await axios.get('/api/facultades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFacultades(res.data);
      } catch (error) {
        console.error('Error al obtener facultades:', error);
      }
    };

    fetchPerfil();
    fetchFacultades();
  }, [token]);

 useEffect(() => {
    if (!perfil.facultad_id) return;

    const fetchProgramas = async () => {
      try {
        const res = await axios.get(
          `/api/programas/facultad/${perfil.facultad_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProgramas(res.data);
      } catch (error) {
        console.error('Error al obtener programas:', error);
      }
    };

    fetchProgramas();
  }, [perfil.facultad_id, token]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

 const handleGuardar = async () => {
    if (!/^\d{9}$/.test(perfil.celular)) {
      mostrarAlertaCelularInvalido();
      return;
    }
    if (perfil.celular === celularOriginal) {
    mostrarAlertaSinCambios('No se realizaron cambios.');
    return;
  }


  try {
    const usuario_id = localStorage.getItem('id_usuario');

    await axios.put(
      `/api/docentes/actualizar-celular/${usuario_id}`,
      { celular: perfil.celular },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

  setCelularOriginal(perfil.celular);
  mostrarAlertaCelularActualizado();

  } catch (error) {
    console.error('Error al actualizar celular:', error);
    mostrarAlertaErrorActualizarCelular();
  }
};

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={nombre}
        onToggleSidebar={toggleSidebar}
        activeSection={'mi-perfil'}
        setActiveSection={() => {}}
      />
      {!collapsed && window.innerWidth <= 768 && (
  <div className="sidebar-overlay" onClick={toggleSidebar} />
)}
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        
          <h1 className="dashboard-title">Mi Perfil</h1>
          <div className="card-section">
            <div className="form-group">
              <label className="bold-text">Nombre Completo</label>
              <input className="input-disabled" value={perfil.nombre_docente} disabled />
            </div>
            <div className="form-group">
              <label className="bold-text">DNI</label>
              <input className="input-disabled" value={perfil.dni} disabled />
            </div>
            <div className="form-group">
              <label className="bold-text">Correo Institucional</label>
              <input className="input-disabled" value={perfil.email.toLowerCase()} disabled />
            </div>
            <div className="form-group">
            <label className="bold-text">
              Número Celular <span className="campo-obligatorio">*</span>
            </label>
            <input
              className="input-editable"
              value={perfil.celular}
              maxLength={9}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/\D/g, '');
                if (soloNumeros.length <= 9) {
                  setPerfil((prev) => ({ ...prev, celular: soloNumeros }));
                }
              }}
            />
            <p className="campo-ayuda">Puedes modificar este campo</p>
          </div>
            <div className="form-group">
            <label className="bold-text">Facultad</label>
            <input
              className="input-disabled"
              value={perfil.facultad_nombre || ''}
              disabled
            />
          </div>
            <div className="form-group">
              <label className="bold-text">Programa Académico</label>
              <input
                className="input-disabled"
                value={perfil.programa_nombre || ''}
                disabled
              />
            </div>
            
            <div className="alerta-boton-wrapper">
              <div className="alerta-importante bounce">
                <strong>¡Importante!</strong> Mantén tu número celular actualizado para recibir notificaciones.
              </div>

            <div className="boton-centrado">
              <button className="btn-solicitar-aprobacion" onClick={handleGuardar}>
                  Guardar Cambios
              </button>
          </div>
          </div>
          </div>
        
      </main>
    </>
  );
}

export default MiPerfilDocente;
