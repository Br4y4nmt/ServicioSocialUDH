import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './DashboardAlumno.css';
import './ModalGlobal.css';
import {
  mostrarAlertaDemasiadoPronto,
  mostrarAlertaFechaVencida,
  mostrarAlertaFaltaEvidencia,
  mostrarAlertaEvidenciaSubida,
  mostrarAlertaErrorEvidencia, 
  mostrarRecomendacionEvidencia,
} from "../hooks/alerts/alertas";
import VerBoton, { VerBotonInline } from "../hooks/componentes/VerBoton";
import PdfIcon from "../hooks/componentes/PdfIcon";
import { useUser } from '../UserContext';
import ReactDOM from 'react-dom';
import EvidenciaCameraIcon from "../hooks/componentes/Icons/EvidenciaCameraIcon";
import CheckSuccessIcon from "../hooks/componentes/Icons/CheckSuccessIcon";


const SeguimientoActividades = ({
  actividadesSeguimiento,
  hayObservaciones,
  handleEvidencia,
  setImagenModal, 
  setModalVisible,
  solicitarCartaTermino,
  todasAprobadas,
  estadoSolicitudTermino,
  planSeleccionado,
  setObservacionSeleccionada,
  setModalObservacionEstudianteVisible,
  setActividadesSeguimiento,
  actividadSeleccionada,
  setActividadSeleccionada,
  handleVolverASubir
}) => {

const [cartasMiembros, setCartasMiembros] = useState([]);
const estadoPlan = planSeleccionado?.estado;
const solicitudEnviada = planSeleccionado !== null;
const trabajoId = planSeleccionado?.id;
const { user } = useUser(); 
const token = user?.token; 
const [cargandoEvidencia, setCargandoEvidencia] = useState([]);
const [modalActividadVisible, setModalActividadVisible] = useState(false);
const [actividadDetalle, setActividadDetalle] = useState(null);
const [enviandoSolicitudTermino, setEnviandoSolicitudTermino] = useState(false);
const [nombresMiembros, setNombresMiembros] = useState([]);

const verCartasMiembros = useCallback(
  async (trabajoId) => {
    if (!trabajoId || !token) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/cartas-termino/grupo/${trabajoId}`,
        {
          headers: { Authorization: `Bearer ${token}` }  
        }
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setCartasMiembros(data);
      } else {
        setCartasMiembros([]);
        if (estadoPlan === 'aceptado') {
          Swal.fire('Sin cartas', 'No se encontraron cartas de aceptación del grupo.', 'info');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', 'No se pudo cargar las cartas del grupo.', 'error');
    }
  },
  [token, estadoPlan] 
);

  const obtenerNombresMiembros = async (correos) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/estudiantes/grupo-nombres`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correos })
      });

      const data = await response.json();
      setNombresMiembros(data);
    } catch (error) {
      console.error('Error al obtener nombres de los miembros:', error);
    }
  };

