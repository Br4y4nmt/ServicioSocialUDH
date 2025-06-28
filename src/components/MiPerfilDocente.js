import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SidebarDocente from '../components/SidebarDocente';
import axios from 'axios';
import Swal from 'sweetalert2';
import './DashboardAlumno.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';


function MiPerfilDocente() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [nombre, setNombre] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const { user } = useUser();  
  const token = user?.token; 
  const navigate = useNavigate();

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
          facultad_id: data.Facultade?.id_facultad || '',
          programa_academico_id: data.ProgramaDelDocente?.id_programa || ''
        });

        setCelularOriginal(data.celular || ''); // 👈 Guardamos el celular original
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
  // Validar que tenga exactamente 9 dígitos
  if (!/^\d{9}$/.test(perfil.celular)) {
    Swal.fire({
      icon: 'warning',
      title: 'Número inválido',
      text: 'El número celular debe tener exactamente 9 dígitos.',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  // Validar si no se han realizado cambios
  if (perfil.celular === celularOriginal) {
    Swal.fire({
      icon: 'info',
      title: 'Sin cambios',
      text: 'No se realizaron cambios.',
      confirmButtonColor: '#3085d6'
    });
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

    setCelularOriginal(perfil.celular); // Actualiza el valor original

    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'Celular actualizado correctamente.',
      confirmButtonColor: '#3085d6'
    });
  } catch (error) {
    console.error('Error al actualizar celular:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un error al actualizar el celular.',
      confirmButtonColor: '#d33'
    });
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
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-container">
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
              <label className="bold-text">Número Celular</label>
              <input
                  className="input-disabled"
                  value={perfil.celular}
                  maxLength={9} // <- Límite visual en el input
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, ''); // Elimina letras
                    if (soloNumeros.length <= 9) {
                      setPerfil((prev) => ({ ...prev, celular: soloNumeros }));
                    }
                  }}
                />
            </div>
            <div className="form-group">
              <label className="bold-text">Facultad</label>
              <select className="input-disabled" value={perfil.facultad_id} disabled>
                <option value="">Seleccione Facultad</option>
                {facultades.map((fac) => (
                  <option key={fac.id_facultad} value={fac.id_facultad}>
                    {fac.nombre_facultad}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="bold-text">Programa Académico</label>
              <select className="input-disabled" value={perfil.programa_academico_id} disabled>
                <option value="">Seleccione Programa</option>
                {programas.map((prog) => (
                  <option key={prog.id_programa} value={prog.id_programa}>
                    {prog.nombre_programa}
                  </option>
                ))}
              </select>
            </div>
            <div className="alerta-boton-wrapper">
            <div className="alerta-importante bounce">
              <strong>¡Importante!</strong> Mantén tu número celular actualizado para recibir notificaciones.
            </div>
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
