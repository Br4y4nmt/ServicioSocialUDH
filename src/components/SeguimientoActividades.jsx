import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './DashboardAlumno.css';
import './ModalGlobal.css';
import { useUser } from '../UserContext';

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




const verCartasMiembros = async (trabajoId) => {
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
  };

 useEffect(() => {
    if (solicitudEnviada && trabajoId) {
      verCartasMiembros(trabajoId);
    }
  }, [solicitudEnviada, trabajoId, token]);

    return (
        <div className="seguimiento-container">

            <p style={{ marginBottom: '15px', color: '#4A5568', textAlign: 'center' }}>
                A continuación se muestra el cronograma previamente registrado en tu plan de servicio social
            </p>

            <table className="tabla-cronograma">
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
                                
                                <td>{item.actividad.length > 10 ? item.actividad.slice(0, 10) + '...' : item.actividad}</td>
                                <td>{item.justificacion.length > 10 ? item.justificacion.slice(0, 10) + '...' : item.justificacion}</td>
                                <td style={{ fontSize: '13px' }}>{item.fecha}</td>
                                <td>
                                {item.fecha_fin_primero ? (
                                    <span
                                    style={{
                                        backgroundColor: '#F7FAFC',
                                        color: '#2D3748',
                                        padding: '4px 10px',
                                        border: '1px solid #CBD5E0',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        display: 'inline-block',
                                        fontWeight: '500'
                                    }}
                                    >
                                    {item.fecha_fin_primero?.substring(0, 10)}
                                    </span>
                                ) : (
                                    <span style={{ color: '#A0AEC0', fontStyle: 'italic' }}>No asignada</span>
                                )}
                                </td>
                                <td>
                                    {item.fecha_fin ? (
                                        <span style={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #CBD5E0', 
                                            borderRadius: '6px',
                                            padding: '4px 12px',
                                            display: 'inline-block',
                                            fontWeight: '500',
                                            color: '#1A202C',
                                            fontSize: '12px' 
                                        }}>
                                            {item.fecha_fin}
                                        </span>
                                    ) : (
                                        <span style={{
                                            color: '#A0AEC0',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px dashed #CBD5E0',
                                            borderRadius: '6px',
                                            padding: '2px 8px',
                                            display: 'inline-block'
                                        }}>
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
                                            <button
                                                onClick={() => {
                                                    setImagenModal(`${process.env.REACT_APP_API_URL}/uploads/evidencias/${item.evidencia}`);
                                                    setModalVisible(true);
                                                }}
                                                className="btn-ver-evidencia"
                                                title="Ver evidencia"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 5c-7.633 0-11 6.994-11 7s3.367 7 11 7 11-6.994 11-7-3.367-7-11-7zm0 12
                                        c-2.761 0-5-2.239-5-5s2.239-5 
                                        5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
                                        3 3 0 0 0 0-6z" />
                                                </svg>
                                                Ver
                                            </button>
                                        </div>
                                    ) : item.archivoTemporalEvidencia ? (
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#38a169" viewBox="0 0 24 24">
                                                <path d="M20.285 2.857L9 14.143 3.714 8.857 2.3 10.271 9 16.971l12-12z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <button
                                        onClick={async () => {
                                            await Swal.fire({
                                                icon: 'info',
                                                title: 'Recomendación para la evidencia',
                                                text: 'La evidencia fotográfica debe mostrar claramente al estudiante realizando la actividad correspondiente. Asegúrate de que la imagen sea nítida y representativa de la tarea realizada.',
                                                confirmButtonText: 'Entendido'
                                            });
                                            handleEvidencia(item.id, index);
                                        }}
                                        className="btn-evidencia-camara"
                                        title="Seleccionar evidencia"
                                    >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4A5568" viewBox="0 0 24 24">
                                                <path d="M21 5h-3.586l-1.707-1.707A.997.997 0 0 0 15 3H9a.997.997 0 0 0-.707.293L6.586 5H3
                 c-1.103 0-2 .897-2 2v12a2 2 0 0 0 2 2h18c1.103 0 2-.897 2-2V7a2 2 0 0 0-2-2zm0
                 14H3V7h4.586l1.707-1.707L9.999 5h4.002l1.707 1.707L16.414 7H21v12z" />
                                                <path d="M12 8a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    {item.evidencia && item.estado === 'pendiente' ? (
                                        <button
                                            className="btn-estado-pendiente"
                                            style={{
                                                backgroundColor: '#a0aec0',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                cursor: 'default'
                                            }}
                                            disabled
                                        >
                                            Pendiente
                                        </button>
                                    ) : item.evidencia && item.estado === 'aprobado' ? (
                                        <button
                                            className="btn-estado-aprobado"
                                            style={{
                                                backgroundColor: '#38a169',
                                                color: '#fff',
                                                border: 'none',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                cursor: 'default'
                                            }}
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
                                                const actividad = actividadesSeguimiento[index];
                                               
                                        const hoy = new Date();
                                        const fechaPermitida = new Date(actividad.fecha_fin_primero);

                                    
                                        const diferenciaEnMs = hoy - fechaPermitida;
                                        const diferenciaEnDias = Math.floor(diferenciaEnMs / (1000 * 60 * 60 * 24));

                                        if (diferenciaEnDias < -5) {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Demasiado pronto',
                                            text: `Solo puedes subir la evidencia desde 5 días antes de la fecha permitida (${actividad.fecha_fin_primero?.substring(0, 10)}).`,
                                            confirmButtonText: 'Entendido'
                                        });
                                        return;
                                        }

                                        if (diferenciaEnDias > 10) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Fecha vencida',
                                            text: `La fecha máxima para subir la evidencia era hasta 10 días después de la fecha permitida (${actividad.fecha_fin_primero?.substring(0, 10)}).`,
                                            confirmButtonText: 'Aceptar'
                                        });
                                        return;
                                        }
                                                if (!actividad.archivoTemporalEvidencia) {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Falta evidencia',
                                                        text: 'Selecciona una evidencia antes de confirmar.',
                                                        confirmButtonText: 'Aceptar'
                                                    });
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
            headers: { Authorization: `Bearer ${token}` }  // Usamos el token del contexto
        }
    );

    // Actualiza el estado con la nueva evidencia
    const updated = [...actividadesSeguimiento];
    updated[index].evidencia = res.data.filename;
    updated[index].fecha_fin = fechaHoy;
    updated[index].estado = 'pendiente';
    updated[index].archivoTemporalEvidencia = null;
    setActividadesSeguimiento(updated);

    Swal.fire({
        icon: 'success',
        title: 'Evidencia subida',
        text: 'Actividad marcada como pendiente de revisión.',
        timer: 1500,
        showConfirmButton: false
    });
} catch (error) {
    console.error('Error al subir evidencia:', error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo subir la evidencia.'
    });
                                                }
                                            }}
                                            className="btn-enviar-evidenciasss"
                                            title="Enviar evidencia"
                                        >
                                            Enviar
                                        </button>
                                    )}
                                </td>


                                {hayObservaciones && (
                                    <td style={{ textAlign: 'center' }}>
                                        {item.estado === 'observado' && item.observacion ? (
                                            <button
                                                className="btn-ver-evidencia"
                                                onClick={() => {
                                                    setObservacionSeleccionada(item.observacion);
                                                    setActividadSeleccionada(item); 
                                                    setModalObservacionEstudianteVisible(true);

                                                }}
                                                title="Ver observación"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 5c-7.633 0-11 6.994-11 7s3.367 7 11 7 11-6.994 11-7-3.367-7-11-7zm0 12
            c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6
            3 3 0 0 0 0-6z" />
                                                </svg>
                                                Ver
                                            </button>
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
            {todasAprobadas && estadoSolicitudTermino === 'no_solicitada' && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        className="btn-carta-termino"
                        onClick={solicitarCartaTermino}
                    >
                        Solicitar Documento De  Término
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
                                <button
                                    onClick={() => {
                                        window.open(
                                            `${process.env.REACT_APP_API_URL}/uploads/cartas_termino/${planSeleccionado.carta_termino_pdf}`,
                                            '_blank'
                                        );
                                    }}
                                    className="boton-ver-carta"
                                    title="Ver Carta de Término"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#2D3748" viewBox="0 0 24 24">
                                        <path d="M12 5c-7.633 0-11 6.994-11 7s3.367 7 11 7 11-6.994 11-7-3.367-7-11-7zm0 
                12c-2.761 0-5-2.239-5-5s2.239-5 
                5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
                3 3 0 0 0 0-6z" />
                                    </svg>
                                    Ver
                                </button>
                            )}


                            <button
                                className={`respuesta-asesor-btn ${estadoSolicitudTermino}`}
                                disabled
                                style={{
                                    backgroundColor: estadoSolicitudTermino === 'solicitada' ? '#A0AEC0' : '#38A169', // gris o verde
                                    color: '#fff',
                                    border: 'none',
                                    padding: '6px 10px',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: '400',
                                    cursor: 'not-allowed'
                                }}
                            >
                                {estadoSolicitudTermino.charAt(0).toUpperCase() + estadoSolicitudTermino.slice(1)}
                            </button>
                        </div>


                    </div>

                    <div style={{ marginTop: '0px', paddingLeft: '32px' }}>
                        <p><strong>Carta de término: </strong></p>
                        {estadoSolicitudTermino === 'aprobada' ? (
                            <p style={{ color: '#2C7A7B', fontStyle: 'italic', fontSize: '14px' }}>
                                Se aprobó correctamente su solicitud. Puede ver y descargar su carta de término.
                            </p>
                        ) : (
                            <p style={{ color: '#2C7A7B', fontStyle: 'italic', fontSize: '14px' }}>
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
        {cartasMiembros.length > 1 ? 'Cartas de término del grupo' : 'CARTA DE TERMINO'}
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
        <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className="icono-pdf-svg"
      >
        <path style={{ fill: "#E2E5E7" }} d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z" />
        <path style={{ fill: "#B0B7BD" }} d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z" />
        <polygon style={{ fill: "#CAD1D8" }} points="480,224 384,128 480,128" />
        <path style={{ fill: "#F15642" }} d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z" />
        <g>
          <path style={{ fill: "#FFFFFF" }} d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48
              c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z
              M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z" />
          <path style={{ fill: "#FFFFFF" }} d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296
              c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z" />
          <path style={{ fill: "#FFFFFF" }} d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68
              h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912
              c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z" />
        </g>
        <path style={{ fill: "#CAD1D8" }} d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z" />
      </svg>
        <span className="titulo-pdf">CARTA DE TERMINO (ESTUDIANTE PRINCIPAL)</span>
      </div>
      <div className="acciones-doc">
        <button
          className="btn-ver-documento-inline"
          onClick={() => {
                                        window.open(
                                            `${process.env.REACT_APP_API_URL}/uploads/cartas_termino/${planSeleccionado.carta_termino_pdf}`,
                                            '_blank'
                                        );
                                    }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12
              c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8
              c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
          </svg>
          Ver
        </button>
        <span className="estado-tramitado">Tramitado</span>
      </div>
    </div>

  {cartasMiembros.map((carta, index) => (
      <div key={index} className="documento-card">
        <div className="documento-info">
          <svg
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        className="icono-pdf-svg"
      >
        <path style={{ fill: "#E2E5E7" }} d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z" />
        <path style={{ fill: "#B0B7BD" }} d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z" />
        <polygon style={{ fill: "#CAD1D8" }} points="480,224 384,128 480,128" />
        <path style={{ fill: "#F15642" }} d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16V416z" />
        <g>
          <path style={{ fill: "#FFFFFF" }} d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48
              c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z
              M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z" />
          <path style={{ fill: "#FFFFFF" }} d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296
              c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z" />
          <path style={{ fill: "#FFFFFF" }} d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68
              h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912
              c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z" />
        </g>
        <path style={{ fill: "#CAD1D8" }} d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z" />
      </svg>
          <span className="titulo-pdf">
            CARTA DE TERMINO ({carta?.codigo_universitario || 'SIN CÓDIGO'})
            </span>

        </div>
        <div className="acciones-doc">
          <button
            className="btn-ver-documento-inline"
            onClick={() =>
          window.open(`${process.env.REACT_APP_API_URL}/uploads/cartas_termino_integrantes/${carta.nombre_archivo_pdf}`, '_blank')
        }
      >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12
                c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8
                c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
            </svg>
            Ver
          </button>
          <span className="estado-tramitado">Tramitado</span>
        </div>
      </div>
    ))}
  </div>
)}

</div> 
); 
};

export default SeguimientoActividades;