useEffect(() => {
  if (solicitudEnviada && trabajoId) {
    verCartasMiembros(trabajoId);
  }
}, [solicitudEnviada, trabajoId, verCartasMiembros]);



  useEffect(() => {
    if (cartasMiembros.length > 0) {
      const correos = cartasMiembros.map(c => `${c.codigo_universitario}@udh.edu.pe`);
      obtenerNombresMiembros(correos);
    }
  }, [cartasMiembros]);
    return (
        <div className="seguimiento-container">

            <p style={{ marginBottom: '15px', color: '#4A5568', textAlign: 'center' }}>
                A continuación se muestra el cronograma previamente registrado en tu plan de servicio social
            </p>
          <div className="tabla-cronograma-wrapper-se">
            <table className="tabla-cronograma-se">
                <thead>
                    <tr>
                        <th>Actividad</th>
                        <th>Justificación</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Fin Permitida</th>
                        <th>Fecha Termino</th>
                        <th>Resultados Esperados</th>
                        <th>Evidencia</th>
                        <th>Revision</th>
                        {hayObservaciones && <th>Observación</th>}
                    </tr>
                </thead>
                <tbody>
                    {actividadesSeguimiento.length > 0 ? (
                        actividadesSeguimiento.map((item, index) => (
                            <tr key={index}>                                
                               <td
                                className="celda-actividad-clickable"
                                onClick={() => {
                                    setActividadDetalle(item);
                                    setModalActividadVisible(true);
                                }}
                                title="Ver detalles"
                                >
                                {item.actividad.length > 10 ? item.actividad.slice(0, 10) + '...' : item.actividad}
                                </td>
                                <td>{item.justificacion.length > 10 ? item.justificacion.slice(0, 10) + '...' : item.justificacion}</td>
                                <td style={{ fontSize: '13px' }}>{item.fecha}</td>
                                <td>
                                  {item.fecha_fin_primero ? (
                                    <span className="fecha-fin-permitida">
                                      {item.fecha_fin_primero?.substring(0, 10)}
                                    </span>
                                  ) : (
                                    <span className="fecha-no-asignada">No asignada</span>
                                  )}
                                </td>
                                <td>
                                  {item.fecha_fin ? (
                                    <span className="fecha-fin-real">
                                      {item.fecha_fin}
                                    </span>
                                  ) : (
                                    <span className="fecha-sin-completar">
                                      Sin completar
                                    </span>
                                  )}
                                </td>
                                <td>{item.resultados.length > 10 ? item.resultados.slice(0, 10) + '...' : item.resultados}</td>
                                <td style={{ textAlign: 'center' }}>
                                    {item.evidencia ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                            <span title="Evidencia cargada" style={{ fontSize: '18px', color: '#38a169' }}>

                                            </span>
                                            <VerBoton
                                            label="Ver"
                                            onClick={() => {
                                                setImagenModal(`${process.env.REACT_APP_API_URL}/uploads/evidencias/${item.evidencia}`);
                                                setModalVisible(true);
                                            }}
                                        />
                                        </div>
                                    ) : item.archivoTemporalEvidencia ? (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                          <CheckSuccessIcon />
                                        </div>

                                    ) : (
                                        <button
                                          onClick={async () => {
                                            await mostrarRecomendacionEvidencia();
                                            handleEvidencia(item.id, index);
                                          }}
                                          className="btn-evidencia-camara"
                                          title="Seleccionar evidencia"
                                        >
                                          <EvidenciaCameraIcon />
                                        </button>

                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {item.evidencia && item.estado === 'pendiente' ? (
                                        <button
                                          className="btn-estado-pendiente"
                                          disabled
                                        >
                                          Pendiente
                                        </button>
                                    ) : item.evidencia && item.estado === 'aprobado' ? (
                                        <button
                                          className="btn-estado-aprobado"
                                          disabled
                                        >
                                          Aprobado
                                        </button>
                                    ) :  item.evidencia && item.estado === 'observado' ? (
                                    <button
                                        className="btn-estado-observado-actividad"
                                        disabled
                                    >
                                        Observado
                                    </button>
                                    ) : (
                                        
    <button
  onClick={async () => {
    if (cargandoEvidencia[index]) return;

    const newCargando = [...cargandoEvidencia];
    newCargando[index] = true;
    setCargandoEvidencia(newCargando);

    const actividad = actividadesSeguimiento[index];
    const hoy = new Date();
    const fechaPermitida = new Date(actividad.fecha_fin_primero);
    const diferenciaEnMs = hoy - fechaPermitida;
    const diferenciaEnDias = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));

    const fechaPermitidaStr = actividad.fecha_fin_primero?.substring(0, 10);

    if (diferenciaEnDias < -5) {
      await mostrarAlertaDemasiadoPronto(fechaPermitidaStr);
      newCargando[index] = false;
      setCargandoEvidencia(newCargando);
      return;
    }

    if (diferenciaEnDias > 10) {
      await mostrarAlertaFechaVencida(fechaPermitidaStr);
      newCargando[index] = false;
      setCargandoEvidencia(newCargando);
      return;
    }

    if (!actividad.archivoTemporalEvidencia) {
      await mostrarAlertaFaltaEvidencia();
      newCargando[index] = false;
      setCargandoEvidencia(newCargando);
      return;
    }

    const formData = new FormData();
    formData.append('evidencia', actividad.archivoTemporalEvidencia);
    const fechaHoy = new Date().toISOString().split('T')[0];
    formData.append('fecha_fin', fechaHoy);
    formData.append('estado', 'pendiente');

    try {
      const res = await axios.post(
        `/api/cronograma/evidencia/${actividad.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const updated = [...actividadesSeguimiento];
      updated[index].evidencia = res.data.filename;
      updated[index].fecha_fin = fechaHoy;
      updated[index].estado = 'pendiente';
      updated[index].archivoTemporalEvidencia = null;
      setActividadesSeguimiento(updated);

      await mostrarAlertaEvidenciaSubida();

    } catch (error) {
      console.error('Error al subir evidencia:', error);
      await mostrarAlertaErrorEvidencia();

    } finally {
      newCargando[index] = false;
      setCargandoEvidencia(newCargando);
    }
  }}
  className="btn-enviar-evidenciasss"
  title="Enviar evidencia"
  disabled={cargandoEvidencia[index]}
>
  {cargandoEvidencia[index] ? (
    <>
      <svg className="spinner" width="16" height="16" viewBox="0 0 50 50">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#4A5568"
          strokeWidth="5"
          strokeDasharray="90 150"
          strokeLinecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="0.75s"
            from="0 25 25"
            to="360 25 25"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
      <span style={{ marginLeft: '8px' }}>Enviando...</span>
    </>
  ) : (
    'Enviar'
  )}
</button>

     )}
    </td>
                                {hayObservaciones && (
                                    <td style={{ textAlign: 'center' }}>
                                        {item.estado === 'observado' && item.observacion ? (
                                            <VerBoton
                                            label="Ver"
                                            onClick={() => {
                                              setObservacionSeleccionada(item.observacion);
                                              setActividadSeleccionada(item);
                                              setModalObservacionEstudianteVisible(true);
                                            }}
                                          />
                                        ) : null}
                                    </td>
                                )}

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', color: '#999' }}>
                                No se han registrado actividades.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
           {todasAprobadas && estadoSolicitudTermino === 'no_solicitada' && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                className="btn-carta-termino"
                onClick={async () => {
                  setEnviandoSolicitudTermino(true);
                  try {
                    await Promise.resolve(solicitarCartaTermino());
                  } finally {
                    setTimeout(() => setEnviandoSolicitudTermino(false), 1000);
                  }
                }}
                disabled={enviandoSolicitudTermino}
              >
                {enviandoSolicitudTermino ? (
                  <>
                    <span
                      className="spinner-border-conformidad"
                      role="status"
                      aria-hidden="true"
                      style={{
                        marginRight: '6px',
                        verticalAlign: 'middle'
                      }}
                    ></span>
                    Enviando...
                  </>
                ) : (
                  'Solicitar Documento De Término'
                )}
              </button>
            </div>
          )}

            {(estadoSolicitudTermino === 'solicitada' || estadoSolicitudTermino === 'aprobada') && (
                <div className="respuesta-asesor-cardss">
                    <div className="respuesta-asesor-header">
                        <div className="respuesta-icono-titulo">
                        <i className="fas fa-info-circle icono-azul" /> 
                        <span className="respuesta-asesor-title">Solicitud enviada al docente:</span>
                        </div>
                        <div className="contenedores-boton-ver">
                            {planSeleccionado?.carta_termino_pdf && (
                                <VerBotonInline
                                label="Ver"
                                onClick={() => {
                                  window.open(
                                    `${process.env.REACT_APP_API_URL}/uploads/cartas_termino/${planSeleccionado.carta_termino_pdf}`,
                                    '_blank'
                                  );
                                }}
                              />
                            )}

                            <button
                          className={`respuesta-asesor-btn estado-${estadoSolicitudTermino}`}
                          disabled
                        >
                          {estadoSolicitudTermino.charAt(0).toUpperCase() + estadoSolicitudTermino.slice(1)}
                        </button>
                        </div>
                    </div>

                    <div style={{ marginTop: '0px', paddingLeft: '32px' }}>
                        <p><strong>Aprobación de Actividades: </strong></p>
                        {estadoSolicitudTermino === 'aprobada' ? (
                        <p className="texto-solicitud-aprobada">
                          Se aprobó correctamente su solicitud. Puede ver y descargar su documento de término de actividades.
                        </p>
                      ) : (
                        <p className="texto-solicitud-aprobada">
                          Tu solicitud fue enviada correctamente. El docente revisará tu cronograma antes de aprobar la carta.
                        </p>
                      )}
      </div>
    </div>
  )}
  {estadoSolicitudTermino === 'aprobada' && (
  <div className="seccion-documentos-designacion">
    <div className="seccion-header">
      <span className="check-circle">
        <i className="fas fa-check"></i>
      </span>

       <h3>
        {cartasMiembros.length > 1 ? 'Cartas de término del grupo' : 'DOCUMENTOS DE APROBACIÓN DE ACTIVIDADES'}
      </h3>
      <div className="info-tooltip">
        <svg className="info-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z" fill="currentColor"></path>
          <path d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="currentColor"></path>
          <path fillRule="evenodd" clipRule="evenodd" d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z" fill="currentColor"></path>
        </svg>
        <div className="tooltip-text">
          Aquí podrás visualizar las cartas de término generadas para todos los miembros del grupo.
        </div>
      </div>
    </div>

    <div className="documento-card">
  <div className="documento-info">
    <PdfIcon />
    <span className="titulo-pdf">
      DOCUMENTO DE APROBACION DE ACTIVIDADES (ESTUDIANTE PRINCIPAL)
    </span>
  </div>
  <div className="acciones-doc">
    <VerBotonInline
      onClick={() =>
        window.open(
          `${process.env.REACT_APP_API_URL}/uploads/cartas_termino/${planSeleccionado.carta_termino_pdf}`,
          "_blank"
        )
      }
    />
    <span className="estado-tramitado">Tramitado</span>
  </div>
</div>


 {cartasMiembros.map((carta, index) => (
  <div key={index} className="documento-card">
    <div className="documento-info">
      <PdfIcon />
      <span className="titulo-pdf">
        DOCUMENTO DE APROBACION DE ACTIVIDADES (
        {
          (() => {
            const correo = `${carta.codigo_universitario}@udh.edu.pe`.trim().toLowerCase();
            const miembro = nombresMiembros.find(n =>
              n.correo?.trim().toLowerCase() === correo
            );
            return miembro && miembro.nombre && miembro.nombre !== 'NO ENCONTRADO'
              ? miembro.nombre
              : 'NOMBRE NO DISPONIBLE';
          })()
        }
        )
      </span>
    </div>
    <div className="acciones-doc">
      <div className="acciones-doc">
      <VerBotonInline
        onClick={() =>
          window.open(
            `${process.env.REACT_APP_API_URL}/uploads/cartas_termino_integrantes/${carta.nombre_archivo_pdf}`,
            "_blank"
          )
        }
      />
      <span className="estado-tramitado">Tramitado</span>
    </div>

      <span className="estado-tramitado">Tramitado</span>
    </div>
  </div>
))}
  </div>
)}
{modalActividadVisible && actividadDetalle && ReactDOM.createPortal(
  <div className="detalle-actividad-overlay">
    <div className="detalle-actividad-modal">
      <h3>Detalle de Actividad</h3>
      <p><strong>Actividad:</strong> {actividadDetalle.actividad}</p>
      <p><strong>Justificación:</strong> {actividadDetalle.justificacion}</p>
      <p><strong>Fecha Inicio:</strong> {actividadDetalle.fecha}</p>
      <p>
        <strong>Fecha Fin Permitida:</strong>{' '}
        {actividadDetalle.fecha_fin_primero
            ? actividadDetalle.fecha_fin_primero.substring(0, 10)
            : 'No asignada'}
        </p>
      <p><strong>Fecha Término:</strong> {actividadDetalle.fecha_fin || 'Sin completar'}</p>
      <p><strong>Resultados Esperados:</strong> {actividadDetalle.resultados}</p>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="detalle-actividad-btn-cerrar" onClick={() => setModalActividadVisible(false)}>
          Cerrar
        </button>
      </div>
    </div>
  </div>,
  document.body
)}
</div> 
); 
};

export default SeguimientoActividades;
