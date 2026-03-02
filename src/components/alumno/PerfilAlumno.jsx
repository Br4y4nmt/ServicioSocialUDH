import React, { useState, useEffect, useRef } from 'react'; 
import Header from '../layout/Header/Header';
import SidebarAlumno from '../layout/Sidebar/SidebarAlumno';
import axios from 'axios';
import Swal from 'sweetalert2';
import './perfil.css';
import PerfilIcon from './PerfilIcon';
import { useUser } from '../../UserContext';
import { toastWarning } from '../../hooks/alerts/alertas';
import Spinner from 'components/ui/Spinner';

function PerfilAlumno() {
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const sidebarRef = useRef();
  const [nombre, setNombre] = useState('');
  const { user } = useUser();  
  const [sedeSeleccionada, setSedeSeleccionada] = useState('');
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = user?.token;
  const [perfil, setPerfil] = useState({
    nombre_completo: '',
    dni: '',
    correo: '',
    celular: '',
    facultad: '',
    programa: '',
    codigo: '',
  });

    const handleClickOutside = (event) => {
  
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setCollapsed(true);
    }
  };

  useEffect(() => {
    
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
  setNombre(localStorage.getItem('nombre_usuario') || 'NOMBRE DEL ALUMNO');
}, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const handleGuardar = async () => {
  const usuario_id = localStorage.getItem('id_usuario');
  const { celular } = perfil;


    if (!celular) {
      toastWarning('Celular requerido', { text: 'Ingresa tu número celular antes de continuar.' });
      return;
    }
  if (!modalidadSeleccionada) {
    toastWarning('Modalidad requerida', { text: 'Selecciona una modalidad antes de continuar.' });
    return;
  }
  const celularRegex = /^\d{9}$/;
  if (!celularRegex.test(celular)) {
    toastWarning('Celular inválido', { text: 'El número debe contener exactamente 9 dígitos numéricos.' });
    return;
  }

  if (!sedeSeleccionada) {
    toastWarning('Sede requerida', { text: 'Selecciona una sede antes de continuar.' });
    return;
  }

  try {
    setLoading(true);
    await axios.put(`/api/estudiantes/actualizar-celular/${usuario_id}`, 
      { celular, sede: sedeSeleccionada, modalidad: modalidadSeleccionada.toUpperCase() },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Tu perfil ha sido completado correctamente.',
      confirmButtonColor: '#28a745',
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = '/dashboard-alumno';
    });

  } catch (error) {
    console.error('Error al actualizar:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error al actualizar',
      text: 'Ocurrió un error al guardar los datos.',
      confirmButtonColor: '#d33'
    });
  }finally {
    setLoading(false); 
  }
};

useEffect(() => {
  const fetchPerfilPorUsuario = async () => {
    const id_usuario = localStorage.getItem('id_usuario');
    if (!id_usuario) return;

    try {
      const res = await axios.get(`/api/estudiantes/usuario/${id_usuario}`, {
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
    });
     
  setSedeSeleccionada(data.sede || '');
  setModalidadSeleccionada(data.modalidad || '');
    } catch (error) {
      console.error('Error al obtener perfil por usuario:', error);
    }
  };

  fetchPerfilPorUsuario();
}, [token]);


const handleCelularChange = (e) => {
  const value = e.target.value;
  if (/^\d{0,9}$/.test(value)) {
    setPerfil((prev) => ({ ...prev, celular: value }));
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
        setActiveSection={() => {}}
        isPerfilIncompleto={true}
      />
      <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        
          <h1 className="dashboard-title-animada">Mi Perfil</h1>
          <div className="card-section perfil-card">
            <aside className="perfil-left">
              <button className="perfil-nav active">
                <PerfilIcon className="perfil-icon" />
                <span>Perfil</span>
              </button>
            </aside>

            <div className="perfil-right">
              <div className="form-group">
                <label className="bold-text">Nombre Completo</label>
                <input
                  name="nombre_completo"
                  className="input-disabled"
                  value={perfil.nombre_completo}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="bold-text">DNI</label>
                <input
                  name="dni"
                  className="input-disabled"
                  value={perfil.dni}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="bold-text">Código</label>
                <input
                  name="codigo"
                  className="input-disabled"
                  value={perfil.codigo}
                  disabled
                />
              </div>
              <div className="form-group">
                <label className="bold-text">Correo Institucional</label>
                <input
                  name="correo"
                  className="input-disabled"
                  value={perfil.correo}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="bold-text">
                  Número Celular <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  name="celular"
                  className="input-editable"
                  value={perfil.celular}
                  onChange={handleCelularChange}
                  maxLength={9}
                  pattern="\d*"
                  inputMode="numeric"
                />
                <small className="text-muted">Campo obligatorio</small>
              </div>

              <div className="form-group">
                <label className="bold-text">
                  Sede <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="input-editable"
                  value={sedeSeleccionada}
                  onChange={(e) => setSedeSeleccionada(e.target.value)}
                >
                  <option value="">Seleccione una sede</option>
                  <option value="HUÁNUCO">HUÁNUCO</option>
                  <option value="LEONCIO PRADO">LEONCIO PRADO</option>
                </select>
              </div>

              <div className="form-group">
                <label className="bold-text">
                  Modalidad <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="input-editable"
                  value={modalidadSeleccionada}
                  onChange={(e) => setModalidadSeleccionada(e.target.value)}
                >
                  <option value="">Seleccione una modalidad</option>
                  <option value="PRESENCIAL">PRESENCIAL</option>
                  <option value="SEMI-PRESENCIAL">SEMI-PRESENCIAL</option>
                </select>
              </div>

              <div className="form-group">
                <label className="bold-text">Facultad</label>
                <input
                  name="facultad"
                  className="input-disabled"
                  value={perfil.facultad}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="bold-text">Programa Académico</label>
                <input
                  name="programa"
                  className="input-disabled"
                  value={perfil.programa}
                  disabled
                />
              </div>

              <div className="alerta-boton-wrapper">
                <div className="alerta-importante bounce">
                  <strong>¡Importante!</strong> Mantén tu número celular actualizado para recibir notificaciones.
                </div>

                <div className="boton-centrado">
                  <button
                    className="btn-guardar-cambios"
                    onClick={handleGuardar}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loading ? (
                      <>
                        <Spinner size={16} />
                        <span style={{ marginLeft: 8 }}>Actualizando...</span>
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        
      </main>
    </>
  );
}

export default PerfilAlumno;
