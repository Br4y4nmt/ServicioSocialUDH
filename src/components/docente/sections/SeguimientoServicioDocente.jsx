import React, { useEffect, useState, useCallback, useRef } from 'react';
import Header from '../../layout/Header/Header';
import SidebarDocente from 'components/layout/Sidebar/SidebarDocente';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RevisionPlanSocial.css';
import VerBoton from "../../../hooks/componentes/VerBoton";
import { showTopSuccessToast } from '../../../hooks/alerts/useWelcomeToast';
import { useUser } from '../../../UserContext';
import {
  procesarAprobacionCartasTermino,
  obtenerFirmaDocenteBase64
} from '../../../services/cartaTerminoService';
import {
  alertconfirmacion,
  alertError,
  alertSuccess,
} from "../../../hooks/alerts/alertas";



function SeguimientoServicioDocente() {
  const [collapsed, setCollapsed] = useState(false);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  //const [cronogramas, setCronogramas] = useState([]);
  const [activeSection, setActiveSection] = useState('seguimiento');
  const [modalVisible, setModalVisible] = useState(false);
  const [cronogramaSeleccionado, setCronogramaSeleccionado] = useState([]);
  const [modalEvidenciaVisible, setModalEvidenciaVisible] = useState(false);
  const [imagenEvidencia, setImagenEvidencia] = useState('');
  const [observacion, setObservacion] = useState('');
  const observacionRef = useRef(null);
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState(null);
  const [modalObservacionVisible, setModalObservacionVisible] = useState(false);
  //const [planPDF] = useState(null);
  //const [fechaPDF] = useState('');
  const { user } = useUser();  
  const token = user?.token; 
  const [firmaDocente, setFirmaDocente] = useState('');
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [nombresMiembros, setNombresMiembros] = useState([]);
  const [isAprobando, setIsAprobando] = useState(false);
  const [progresoAprobacion, setProgresoAprobacion] = useState({ actual: 0, total: 0, mensaje: '' });


  const handleVerGrupo = async (trabajoId) => {
  try {
    const response = await axios.get(`/api/integrantes/${trabajoId}`, {
      headers: { Authorization: `Bearer ${token}` }  
    });

    const integrantes = response.data;
    setIntegrantesGrupo(integrantes);
    setModalGrupoVisible(true);
    const correos = integrantes.map(i => i.correo_institucional);
    const { data: nombres } = await axios.post(`${process.env.REACT_APP_API_URL}/api/estudiantes/grupo-nombres`, {
      correos
    });

    setNombresMiembros(nombres);
    
  } catch (error) {
    console.error('Error al obtener integrantes del grupo:', error);
    alert('No se pudieron cargar los integrantes del grupo');
  }
};

const cerrarModalGrupo = useCallback(() => {
  setModalGrupoVisible(false);
  setIntegrantesGrupo([]);
}, []);

const toggleSidebar = useCallback(() => {
  setCollapsed(prev => !prev);
}, []);


const actualizarSolicitud = useCallback(async (trabajoId, nuevoEstado, plan) => {
  if (isAprobando) return;

  try {
    if (nuevoEstado === "rechazada") {
      const result = await alertconfirmacion({
        title: 'Rechazar solicitud',
        text: '¿Deseas rechazar esta solicitud de término? Esta acción no se puede deshacer.',
        icon: 'warning',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
      });
      if (!result.isConfirmed) return;
    }

    if (nuevoEstado === "aprobada") {
      setIsAprobando(true);
      setProgresoAprobacion({ actual: 0, total: 0, mensaje: "Iniciando aprobación..." });
      await new Promise((r) => setTimeout(r, 50));
    }

    await axios.patch(
      `/api/trabajo-social/${trabajoId}/respuesta-carta-termino`,
      { solicitud_termino: nuevoEstado },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTrabajosSociales((prev) =>
      prev.map((t) => (t.id === trabajoId ? { ...t, solicitud_termino: nuevoEstado } : t))
    );

    if (nuevoEstado === "aprobada") {
      try {
        await procesarAprobacionCartasTermino({
          plan,
          firmaBase64: firmaDocente,
          token,
          onProgreso: setProgresoAprobacion
        });
      } catch (err) {
        if (err.message === 'SERVIDOR_UDH_NO_DISPONIBLE') {
          await Swal.fire({
            icon: "error",
            title: "Servidor UDH inalcanzable",
            text: "La conexión con el servidor de la UDH falló. Intenta nuevamente más tarde.",
          });
          return;
        }
        if (err.message === 'SIN_DATOS_INTEGRANTES') {
          await Swal.fire({
            icon: "warning",
            title: "Servidor UDH no respondió",
            text: "No se pudieron obtener los datos de los integrantes. Intenta más tarde.",
          });
          return;
        }
        throw err;
      }

      setIsAprobando(false);
      setProgresoAprobacion({ actual: 0, total: 0, mensaje: "" });
      await new Promise((r) => setTimeout(r, 50));
    }

    await Swal.fire({
      icon: "success",
      title: "Solicitud actualizada",
      text: `La solicitud fue ${nuevoEstado === "aprobada" ? "aprobada" : "rechazada"} correctamente.`,
      timer: 2500,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

  } catch (error) {
    console.error("Error al actualizar solicitud:", error);
    setIsAprobando(false);
    setProgresoAprobacion({ actual: 0, total: 0, mensaje: "" });

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo actualizar la solicitud de término.",
    });
  }
}, [isAprobando, token, firmaDocente]);



  useEffect(() => {
    const cargarDatos = async () => {
      const usuarioId = localStorage.getItem('id_usuario');
      if (!usuarioId || !token) return;

      try {
        const { data: docente } = await axios.get(`/api/docentes/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const firmaBase64 = await obtenerFirmaDocenteBase64(docente.firma, token);
        setFirmaDocente(firmaBase64);

        const { data: trabajos } = await axios.get(`/api/trabajo-social/docente/${docente.id_docente}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrabajosSociales(trabajos);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };

    cargarDatos();
  }, [token]);


const handleVerSeguimiento = (trabajoId) => {
  axios.get(`/api/cronograma/trabajo/${trabajoId}`, {
    headers: { Authorization: `Bearer ${token}` } 
  })
    .then(res => {
      setCronogramaSeleccionado(res.data);
      setModalVisible(true);
    })
    .catch(err => console.error('Error al obtener cronograma:', err));
};


const handleVerEvidencia = (nombreArchivo) => {
  setImagenEvidencia(`${process.env.REACT_APP_API_URL}/uploads/evidencias/${nombreArchivo}`);
  setModalEvidenciaVisible(true);
};

const handleCerrarModalEvidencia = () => {
  setModalEvidenciaVisible(false);
  setImagenEvidencia('');
};


  const handleCloseModal = () => {
    setModalVisible(false);
    setCronogramaSeleccionado([]);
  };


const handleAprobar = async (actividadId) => {
  const result = await alertconfirmacion({
    title: 'Aprobar actividad',
    text: '¿Estás seguro de aprobar esta actividad? Se marcará como aprobada.',
    icon: 'question',
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) return;

  try {
    await axios.patch(
      `/api/cronograma/${actividadId}/estado`,
      { estado: "aprobado" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setCronogramaSeleccionado((prev) =>
      prev.map((act) =>
        act.id === actividadId ? { ...act, estado: "aprobado" } : act
      )
    );
    showTopSuccessToast(
      "¡Aprobado!",
      "La actividad fue aprobada correctamente."
    );
  } catch (err) {
    console.error("Error al aprobar:", err);
    await alertError('Error al aprobar', 'No se pudo aprobar la actividad.');
  }
};



const handleAbrirObservacion = (actividadId) => {
  setActividadSeleccionadaId(actividadId);
  setModalObservacionVisible(true);
};

const handleEnviarObservacion = () => {
  if (!observacion.trim()) {
    if (observacionRef && observacionRef.current) {
      observacionRef.current.setCustomValidity('Debes ingresar una observación antes de enviar.');
      observacionRef.current.reportValidity();
      observacionRef.current.setCustomValidity('');
    }
    return;
  }

  axios.patch(
    `/api/cronograma/${actividadSeleccionadaId}/observacion`,
    { observacion },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  .then(async () => {
    setCronogramaSeleccionado(prev =>
      prev.map(act =>
        act.id === actividadSeleccionadaId
          ? { ...act, estado: 'observado', observacion }
          : act
      )
    );

    await alertSuccess('Observación registrada', 'La observación se registró correctamente.');
    setModalObservacionVisible(false);
    setObservacion('');
  })
  .catch(err => {
    console.error('Error al guardar observación:', err);
    alertError('Error al guardar observación', 'No se pudo guardar la observación. Intenta nuevamente.');
  });
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
    onClick={() => toggleSidebar()} 
  ></div>
)}
     <main className={`main-content${window.innerWidth <= 768 && !collapsed ? ' sidebar-open' : collapsed ? ' collapsed' : ''}`}>
        <div className="conformidad-container">
          <div className="conformidad-card">
            <h1 className="conformidad-title">Seguimiento del Servicio Social</h1>

            <div className="conformidad-table-wrapper">
              {trabajosSociales.length > 0 ? (
                <table className="conformidad-table">
                  <thead className="conformidad-table-thead">
                    <tr>
                      <th>Alumnos</th>
                      <th>Programa Académico</th>
                      <th>Servicio Social</th>
                      <th>Tipo Servicio Social</th>
                      <th>Seguimiento</th>
                      <th>Solicitud de Término</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {trabajosSociales.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.Estudiante?.nombre_estudiante || 'No disponible'}</td>
                        <td>{plan.ProgramasAcademico?.nombre_programa || 'No definido'}</td>
                        <td>{plan.LaboresSociale?.nombre_labores || 'No definido'}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <span>{plan.tipo_servicio_social}</span>
                            {plan.tipo_servicio_social === 'grupal' && (
                                <VerBoton
                                  onClick={() => handleVerGrupo(plan.id)}
                                  label="Ver"
                                />
                              )}
                          </div>
                        </td>
                        <td>
                        <VerBoton onClick={() => handleVerSeguimiento(plan.id)} />
                      </td>
                        <td>
                  {plan.solicitud_termino === 'solicitada' ? (
                  <div className="contenedor-botones-termino">
                    <button
                    className="btn-aceptar-termino"
                    disabled={isAprobando}
                    onClick={async () => {
                      const result = await alertconfirmacion({
                        title: 'Aceptar solicitud',
                        text: '¿Deseas aceptar esta solicitud de término?',
                        icon: 'question',
                        confirmButtonText: 'Sí, aceptar',
                        cancelButtonText: 'Cancelar'
                      });
                      if (result.isConfirmed) {
                        actualizarSolicitud(plan.id, "aprobada", plan);
                      }
                    }}
                  >
                    {isAprobando ? 'Procesando...' : 'Aceptar'}
                  </button>
                   <button
                    className="btn-rechazar-termino"
                    disabled={isAprobando}
                    onClick={() => actualizarSolicitud(plan.id, 'rechazada')}
                  >
                    Rechazar
                  </button>
                  </div>
          ) : (
            <span className="estado-termino">
            {plan.solicitud_termino === 'aprobada' ? (
              <span className="estado-label estado-aprobada">APROBADA</span>
            ) : plan.solicitud_termino === 'rechazada' ? (
              <span className="estado-label estado-rechazada">RECHAZADA</span>
            ) : (
              <span className="estado-label estado-no-solicitada">No solicitada</span>
            )}
          </span>
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
        </div>
      </main>


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
        <button className="modal-grupo-btn cerrar" onClick={cerrarModalGrupo}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{modalVisible && (
  <div className="modal-cronograma-overlay">
    <div className="modal-cronograma-content">
      <h3 className="modal-cronograma-title">Cronograma de Actividades</h3>
      {cronogramaSeleccionado.length > 0 ? (
        <div className="modal-cronograma-table-wrapper">
          <table className="modal-cronograma-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Actividad</th>
                <th>Justificación</th>
                <th>Fecha</th>
                <th>Fecha Fin</th>
                <th>Resultados</th>
                <th>Estado</th>
                <th>Evidencia</th>
              </tr>
            </thead>
            <tbody>
              {cronogramaSeleccionado.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.actividad}</td>
                  <td>{item.justificacion}</td>
                  <td>{item.fecha}</td>
                  <td>{item.fecha_fin || 'No registrada'}</td>
                  <td>{item.resultados}</td>
                  <td>
                  {item.estado === 'aprobado' ? (
                    <button className="btn-estado-aprobado" disabled>Aprobado</button>
                  ) : item.estado === 'observado' ? (
                    <button className="btn-estado-observado" disabled>Observado</button>
                  ) : item.evidencia ? (
                    <div className="estado-acciones">
                      <button className="btn-aprobar-estado" disabled={isAprobando} onClick={() => handleAprobar(item.id)}>
                        Aprobar
                      </button>
                      <button
                        className="btn-observar-estado"
                        disabled={isAprobando}
                        onClick={() => handleAbrirObservacion(item.id)}
                      >
                        Observar
                      </button>

                    </div>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#aaa' }}>Sin evidencia</span>
                  )}
                </td>
                  <td>
                  {item.evidencia ? (
                    <VerBoton onClick={() => handleVerEvidencia(item.evidencia)} />
                  ) : (
                    <span style={{ fontSize: '12px', color: '#aaa' }}>No enviada</span>
                  )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="modal-cronograma-empty">No hay cronograma disponible para este trabajo social.</p>
      )}
      <div className="modal-cronograma-actions">
        <button className="modal-cronograma-btn-cerrar" onClick={handleCloseModal}>Cerrar</button>
      </div>
    </div>
  </div>
)}


{modalEvidenciaVisible && (
  <div className="modal-evidencia-overlay">
    <div className="modal-evidencia-content">
      <h3 className="modal-evidencia-title">Evidencia</h3>
      <img src={imagenEvidencia} alt="Evidencia" className="modal-evidencia-img" />
      <div className="modal-evidencia-actions">
        <button className="modal-evidencia-btn-cerrar" onClick={handleCerrarModalEvidencia}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


{modalObservacionVisible && (
  <div className="modal-observacion-overlay">
    <div className="modal-observacion-content">
      <h3>Observación</h3>
      <textarea
        ref={observacionRef}
        required
        className="modal-observacion-textarea"
        value={observacion}
        onChange={(e) => setObservacion(e.target.value)}
        placeholder="Escribe tu observación aquí..."
      />
      <div className="modal-observacion-actions">
        <button className="modal-observacion-btn" onClick={handleEnviarObservacion}>Enviar</button>
        <button className="modal-observacion-btn-cancelar" onClick={() => setModalObservacionVisible(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}

{isAprobando && (
  <div className="overlay-loading">
    <div className="loading-box">
      <div className="spinner" />

      <p className="loading-title">Generando documentos...</p>
      <p className="loading-subtitle">{progresoAprobacion.mensaje}</p>

      {progresoAprobacion.total > 0 && (
        <>
          <div className="loading-progress">
            <div
              className="loading-progress__bar"
              style={{
                width: `${Math.round((progresoAprobacion.actual / progresoAprobacion.total) * 100)}%`,
              }}
            />
          </div>

          <p className="loading-subtitle">
            Progreso: {progresoAprobacion.actual}/{progresoAprobacion.total}
          </p>
        </>
      )}

      <p className="loading-hint">No cierres esta ventana hasta que termine.</p>
    </div>
  </div>
)}

    </>
  );
}

export default SeguimientoServicioDocente;
