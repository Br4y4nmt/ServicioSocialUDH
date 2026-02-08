import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import './DashboardDocente.css';
import PdfIcon from "../hooks/componentes/PdfIcon";
import { VerBotonInline } from "../hooks/componentes/VerBoton";
import MotivoRechazoModal from "../components/modals/MotivoRechazoModal";
import { useCartasAceptacion } from "../hooks/useCartasAceptacion";
import { useGrupoNombres } from "../hooks/useGrupoNombres";
import {
  mostrarExitoEleccionEliminada,
  mostrarErrorEliminarEleccion,
  confirmarEnviarSolicitud,
  mostrarAlertaFaltaIntegrantesGrupo,
  confirmarEliminarEleccion
} from "../hooks/alerts/alertas";

function DesignacionDocente({
  tipoServicio,
  setTipoServicio,
  solicitudEnviada,
  setModalGrupoVisible,
  trabajoId,
  facultadSeleccionada,
  programaSeleccionado,
  docentes,
  obtenerIntegrantesDelGrupo,
  docenteSeleccionado,
  setDocenteSeleccionado,
  setNombreDocente,
  labores,
  laborSeleccionada,
  setLaborSeleccionada,
  setNombreLaborSocial,
  handleSolicitarAprobacion,
  estadoPlan,
  cartaAceptacionPdf,
  lineaSeleccionada,
  setLineaSeleccionada,
  correosGrupo,
  lineas,
  nombreFacultad,
  nombrePrograma
}) {
  const { user } = useUser();
  const token = user?.token;
  const [loadingSolicitud, setLoadingSolicitud] = useState(false);
  const [modalMotivoVisible, setModalMotivoVisible] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  // Mapas memoizados para O(1) en onChange de selects
  const docentesPorId = useMemo(() => {
    const map = {};
    for (const d of docentes) map[String(d.id_docente)] = d.nombre_docente;
    return map;
  }, [docentes]);

  const laboresPorId = useMemo(() => {
    const map = {};
    for (const l of labores) map[l.id_labores] = l.nombre_labores;
    return map;
  }, [labores]);

  // Custom hooks: lógica de cartas y nombres de grupo
  const { cartasMiembros, nombresMiembros, resetCartas } = useCartasAceptacion(
    trabajoId, solicitudEnviada, estadoPlan, tipoServicio, token
  );
  const { getNombreMiembro } = useGrupoNombres(nombresMiembros);

const abrirModalMotivoRechazo = useCallback(async () => {
  if (!trabajoId || !token) return; 

  try {
    const { data } = await axios.get(
      `/api/trabajo-social/motivo-rechazo/${trabajoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMotivoRechazo(data.motivo || 'No se encontró un motivo registrado.');
  } catch (error) {
    console.error(error);
    const mensaje = error.response?.data?.message || 'Ocurrió un error al cargar el motivo de rechazo. Inténtelo más tarde.';
    setMotivoRechazo(mensaje);
  }

  setModalMotivoVisible(true);
}, [trabajoId, token]);

const validarGrupoAntesDeEnviar = useCallback(async () => {
  if (tipoServicio !== "grupal") return true;

  const correosValidos = (correosGrupo || [])
    .map((c) => String(c || "").trim().toLowerCase())
    .filter((c) => /^\d{10}@udh\.edu\.pe$/.test(c));

  if (correosValidos.length < 1) {
    await mostrarAlertaFaltaIntegrantesGrupo();
    return false;
  }

  return true;
}, [tipoServicio, correosGrupo]);



const eliminarEleccion = useCallback(async () => {
  if (!trabajoId || !token) return;

  try {
    await axios.delete(
      `/api/trabajo-social/seleccionado/${trabajoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await mostrarExitoEleccionEliminada();

    setTipoServicio("");
    setDocenteSeleccionado("");
    setNombreDocente("");
    setLineaSeleccionada("");
    setLaborSeleccionada("");
    setNombreLaborSocial("");
    resetCartas();
    localStorage.removeItem("trabajo_id");
  } catch (error) {
    console.error(error);
    mostrarErrorEliminarEleccion();
  }
}, [trabajoId, token, setTipoServicio, setDocenteSeleccionado, setNombreDocente, setLineaSeleccionada, setLaborSeleccionada, setNombreLaborSocial, resetCartas]);

  // Memoizar validación del formulario completo
  const formularioCompleto = useMemo(() => (
    Boolean(tipoServicio && docenteSeleccionado && lineaSeleccionada && laborSeleccionada)
  ), [tipoServicio, docenteSeleccionado, lineaSeleccionada, laborSeleccionada]);

  return (
    <>
      <div className="step-header">
      <span className="check-circle">
        <i className="fas fa-check"></i>
      </span>
      <h3>Designación De Docente Supervisor</h3>
    </div>
  <div className="form-group">
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <label className="bold-text" htmlFor="tipo-servicio">
      Tipo de Servicio Social
    </label>
    {tipoServicio === 'grupal' && (
    <VerBotonInline
      onClick={async () => {
        setModalGrupoVisible(true);
        await obtenerIntegrantesDelGrupo();
      }}
      label="Ver"
    />

      )}
  </div>
 <select
    id="tipo-servicio"              
    value={tipoServicio}
    onChange={(e) => {
      const value = e.target.value;
      setTipoServicio(value);
      if (value === 'grupal') setModalGrupoVisible(true);
    }}
    disabled={solicitudEnviada}
    className={`input-estilo-select texto-mayuscula ${tipoServicio ? 'select-filled' : ''}`}
  >
    <option value="">Seleccione una opción</option>
    <option value="individual">Individual</option>
    <option value="grupal">Grupal</option>
  </select>
      </div>
                        <div className="form-group">
                        <label className="bold-text" htmlFor="facultad">
                          Facultad
                        </label>
                        <input
                          type="text"
                          value={nombreFacultad || ''}
                          readOnly
                          className="input-disabled-pru texto-mayuscula"
                        />
                        <input type="hidden" value={facultadSeleccionada} />
                        </div>
          
                        <div className="form-group">
                        <label className="bold-text" htmlFor="programa">
                          Programa Académico
                        </label>
                        <input
                          type="text"
                          value={nombrePrograma || ''}
                          readOnly
                          className="input-disabled-pru texto-mayuscula"
                        />
                        <input type="hidden" value={programaSeleccionado} />
                        </div>
                        <div className="form-group">
                          <label className="bold-text" htmlFor="docente">
                            Seleccione Docente Supervisor
                          </label>
                           <select
                            id="docente"
                            value={docenteSeleccionado}
                            onChange={(e) => {
                              const id = e.target.value;
                              setDocenteSeleccionado(id);
                              setNombreDocente(docentesPorId[id] || '');
                            }}
                            disabled={solicitudEnviada}
                            className={`input-estilo-select texto-mayuscula ${docenteSeleccionado ? 'select-filled' : ''}`}
                          >
                            <option value="">Seleccione Docente Supervisor</option>
                            {docentes.map((docente) => (
                              <option key={docente.id_docente} value={docente.id_docente}>
                                {docente.nombre_docente}
                              </option>
                            ))}
                          </select>
                        </div>
                          <div className="form-group">
                  <label className="bold-text" htmlFor="linea-accion">
                  Línea de Acción
                </label>
                   <select
                  id="linea-accion"
                  value={lineaSeleccionada}
                  onChange={(e) => {
                    setLineaSeleccionada(e.target.value);
                    setLaborSeleccionada('');
                  }}
                  disabled={solicitudEnviada}
                  className={`input-estilo-select texto-mayuscula ${lineaSeleccionada ? 'select-filled' : ''}`}
                >
                  <option value="">Seleccione Línea de Acción</option>
                  {lineas.map((linea) => (
                    <option key={linea.id_linea} value={linea.id_linea}>
                      {linea.nombre_linea}
                    </option>
                  ))}
                </select>
                </div>
                        <div className="form-group">
                          <label className="bold-text" htmlFor="servicio-social">
                            Servicios Sociales
                          </label>
                          <select
                          id="servicio-social"
                          value={laborSeleccionada}
                          onChange={(e) => {
                            const id = e.target.value;
                            setLaborSeleccionada(id);
                            setNombreLaborSocial(laboresPorId[parseInt(id)] || '');
                          }}
                          disabled={solicitudEnviada}
                          className={`input-estilo-select texto-mayuscula ${laborSeleccionada ? 'select-filled' : ''}`}
                        >
                          <option value="">Seleccione Servicio Social</option>
                          {labores
                            .filter(
                              (labor) =>
                                lineaSeleccionada !== '' &&
                                labor.linea_accion_id === parseInt(lineaSeleccionada)
                            )
                            .map((labor) => (
                              <option key={labor.id_labores} value={labor.id_labores}>
                                {labor.nombre_labores}
                              </option>
                            ))}
                        </select>
                        </div>
          
     {formularioCompleto && !solicitudEnviada && (
      <div className="form-group">
        <button 
          className="btn-solicitar-aprobaciones"
          onClick={async () => {
          const okGrupo = await validarGrupoAntesDeEnviar();
          if (!okGrupo) return;

          const confirmado = await confirmarEnviarSolicitud();
          if (!confirmado.isConfirmed) return;

          setLoadingSolicitud(true);
          try {
            await handleSolicitarAprobacion();
          } finally {
            setLoadingSolicitud(false);
          }
        }}
          disabled={loadingSolicitud} 
        >
          {loadingSolicitud ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            'Solicitar Asesoría'
          )}
        </button>
      </div>
    )}
          {solicitudEnviada && (
        <div className="respuesta-asesor-card">
          <div className="respuesta-asesor-header">
      
      <div className="respuesta-contenedor">
        <div className="respuesta-icono-titulo">
          <i className="fas fa-info-circle icono-azul" />
          <span className="respuesta-asesor-title">Respuesta del docente:</span>
        </div>
        <h4 className="titulo-aceptacion">Carta de aceptación</h4>
      </div>
        <div className="respuesta-acciones">
          {estadoPlan === "aceptado" && (
            <VerBotonInline
              onClick={() =>
                window.open(
                  `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${cartaAceptacionPdf}`,
                  "_blank"
                )
              }
            />
              )}
              {estadoPlan === "rechazado" && (
                  <button
                    className="btn-motivo-rechazo"
                    onClick={abrirModalMotivoRechazo}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10
                              10-4.48 10-10S17.52 2 12 2zm0 15a1.5 1.5 0 110-3
                              1.5 1.5 0 010 3zm1-5h-2V7h2v5z"/>
                    </svg>
                    Motivo de rechazo
                  </button>
                )}
              <button className={`respuesta-asesor-btn ${estadoPlan}`}>
                {estadoPlan.charAt(0).toUpperCase() + estadoPlan.slice(1)}
              </button>
            </div>
          </div>
          
          <div className="respuesta-asesor-body">
            
            {estadoPlan === "pendiente" ? (
              <p className="texto-cursiva">
                El docente aún no revisa su propuesta.
              </p>
            ) : estadoPlan === "rechazado" ? (
              <>
              <p className="texto-cursiva" style={{ color: "#d32f2f" }}>
                El docente ha rechazado tu solicitud. Por favor revisa los datos y vuelve a intentarlo o contacta a tu docente supervisor.
              </p>
              <div className="contenedor-eliminar">
              <button
              className="btn-eliminar-eleccion"
              onClick={async () => {
              const result = await confirmarEliminarEleccion();
              if (result.isConfirmed) {
                eliminarEleccion();
              }
            }}
            >
              Seleccionar nuevo supervisor
            </button>
            </div>
            </>
            ) : (
              <p className="texto-cursiva">
                El docente ha aceptado tu solicitud, continúa al siguiente paso para
                poder confirmar tu plan de trabajo.
              </p>
              
            )}
          </div>
          
        </div>
        
      )}
      {estadoPlan === 'aceptado' && (
      <div className="seccion-documentos-designacion">
    <div className="seccion-header">
      <span className="check-circle">
      <i className="fas fa-check"></i>
    </span>

      <h3>Documentos para la designación de supervisor</h3>
      <div className="info-tooltip">
      <svg
        className="info-icon-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z"
          fill="currentColor"
        ></path>
        <path
          d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
          fill="currentColor"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z"
          fill="currentColor"
        ></path>
      </svg>
      <div className="tooltip-text">
        En este apartado podra visualizar las cartas de acptacion por parte del docente supervisor.
      </div>
    </div>

    </div>

    <div className="documento-card">
  <div className="documento-info">
    <PdfIcon />
    <span className="titulo-pdf">CARTA DE ACEPTACION</span>
  </div>

  <div className="acciones-doc">
    <VerBotonInline
      onClick={() =>
        window.open(
          `${process.env.REACT_APP_API_URL}/uploads/planes_labor_social/${cartaAceptacionPdf}`,
          "_blank"
        )
      }
    />
    <span className="estado-tramitado">Tramitado</span>
  </div>
</div>


   {cartasMiembros.map((carta) => (
  <div key={carta.id || carta.nombre_archivo_pdf} className="documento-card">
    
    <div className="documento-info">
      <PdfIcon />

      <span className="titulo-pdf">
        CARTA DE ACEPTACION (
        {getNombreMiembro(carta.codigo_universitario)}
        )
      </span>
    </div>

    <div className="acciones-doc">
      <VerBotonInline
        onClick={() =>
          window.open(
            `${process.env.REACT_APP_API_URL}/uploads/cartas_aceptacion/${carta.nombre_archivo_pdf}`,
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
  <MotivoRechazoModal
  visible={modalMotivoVisible}
  motivo={motivoRechazo}
  onClose={() => setModalMotivoVisible(false)}
/>

    </>
  );
}

export default DesignacionDocente;
