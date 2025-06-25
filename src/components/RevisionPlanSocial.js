import React, { useState, useEffect } from 'react';
import Header from './Header';
import './RevisionPlanSocial.css';
import { useNavigate } from 'react-router-dom';
import SidebarDocente from './SidebarDocente';
import { useUser } from '../UserContext'; 
import axios from 'axios';
import Swal from 'sweetalert2';

function RevisionPlanSocial() {
  const [collapsed, setCollapsed] = useState(false);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Control del modal
  const [selectedTrabajo, setSelectedTrabajo] = useState(null); // Trabajo seleccionado para edición
  const [nuevoEstado, setNuevoEstado] = useState(''); // Estado editable
  const [activeSection, setActiveSection] = useState('conformidad');
  const { user } = useUser();  // Obtener el contexto del usuario
  const token = user?.token;   // El token debe provenir de user.context
  
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

 useEffect(() => {
    // Verificar que el token y usuario estén disponibles
    if (!token) {
      console.error('Falta el token');
      return; // Si falta el token, no hacer nada
    }

    const usuarioId = localStorage.getItem('id_usuario');
    if (!usuarioId) {
      console.error('Falta el ID del usuario');
      return; // Si falta el ID de usuario, no hacer nada
    }

    // Solicitar los datos del docente
    axios.get(`http://localhost:5000/api/docentes/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const docenteId = response.data.id_docente;

        // Solicitar los trabajos sociales del docente
        axios.get(`http://localhost:5000/api/trabajo-social/docente/${docenteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            setTrabajosSociales(res.data);  // Guarda los trabajos sociales en el estado
          })
          .catch(error => {
            console.error('Error al obtener los trabajos sociales:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener trabajos sociales',
              text: 'No se pudieron cargar los trabajos sociales del docente.',
            });
          });
      })
      .catch(error => {
        console.error('Error al obtener los datos del docente:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener datos del docente',
          text: 'No se pudo obtener la información del docente.',
        });
      });
  }, [token]);  // Asegúrate de observar cambios en el token

  const handleEdit = (trabajo) => {
    setSelectedTrabajo(trabajo);
    setNuevoEstado(trabajo.conformidad_plan_social);
    setModalVisible(true);
  };
  const handleSave = () => {
    if (selectedTrabajo) {
      axios.put(
        `http://localhost:5000/api/trabajo-social/${selectedTrabajo.id}`,
        {
          ...selectedTrabajo,
          conformidad_plan_social: nuevoEstado,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
        .then(() => {
          setTrabajosSociales(prev =>
            prev.map(trabajo =>
              trabajo.id === selectedTrabajo.id ? { ...trabajo, conformidad_plan_social: nuevoEstado } : trabajo
            )
          );
          setModalVisible(false); // Cierra el modal después de guardar

          // Agregar el SweetAlert2 si el estado es "aceptado"
          if (nuevoEstado === 'aceptado') {
            Swal.fire({
              icon: 'success',
              title: '¡Trabajo Aceptado!',
              text: 'El trabajo social ha sido aceptado exitosamente.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendido'
            });
          }
        })
        .catch(error => {
          console.error('Error al actualizar el estado:', error);
        });
    }
};

  

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={localStorage.getItem('nombre_usuario') || 'Docente'}
        onToggleSidebar={toggleSidebar}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
       {window.innerWidth <= 768 && !collapsed && (
  <div
    className="sidebar-overlay"
    onClick={() => toggleSidebar()} // Llama a tu función para colapsar el sidebar
  ></div>
)}
     <main className={`main-content${window.innerWidth <= 768 && !collapsed ? ' sidebar-open' : collapsed ? ' collapsed' : ''}`}>
        <div className="conformidad-container">
          <div className="conformidad-card">
            <h1 className="conformidad-title">Conformidad Servicio Social</h1>
  
            <div className="conformidad-table-wrapper">
              {trabajosSociales.length > 0 ? (
                <table className="conformidad-table">
                  <thead className="conformidad-table-thead">
                    <tr>
                      <th>Alumnos</th>
                      <th>Programa Académico</th>
                      <th>Servicio Social</th>
                      <th>Estado</th>
                      <th>Documento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trabajosSociales.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.Estudiante ? plan.Estudiante.nombre_estudiante : 'No disponible'}</td>
                        <td>{plan.ProgramasAcademico?.nombre_programa || 'No definido'}</td>
                        <td>{plan.LaboresSociale?.nombre_labores || 'No definido'}</td>
                        <td>
                          <span className={`estado-badge ${plan.conformidad_plan_social}`}>
                            {plan.conformidad_plan_social?.toUpperCase() || 'NO DEFINIDO'}
                          </span>
                        </td>

                        <td>
  {plan.archivo_plan_social ? (
    <a
  href={`http://localhost:5000/uploads/planes_labor_social/${plan.archivo_plan_social}`}
  target="_blank"
  rel="noreferrer"
  className="btn-ojo-ver-plan-docente"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 
      12c-2.761 0-5-2.239-5-5s2.239-5 
      5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
      3 3 0 0 0 0-6z" />
  </svg>
  <span className="texto-ver-docente">&nbsp;Ver</span>
</a>

  ) : (
    <span style={{ color: '#999', fontSize: '12px' }}>No subido</span>
  )}
</td>

                        <td>
                          <button className="btn-editar-plan-social" onClick={() => handleEdit(plan)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="14" height="14">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
                          </svg>
                        </button>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="conformidad-no-data">No hay trabajos sociales disponibles aún.</p>
              )}
            </div>
  
            
          </div>
          <div className="conformidad-footer">
              <button className="conformidad-btn siguiente" onClick={() => navigate('/revision-documento-docente')}>
                Siguiente
              </button>
            </div>
        </div>
      </main>
  
      {modalVisible && (
        <div className="conformidad-modal">
          <div className="conformidad-modal-content">
            <h3>Editar Estado</h3>
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="conformidad-modal-select"
            >
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <div className="conformidad-modal-actions">
              <button className="conformidad-btn guardar" onClick={handleSave}>
                Guardar
              </button>
              <button className="conformidad-btn cancelar" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
}

export default RevisionPlanSocial;
