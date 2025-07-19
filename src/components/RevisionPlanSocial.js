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
  const [activeSection, setActiveSection] = useState('conformidad');
  const { user } = useUser(); 
  const token = user?.token;   
  const [modalObservacionVisible, setModalObservacionVisible] = useState(false);
  const [observacionTexto, setObservacionTexto] = useState('');
  const [trabajoADeclinar, setTrabajoADeclinar] = useState(null);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [nombresMiembros, setNombresMiembros] = useState([]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
  };

 useEffect(() => {
    if (!token) {
      console.error('Falta el token');
      return; 
    }

    const usuarioId = localStorage.getItem('id_usuario');
    if (!usuarioId) {
      console.error('Falta el ID del usuario');
      return; 
    }


    axios.get(`/api/docentes/usuario/${usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        const docenteId = response.data.id_docente;

        axios.get(`/api/trabajo-social/docente/${docenteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            setTrabajosSociales(res.data);  
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
  }, [token]); 
const obtenerNombresMiembros = async (correos) => {
  try {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/estudiantes/grupo-nombres`, {
      correos
    });
    setNombresMiembros(data);
  } catch (error) {
    console.error('Error al obtener nombres del grupo:', error);
  }
};
const handleVerGrupo = async (trabajoId) => {
  try {
    const response = await axios.get(`/api/integrantes/${trabajoId}`, {
      headers: { Authorization: `Bearer ${token}` }  
    });

    const integrantes = response.data;
    setIntegrantesGrupo(integrantes);
    setModalGrupoVisible(true);

    const correos = integrantes.map(i => i.correo_institucional);
    const { data: nombres } = await axios.post(`${process.env.REACT_APP_API_URL}/api/estudiantes/grupo-nombres`, { correos });

    setNombresMiembros(nombres);
    
  } catch (error) {
    console.error('Error al obtener integrantes del grupo:', error);
    alert('No se pudieron cargar los integrantes del grupo');
  }
};

const cambiarConformidad = async (idTrabajo, nuevoEstado) => {
  const accion = nuevoEstado === 'aceptado' ? 'aceptar' : 'rechazar';
  const confirmacion = await Swal.fire({
    title: `¿Estás seguro de ${accion} este trabajo?`,
    text: `Esta acción marcará el trabajo como ${nuevoEstado}.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: nuevoEstado === 'aceptado' ? '#28a745' : '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: `Sí, ${accion}`,
    cancelButtonText: 'Cancelar'
  });

  if (confirmacion.isConfirmed) {
    try {
      await axios.put(`/api/trabajo-social/${idTrabajo}`, {
        conformidad_plan_social: nuevoEstado
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar el estado local
      setTrabajosSociales(prev =>
        prev.map(trabajo =>
          trabajo.id === idTrabajo ? { ...trabajo, conformidad_plan_social: nuevoEstado } : trabajo
        )
      );

      // Mostrar alerta final
      if (nuevoEstado === 'aceptado') {
        Swal.fire({
          icon: 'success',
          title: 'Trabajo aceptado',
          text: 'Has aceptado el plan de servicio social.',
          timer: 2500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Trabajo rechazado',
          text: 'Has rechazado el plan de servicio social.',
          timer: 2500,
          showConfirmButton: false
        });
      }

    } catch (error) {
      console.error('❌ Error al cambiar estado de conformidad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cambiar el estado del trabajo.'
      });
    }
  }
};


const capitalizarPrimeraLetra = (texto) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase() : '';


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
                      <th>Tipo Servicio Social</th>
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
                          <span className={`estado-badge ${plan.conformidad_plan_social} estado-texto-normal`}>
                            {capitalizarPrimeraLetra(plan.conformidad_plan_social) || 'No definido'}


                          </span>
                        </td>

                        <td>
                        {plan.archivo_plan_social ? (
                          <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${plan.archivo_plan_social}`}
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span>{plan.tipo_servicio_social}</span>
                      {plan.tipo_servicio_social === 'grupal' && (
                        <button
                          className="btn-ver-ojo"
                          title="Ver integrantes del grupo"
                          onClick={() => handleVerGrupo(plan.id)}
                        >
                          Ver
                        </button>
                      )}
                    </div>
                  </td>
                        <td>
                        {plan.conformidad_plan_social === 'pendiente' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <button
                              className="btn-accion aceptar"
                              onClick={() => cambiarConformidad(plan.id, 'aceptado')}
                            >
                              Aceptar
                            </button>
                            <button
                              className="btn-accion rechazar"
                              onClick={() => cambiarConformidad(plan.id, 'rechazado')}
                            >
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <button
                        className="btn-accion declinar"
                        onClick={() => {
                          setTrabajoADeclinar(plan);
                          setModalObservacionVisible(true);
                        }}
                      >
                        Declinar
                      </button>
                        )}
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
  {modalObservacionVisible && (
  <div className="modal-observacion-overlay">
    <div className="modal-observacion-content">
      <h3>ESCRIBA EL MOTIVO DE SU DECISIÓN</h3>
      <textarea
        placeholder="Escriba aquí su observación..."
        maxLength={300}
        value={observacionTexto}
        onChange={(e) => setObservacionTexto(e.target.value)}
      />
      <div className="modal-observacion-actions">
        <button onClick={() => setModalObservacionVisible(false)} className="cancelar-btn">
          Cancelar
        </button>
        <button
          onClick={() => {
            cambiarConformidad(trabajoADeclinar.id, 'pendiente');
            setModalObservacionVisible(false);
            setObservacionTexto('');
            setTrabajoADeclinar(null);
          }}
          className="enviar-btn"
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
)}
      {modalGrupoVisible && (
  <div className="modal-grupo-overlay">
    <div className="modal-grupo-content">
      <h3 className="modal-grupo-title">Integrantes del Grupo</h3>
      <ul className="modal-grupo-lista">
        {integrantesGrupo.length > 0 ? (
          integrantesGrupo.map((integrante, index) => (
            <li key={index}>
              <span className="modal-grupo-correo" style={{ display: 'inline' }}>
                {integrante.correo_institucional}
              </span>
              <span style={{ display: 'inline' }}> - </span>
              <span className="modal-grupo-nombre">
                {
                  (() => {
                    const encontrado = nombresMiembros.find(n =>
                      n.correo?.toLowerCase().trim() === integrante.correo_institucional.toLowerCase().trim()
                    );
                    return encontrado && encontrado.nombre && encontrado.nombre !== 'NO ENCONTRADO'
                      ? encontrado.nombre
                      : 'NOMBRE NO DISPONIBLE';
                  })()
                }
              </span>
            </li>
          ))
        ) : (
          <li className="modal-grupo-vacio">No hay integrantes registrados.</li>
        )}
      </ul>
      <div className="modal-grupo-actions">
        <button className="modal-grupo-btn cerrar" onClick={() => setModalGrupoVisible(false)}>
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
