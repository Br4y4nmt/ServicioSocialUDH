import React, { useState, useEffect} from 'react';
import './DashboardDocente.css';
import PdfIcon from "../hooks/componentes/PdfIcon";
import { VerBotonInline } from "../hooks/componentes/VerBoton";
import MotivoRechazoModal from "../components/modals/MotivoRechazoModal";
import {
  mostrarExitoEleccionEliminada,
  mostrarErrorEliminarEleccion,
  mostrarInfoSinCartasGrupo,
  mostrarErrorCargarCartasGrupo,
  confirmarEnviarSolicitud,
  confirmarEliminarEleccion
} from "../hooks/alerts/alertas";


function DesignacionDocente({
  tipoServicio,
  setTipoServicio,
  solicitudEnviada,
  setModalGrupoVisible,
  facultades,
  trabajoId,
  facultadSeleccionada,
  programas,
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
  lineas
}) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  const [loadingSolicitud, setLoadingSolicitud] = useState(false);
  const [nombresMiembros, setNombresMiembros] = useState([]);
  const [modalMotivoVisible, setModalMotivoVisible] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [cartasMiembros, setCartasMiembros] = useState([]);

const abrirModalMotivoRechazo = async () => {
  if (!trabajoId || !token) return; // 

  try {
    const resp = await fetch(
      `${process.env.REACT_APP_API_URL}/api/trabajo-social/motivo-rechazo/${trabajoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      setMotivoRechazo(data.message || 'No se encontró un motivo registrado.');
    } else {
      setMotivoRechazo(data.motivo || 'No se encontró un motivo registrado.');
    }
  } catch (error) {
    console.error(error);
    setMotivoRechazo(
      'Ocurrió un error al cargar el motivo de rechazo. Inténtelo más tarde.'
    );
  }

  setModalMotivoVisible(true);
};

const eliminarEleccion = async () => {
  if (!trabajoId || !token) return;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/trabajo-social/seleccionado/${trabajoId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) throw new Error("Error al eliminar elección");

    await mostrarExitoEleccionEliminada();

    setTipoServicio("");
    setDocenteSeleccionado("");
    setNombreDocente("");
    setLineaSeleccionada("");
    setLaborSeleccionada("");
    setNombreLaborSocial("");
    localStorage.removeItem("trabajo_id");

    window.location.reload();
  } catch (error) {
    console.error(error);
    mostrarErrorEliminarEleccion();
  }
};


const obtenerNombresMiembros = async (codigos) => {
  try {
    const correos = codigos.map(cod => `${cod}@udh.edu.pe`);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/estudiantes/grupo-nombres`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ correos })
    });
    const data = await response.json();
    setNombresMiembros(data); 

  } catch (error) {
    console.error('Error al obtener nombres:', error);
    setNombresMiembros([]); 
  }
};
const verCartasMiembros = async (trabajoId) => {
  if (!trabajoId) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/cartas-aceptacion/grupo/${trabajoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      setCartasMiembros(data);
      const codigos = data.map((c) => c.codigo_universitario);
       obtenerNombresMiembros(codigos);
    } else {
      setCartasMiembros([]);
      if (estadoPlan === 'aceptado' && tipoServicio === 'grupal') {
          mostrarInfoSinCartasGrupo();
        }
    }
  }  catch (error) {
  console.error('Error:', error);
  mostrarErrorCargarCartasGrupo();
}
};

  useEffect(() => {
    if (solicitudEnviada && trabajoId) {
      verCartasMiembros(trabajoId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitudEnviada, trabajoId]);


const formularioCompleto = () => {
  return (
    tipoServicio &&
    facultadSeleccionada &&
    programaSeleccionado &&
    docenteSeleccionado &&
    lineaSeleccionada &&
    laborSeleccionada
  );
};



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
        onClick={() => {
          if (solicitudEnviada) obtenerIntegrantesDelGrupo();
          else setModalGrupoVisible(true);
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
                            <select
                        id="facultad"                  
                        value={facultadSeleccionada}
                        disabled={true}
                        className={`input-estilo-select texto-mayuscula ${facultadSeleccionada ? 'select-filled' : ''}`}
                      >
                        <option value="">Seleccione Facultad</option>
                        {facultades.map((facultad) => (
                          <option key={facultad.id_facultad} value={facultad.id_facultad}>
                            {facultad.nombre_facultad}
                          </option>
                        ))}
                      </select>
                        </div>
          
                        <div className="form-group">
                        <label className="bold-text" htmlFor="programa">
                          Programa Académico
                        </label>
                         <select
                          id="programa"
                          value={programaSeleccionado}
                          disabled={true}
                          className={`input-estilo-select texto-mayuscula ${programaSeleccionado ? 'select-filled' : ''}`}
                        >
                          <option value="">Seleccione Programa Académico</option>
                          {programas.map((programa) => (
                            <option key={programa.id_programa} value={programa.id_programa}>
                              {programa.nombre_programa}
                            </option>
                          ))}
                        </select>
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
                              const docente = docentes.find((d) => d.id_docente === id);
                              setNombreDocente(docente ? docente.nombre_docente : '');
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
                            const labor = labores.find((l) => l.id_labores === parseInt(id));
                            setNombreLaborSocial(labor ? labor.nombre_labores : '');
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
          
     {formularioCompleto() && !solicitudEnviada && (
      <div className="form-group">
        <button 
          className="btn-solicitar-aprobaciones"
          onClick={async () => {
            const result = await confirmarEnviarSolicitud();
            if (result.isConfirmed) {
              setLoadingSolicitud(true);
              Promise.resolve(handleSolicitarAprobacion())
                .finally(() => setLoadingSolicitud(false));
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


   {cartasMiembros.map((carta, index) => (
  <div key={index} className="documento-card">
    
    <div className="documento-info">
      <PdfIcon />

      <span className="titulo-pdf">
        CARTA DE ACEPTACION (
          {
            (() => {
              const correo = `${carta.codigo_universitario}@udh.edu.pe`.trim().toLowerCase();
              const miembro = nombresMiembros.find(n =>
                n.correo?.trim().toLowerCase() === correo
              );
              return miembro?.nombre && miembro.nombre !== "NO ENCONTRADO"
                ? miembro.nombre
                : carta.codigo_universitario;
            })()
          }
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
