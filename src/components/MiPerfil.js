// src/pages/MiPerfil.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarAlumno from '../components/SidebarAlumno';
import axios from 'axios';
import './DashboardAlumno.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import Swal from 'sweetalert2';

function MiPerfil() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const isMobile = window.innerWidth <= 768;
  const [nombre, setNombre] = useState('');
  const [celularOriginal, setCelularOriginal] = useState('');
  const [perfil, setPerfil] = useState({
    nombre_completo: '',
    dni: '',
    correo: '',
    celular: '',
    facultad: '',
    programa: '',
    codigo: '',
    sede: '',
    modalidad: ''
  });

  const { user } = useUser();
  const token = user?.token;
  const navigate = useNavigate();

  const toggleSidebar = () => setCollapsed(prev => !prev);

  useEffect(() => {
    setNombre(localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO');

    const usuario_id = localStorage.getItem('id_usuario');
    if (!usuario_id) return;

    const fetchPerfil = async () => {
      try {
        const res = await axios.get(`/api/estudiantes/usuario/${usuario_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = res.data;

        setPerfil({
          nombre_completo: data.nombre_estudiante,
          dni: data.dni,
          correo: data.email,
          celular: data.celular || '',
          facultad: data.facultad?.nombre_facultad || '',
          programa: data.programa?.nombre_programa || '',
          codigo: data.codigo,
          sede: data.sede || '',
          modalidad: data.modalidad || '' 
        });

        setCelularOriginal(data.celular || '');
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    fetchPerfil();
  }, [token]);

  const handleGuardar = async () => {
    if (perfil.celular === celularOriginal) {
      Swal.fire({
        icon: 'info',
        title: 'Sin cambios',
        text: 'No se realizaron modificaciones.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const celularRegex = /^\d{9}$/;
    if (!celularRegex.test(perfil.celular)) {
      Swal.fire({
        icon: 'error',
        title: 'Celular inválido',
        text: 'El número celular debe tener exactamente 9 dígitos.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    try {
      const usuario_id = localStorage.getItem('id_usuario');
      await axios.put(
        `/api/estudiantes/actualizar-celular-perfil/${usuario_id}`,
        { celular: perfil.celular },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCelularOriginal(perfil.celular);

      Swal.fire({
        icon: 'success',
        title: '¡Actualizado!',
        text: 'Tu número celular ha sido actualizado correctamente.',
        confirmButtonColor: '#28a745'
      });
    } catch (error) {
      console.error('Error al actualizar celular:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el número celular. Intenta nuevamente.',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarAlumno
        collapsed={collapsed}
        nombre={nombre}
        onToggleSidebar={toggleSidebar}
        activeSection={'perfil'}
        setActiveSection={(seccion) => navigate(`/dashboard-alumno?seccion=${seccion}`)}
      />

      {!collapsed && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
          style={{ cursor: 'pointer' }}
        ></div>
      )}

      <main className={`main-content${collapsed ? ' collapsed' : ''}${!collapsed && isMobile ? ' sidebar-active' : ''}`}>
        <h1 className="dashboard-title">Mi Perfil</h1>
        <div className="card-section">
          <div className="form-group">
            <label className="bold-text">Nombre Completo</label>
            <input className="input-disabled" value={perfil.nombre_completo} disabled />
          </div>
          <div className="form-group">
            <label className="bold-text">DNI</label>
            <input className="input-disabled" value={perfil.dni} disabled />
          </div>
          <div className="form-group">
            <label className="bold-text">Código</label>
            <input className="input-disabled" value={perfil.codigo} disabled />
          </div>
          <div className="form-group">
            <label className="bold-text">Correo Institucional</label>
            <input className="input-disabled" value={perfil.correo} disabled />
          </div>
          <div className="form-group">
            <label className="bold-text">Número Celular</label>
            <input
              className="input-editable"
              value={perfil.celular}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,9}$/.test(val)) {
                  setPerfil((prev) => ({ ...prev, celular: val }));
                }
              }}
              maxLength={9}
              pattern="\d{9}"
              inputMode="numeric"
            />
            <small className="text-muted">Puedes modificar este campo</small>
          </div>
          <div className="form-group">
          <label className="bold-text">Sede</label>
          <input
            className="input-disabled"
            value={perfil.sede}
            disabled
          />
        </div>
        <div className="form-group">
          <label className="bold-text">Modalidad</label>
          <input
        className="input-disabled"
        value={perfil.modalidad || ''}
        disabled
      />
        </div>
          <div className="form-group">
            <label className="bold-text">Facultad</label>
            <input className="input-disabled" value={perfil.facultad} disabled />
          </div>
          <div className="form-group">
            <label className="bold-text">Programa Académico</label>
            <input className="input-disabled" value={perfil.programa} disabled />
          </div>
          <div className="form-group alerta-boton-wrapper">
            <div className="alerta-importante bounce">
              <strong>¡Importante!</strong> Mantén tu número celular actualizado para recibir notificaciones.
            </div>
            <div className="contenedor-boton-centro">
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

export default MiPerfil;
