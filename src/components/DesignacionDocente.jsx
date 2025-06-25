import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


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

  const [cartasMiembros, setCartasMiembros] = useState([]);

const verCartasMiembros = async (trabajoId) => {
  if (!trabajoId) return;

  try {
    const response = await fetch(`http://localhost:5000/api/cartas-aceptacion/grupo/${trabajoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      setCartasMiembros(data);
    } else {
      setCartasMiembros([]);

      // Mostrar la alerta solo si el tipo de servicio es grupal
      if (estadoPlan === 'aceptado' && tipoServicio === 'grupal') {
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
}, [solicitudEnviada, trabajoId]);
  const laboresFiltradas = labores.filter(
  (labor) => labor.linea_accion_id === parseInt(lineaSeleccionada)
);
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
            <label className="bold-text">Tipo de Servicio Social</label>
      {tipoServicio === 'grupal' && (
  <button
    onClick={() => {
      if (solicitudEnviada) {
        obtenerIntegrantesDelGrupo(); // 🔄 solo si ya hay datos en la BD
      } else {
        setModalGrupoVisible(true); // si es la primera vez, solo abre el modal vacío
      }
    }}
    className="btn-ver-documento-inline"
    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
    title="Ver integrantes del grupo"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 5c-7.633 0-11 6.994-11 7s3.367 7 11 7 11-6.994 11-7-3.367-7-11-7zm0 12
            c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
            3 3 0 0 0 0-6z"/>
    </svg>
    Ver
  </button>
)}
      </div>
      
        <select
        value={tipoServicio}
        onChange={(e) => {
          const value = e.target.value;
          setTipoServicio(value);
          if (value === 'grupal') {
            setModalGrupoVisible(true);
          }
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
                        <label className="bold-text"> Facultad</label>
                            <select
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
                        <label className="bold-text"> Programa Académico</label>
                          <select
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
          
                        {/* Desplegable para seleccionar el Docente Supervisor */}
                        <div className="form-group">
                          <label className="bold-text">Seleccione Docente Supervisor</label>
                          <select
                      value={docenteSeleccionado}
                      onChange={(e) => {
                        const id = e.target.value;
                        setDocenteSeleccionado(id);
                        const docente = docentes.find(d => d.id_docente === id);
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
                  <label className="bold-text">Línea de Acción</label>
                  <select
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
                        {/* Desplegable para seleccionar el tipo de labor social */}
                        <div className="form-group">
                          <label className="bold-text">Servicios Sociales</label>
                          <select
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
                          .filter((labor) =>
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
          
                        {laborSeleccionada && !solicitudEnviada && (
                          <div className="form-group">
                            <button 
        className="btn-solicitar-aprobacion"
        onClick={() => {
          Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez enviada la solicitud, no podrás modificar los datos seleccionados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
              handleSolicitarAprobacion();
            }
          });
        }}
      >
        Solicitar Aprobación
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
            <button
              className="btn-ver-documento-inline"
              onClick={() =>
                window.open(
                  `http://localhost:5000/uploads/planes_labor_social/${cartaAceptacionPdf}`,
                  '_blank'
                )
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                    <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 
                            5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657 0-3 1.343-3 3s1.343 3 
                            3 3 3-1.343 3-3-1.343-3-3-3z" />
                  </svg>
                  Ver
                </button>
              )}
      
              {/* Siempre mostrar el botón de estado */}
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
              <p className="texto-cursiva" style={{ color: "#d32f2f" }}>
                El docente ha rechazado tu solicitud. Por favor revisa los datos y vuelve a intentarlo o contacta a tu docente asesor.
              </p>
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

      <h3>Documentos para la designación de asesor</h3>
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
      <span className="titulo-pdf">CARTA DE ACEPTACION (ESTUDIANTE PRINCIPAL)</span>
      
    </div>
    <div className="acciones-doc">
        <button
        className="btn-ver-documento-inline"
        onClick={() =>
          window.open(
            `http://localhost:5000/uploads/planes_labor_social/${cartaAceptacionPdf}`,
            '_blank'
          )
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
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
      CARTA DE ACEPTACION ({carta.codigo_universitario})
    </span>
   
  </div>
   <div className="acciones-doc">
      <button
        className="btn-ver-documento-inline"
        onClick={() =>
          window.open(
            `http://localhost:5000/uploads/cartas_aceptacion/${carta.nombre_archivo_pdf}`,
            '_blank'
          )
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
    </>
  );
}

export default DesignacionDocente;
