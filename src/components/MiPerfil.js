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
  const [programas, setProgramas] = useState([]);
  const [perfil, setPerfil] = useState({
  nombre_completo: '',
  apellido_paterno: '',
  apellido_materno: '',
  dni: '',
  correo: '',
  celular: '',
  facultad: '',
  programa: '',
  codigo: '',
});
  
  const { user } = useUser();  
  const token = user?.token; 
  const navigate = useNavigate();
  
 useEffect(() => {
   setNombre(localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO');

  const correo = localStorage.getItem('correo_institucional') || '';
  const usuario_id = localStorage.getItem('id_usuario');
  const codigo = correo.split('@')[0]; // ✅ extrae el código desde el correo

  if (!codigo || !usuario_id) return;


  const fetchPerfilDesdeAmbasFuentes = async () => {
    try {

      const resUDH = await axios.get(
        `http://www.udh.edu.pe/websauh/secretaria_general/gradosytitulos/datos_estudiante_json.aspx?_c_3456=${codigo}`
      );
      const dataUDH = resUDH.data[0];

      // 2. API interna (correo y celular)
    const resInterno = await axios.get(
          `http://localhost:5000/api/estudiantes/datos/usuario/${usuario_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      const dataInterno = resInterno.data;

      setPerfil((prev) => ({
        ...prev,
        nombre_completo: dataUDH.stu_nombres || '',
        dni: dataUDH.stu_dni || '',
        codigo: dataUDH.stu_codigo || '',
        facultad: dataUDH.stu_facultad || '',
        programa: dataUDH.stu_programa || '',
        correo: dataInterno.email || '',
        celular: dataInterno.celular || '',
        apellido_paterno: dataUDH.stu_apellido_paterno || '',
        apellido_materno: dataUDH.stu_apellido_materno || '',
        

      }));
      setCelularOriginal(dataInterno.celular || '');
    } catch (error) {
      console.error('Error al obtener datos combinados:', error);
    }
  };

  fetchPerfilDesdeAmbasFuentes();
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

  try {
    const usuario_id = localStorage.getItem('id_usuario');
    await axios.put(
      `http://localhost:5000/api/estudiantes/actualizar-celular/${usuario_id}`,
      { celular: perfil.celular },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setCelularOriginal(perfil.celular); // ← actualizar valor original tras guardar

    Swal.fire({
      icon: 'success',
      title: '¡Actualizado!',
      text: 'Tu número celular ha sido actualizado correctamente.',
      confirmButtonColor: '#3085d6'
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
  
 useEffect(() => {
    if (!perfil.facultad) return;

    const fetchProgramas = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/programas/facultad/${perfil.facultad}`,
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
  }, [perfil.facultad, token]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
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
            <label className="bold-text">Apellido Paterno</label>
            <input className="input-disabled" value={perfil.apellido_paterno} disabled />
          </div>
          <div className="form-group">
            <label className="bold-text">Apellido Materno</label>
            <input className="input-disabled" value={perfil.apellido_materno} disabled />
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
                    className="input-disabled"
                    value={perfil.celular}
                    onChange={(e) =>
                        setPerfil((prev) => ({ ...prev, celular: e.target.value }))
                    }
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
  <button className="btn-solicitar-aprobacion" onClick={handleGuardar}>
    Guardar Cambios
  </button>
</div>
          </div>
          
       
      </main>
    </>
  );
}

export default MiPerfil;
