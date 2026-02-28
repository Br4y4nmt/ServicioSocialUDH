import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../DashboardAlumno.css';
import '../../ModalGlobal.css';
import {
  alertWarning,
  toastWarning,
  alertError,
  mostrarRecomendacionEvidencia,
} from "../../../hooks/alerts/alertas";
import { showTopSuccessToast } from "../../../hooks/alerts/useWelcomeToast";
import VerBoton, { VerBotonInline } from "../../../hooks/componentes/VerBoton";
import PdfIcon from "../../../hooks/componentes/PdfIcon";
import { useUser } from '../../../UserContext';
import ModalDetalleActividad from '../../modals/ModalDetalleActividad';
import EvidenciaCameraIcon from "../../../hooks/componentes/Icons/EvidenciaCameraIcon";
import CheckSuccessIcon from "../../../hooks/componentes/Icons/CheckSuccessIcon";
import InfoTooltipIcon from "../../../hooks/componentes/Icons/InfoTooltipIcon";
import SpinnerIcon from "../../../hooks/componentes/Icons/SpinnerIcon";


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
  setActividadSeleccionada
}) => {

const [cartasMiembros, setCartasMiembros] = useState([]);
const estadoPlan = planSeleccionado?.estado;
const solicitudEnviada = planSeleccionado !== null;
const trabajoId = planSeleccionado?.id;
const { user } = useUser(); 
const token = user?.token; 
const [cargandoEvidencia, setCargandoEvidencia] = useState({});
const [actividadDetalle, setActividadDetalle] = useState(null);
const [enviandoSolicitudTermino, setEnviandoSolicitudTermino] = useState(false);
const [nombresMiembros, setNombresMiembros] = useState([]);

const verCartasMiembros = useCallback(
  async (trabajoId) => {
    if (!trabajoId || !token) return;

    try {
      const { data } = await axios.get(
        `/api/cartas-termino/grupo/${trabajoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  const obtenerNombresMiembros = useCallback(async (correos) => {
    if (!correos?.length || !token) return;
    
    try {
      const { data } = await axios.post(
        '/api/estudiantes/grupo-nombres',
        { correos },
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      setNombresMiembros(data);
    } catch (error) {
      console.error('Error al obtener nombres de los miembros:', error);
    }
  }, [token]);

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
  }, [cartasMiembros, obtenerNombresMiembros]);

  const nombresPorCorreos = useMemo(() => {
    const map = {};
    for (const n of nombresMiembros) {
      const key = (n.correo || '').trim().toLowerCase();
      map[key] = n.nombre;
    }
    return map;
  }, [nombresMiembros]);

  const getNombreMiembro = useCallback((codigoUniversitario) => {
    const correo = `${codigoUniversitario}@udh.edu.pe`.trim().toLowerCase();
    const nombre = nombresPorCorreos[correo];
    return nombre && nombre !== "NO ENCONTRADO" ? nombre : "NOMBRE NO DISPONIBLE";
  }, [nombresPorCorreos]);

  const actividadPorId = useMemo(() => {
    const map = new Map();
    actividadesSeguimiento.forEach(a => map.set(a.id, a));
    return map;
  }, [actividadesSeguimiento]);

  const handleEnviarEvidencia = useCallback(async (actividadId) => {
    if (cargandoEvidencia[actividadId]) return;

    setCargandoEvidencia(prev => ({ ...prev, [actividadId]: true }));

    const actividad = actividadPorId.get(actividadId);
    if (!actividad) {
      setCargandoEvidencia(prev => ({ ...prev, [actividadId]: false }));
      return;
    }

    const hoy = new Date();
    const fechaPermitida = new Date(actividad.fecha_fin_primero);
    const diferenciaEnMs = hoy - fechaPermitida;
    const diferenciaEnDias = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));
    const fechaPermitidaStr = actividad.fecha_fin_primero?.substring(0, 10);

    try {
      if (diferenciaEnDias < -5) {
        await alertWarning(
          'Demasiado pronto',
          `Solo puedes subir la evidencia desde 5 días antes de la fecha permitida (${fechaPermitidaStr}).`
        );
        return;
      }

      if (diferenciaEnDias > 10) {
        await alertError('Fecha vencida', `La fecha permitida (${fechaPermitidaStr}) ya venció. No es posible subir la evidencia.`);
        return;
      }

      if (!actividad.archivoTemporalEvidencia) {
        toastWarning('Falta evidencia', { text: 'Selecciona o sube una evidencia antes de enviar.' });
        return;
      }

      const formData = new FormData();
      formData.append('evidencia', actividad.archivoTemporalEvidencia);
      const fechaHoy = new Date().toISOString().split('T')[0];
      formData.append('fecha_fin', fechaHoy);
      formData.append('estado', 'pendiente');

      const res = await axios.post(
        `/api/cronograma/evidencia/${actividad.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActividadesSeguimiento(prev =>
        prev.map(a =>
          a.id === actividadId
            ? {
                ...a,
                evidencia: res.data.filename,
                fecha_fin: fechaHoy,
                estado: 'pendiente',
                archivoTemporalEvidencia: null
              }
            : a
        )
      );

      showTopSuccessToast('Evidencia enviada', 'Tu evidencia fue enviada correctamente');
    } catch (error) {
      console.error('Error al subir evidencia:', error);
      alertError('Error al subir evidencia', error.response?.data?.message || 'No se pudo subir la evidencia');
    } finally {
      setCargandoEvidencia(prev => ({ ...prev, [actividadId]: false }));
    }
  }, [token, cargandoEvidencia, setActividadesSeguimiento, actividadPorId]);

  const handleVerDetalleActividad = useCallback((actividad) => {
    setActividadDetalle(actividad);
  }, []);

  const handleSeleccionarEvidencia = useCallback(async (actividadId, index) => {
    await mostrarRecomendacionEvidencia();
    handleEvidencia(actividadId, index);
  }, [handleEvidencia]);

  const handleVerEvidencia = useCallback((evidenciaFilename) => {
    setImagenModal(`${process.env.REACT_APP_API_URL}/uploads/evidencias/${evidenciaFilename}`);
    setModalVisible(true);
  }, [setImagenModal, setModalVisible]);
    return (
        <div className="seguimiento-container">

            <p style={{ marginBottom: '15px', color: '#4A5568', textAlign: 'center' }}>
                Cronograma previamente registrado en tu plan de servicio social
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
                            <tr key={item.id}>                                
                               <td
                                className="celda-actividad-clickable"
                                onClick={() => handleVerDetalleActividad(item)}
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
                                            onClick={() => handleVerEvidencia(item.evidencia)}
                                        />
                                        </div>
                                    ) : item.archivoTemporalEvidencia ? (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                          <CheckSuccessIcon />
                                        </div>

                                    ) : (
                                        <button
                                          onClick={() => handleSeleccionarEvidencia(item.id, index)}
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
      onClick={() => handleEnviarEvidencia(item.id)}
      className="btn-enviar-evidenciasss"
      title="Enviar evidencia"
      disabled={cargandoEvidencia[item.id]}
    >
      {cargandoEvidencia[item.id] ? (
        <>
          <SpinnerIcon />
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
                        <p className="texto-cursiva">
                          Se aprobó correctamente su solicitud. Puede ver y descargar su documento de término de actividades.
                        </p>
                      ) : (
                        <p className="texto-cursiva">
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
        <InfoTooltipIcon />
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
  <div key={carta.codigo_universitario} className="documento-card">
    <div className="documento-info">
      <PdfIcon />
      <span className="titulo-pdf">
        DOCUMENTO DE APROBACION DE ACTIVIDADES (
        {getNombreMiembro(carta.codigo_universitario)}
        )
      </span>
    </div>

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
  </div>
))}

  </div>
)}
<ModalDetalleActividad
        actividad={actividadDetalle}
        onCerrar={() => setActividadDetalle(null)}
      />
</div> 
); 
};

export default SeguimientoActividades;
