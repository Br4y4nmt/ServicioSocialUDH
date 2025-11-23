import React, { useEffect, useState } from 'react';
import Header from './Header';
import SidebarDocente from './SidebarDocente';
import axios from 'axios';
import Swal from 'sweetalert2';
import './RevisionPlanSocial.css';
import VerBoton from "../hooks/componentes/VerBoton";
import html2pdf from 'html2pdf.js';
import './CartaTerminoPDF.css'; 
import { showTopSuccessToast } from '../hooks/alerts/useWelcomeToast';
import { useUser } from '../UserContext';
import QRCode from 'qrcode';
import {
  confirmarAprobacionActividad,
  mostrarErrorAprobacionActividad,
  confirmarAceptarSolicitudTermino,
  mostrarAlertaObservacionRegistrada,
  confirmarRechazoSolicitudTermino,
  mostrarErrorGuardarObservacion,
} from "../hooks/alerts/alertas";



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
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState(null);
  const [modalObservacionVisible, setModalObservacionVisible] = useState(false);
  const [planPDF] = useState(null);
  const [fechaPDF] = useState('');
  const { user } = useUser();  
  const token = user?.token; 
  const [firmaDocente, setFirmaDocente] = useState('');
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [nombresMiembros, setNombresMiembros] = useState([]);


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

const cerrarModalGrupo = () => {
  setModalGrupoVisible(false);
  setIntegrantesGrupo([]);
};
const convertirImagenABase64 = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = function () {
      reject('Error al cargar la imagen');
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
};
const generarQRBase64 = async (url) => {
  try {
    return await QRCode.toDataURL(url, {
      width: 120,
      margin: 1,
    });
  } catch (err) {
    console.error('Error generando QR:', err);
    return null;
  }
};

const generarHTML = async (nombreEstudiante, programa, facultad, labor, firmaDocente) => `
  <html>
    <head>
      <style>
        ${await fetch('/styles/carta-aceptacion.css').then(r => r.text())}
      </style>
    </head>
    <body>
      <div class="carta-aceptacion">
        <div class="encabezado-udh">
          <div class="logo-container">
            <img src="/images/logonuevo.png" alt="Logo UDH" class="logo-udh" />
          </div>
          <div class="separador-vertical"></div>
          <div class="facultad-container">
            <p class="texto-facultad">
              FACULTAD DE ${facultad.toUpperCase() || '--------'}
            </p>
          </div>
          <div class="separador-vertical"></div>
          <div class="programa-container">
            <p class="texto-programa">
              P. A. DE ${programa.toUpperCase() || '--------'}
            </p>
          </div>
        </div>
        <hr class="linea-separadora" />
        <p class="carta-fecha">Huánuco, ${new Date().toLocaleDateString('es-PE')}</p>
        <h1 class="titulo-documento">APROBACION DE ACTIVIDADES SERVICIO SOCIAL</h1>
        <p class="parrafo-cartasss">De mi consideración:</p>
        <p class="parrafo-cartas">
          Reciba un cordial saludo, por medio de la presente se deja constancia que el estudiante <strong>${nombreEstudiante}</strong>,
          del programa académico de <strong>${programa}</strong>, perteneciente a la facultad de <strong>${facultad}</strong>,
           ha culminado satisfactoriamente sus actividades del servicio social denominado"<strong>${labor}</strong>".
        </p>
        <p class="parrafo-carta">Se extiende la presente a solicitud del interesado(a), para los fines que estime convenientes.</p>
        <p class="parrafo-cartass">Sin otro particular, me despido con las muestras de mi especial consideración y estima.</p>
        <div class="bloque-firma">
          <p class="firma-etiqueta">Atentamente,</p>
          <img src="${firmaDocente}" style="width:150px;margin-top:90px;margin-bottom: -15px;" />
          <p class="firma-docente"><em>${localStorage.getItem('nombre_usuario') || 'DOCENTE RESPONSABLE'}</em></p>
        </div>
      </div>
    </body>
  </html>
`;

const toggleSidebar = () => {
  setCollapsed(prev => {
    return !prev;
  });
};
const actualizarSolicitud = async (trabajoId, nuevoEstado, plan) => {
  try {
     if (nuevoEstado === 'rechazada') {
      const result = await confirmarRechazoSolicitudTermino();
      if (!result.isConfirmed) return; 
    }
    await axios.patch(`/api/trabajo-social/${trabajoId}/respuesta-carta-termino`, {
      solicitud_termino: nuevoEstado
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setTrabajosSociales(prev =>
      prev.map(t => t.id === trabajoId ? { ...t, solicitud_termino: nuevoEstado } : t)
    );

    Swal.fire({
      icon: 'success',
      title: 'Solicitud actualizada',
      text: `La solicitud fue ${nuevoEstado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente.`
    });

    if (nuevoEstado === 'aprobada') {
      if (plan.tipo_servicio_social === 'grupal') {

        const { data: integrantes } = await axios.get(`/api/integrantes/${plan.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        let datosEnriquecidos;
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/integrantes/${plan.id}/enriquecido`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          datosEnriquecidos = response.data;
        } catch (error) {
          console.error('Error al conectar con API UDH:', error);
          await Swal.fire({
            icon: 'error',
            title: 'Servidor UDH inalcanzable',
            text: 'La conexión con el servidor de la UDH falló. Intenta nuevamente más tarde.',
          });
          return;
        }

        if (!Array.isArray(datosEnriquecidos) || datosEnriquecidos.length === 0) {
          await Swal.fire({
            icon: 'warning',
            title: 'Servidor UDH no respondió',
            text: 'No se pudieron obtener los datos de los integrantes. Intenta más tarde.',
          });
          return;
        }
        await generarYSubirCartaTermino(plan, firmaDocente);
        for (const integrante of integrantes) {
          if (integrante.usuario_id === plan.usuario_id) continue;

          const codigo = integrante.correo_institucional.split('@')[0];
          const info = datosEnriquecidos.find(est => est.codigo_universitario === codigo);
          if (!info) {
            console.warn(`⚠️ No se encontró info enriquecida para el código: ${codigo}`);
            continue;
          }

          const nombreEstudiante = info.nombre_completo;

          const html = await generarHTML(
            nombreEstudiante,
            info.programa,
            info.facultad,
            plan.LaboresSociale?.nombre_labores || '--------',
            firmaDocente
          );
          const blob = await generarPDFBlobTermino(html, `Carta_Termino_${nombreEstudiante}.pdf`);
          const formData = new FormData();
          formData.append('archivo', blob, `Carta_Termino_${nombreEstudiante}.pdf`);
          formData.append('trabajo_id', plan.id);
          formData.append('codigo_universitario', codigo);

          await axios.post('/api/cartas-termino', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      } else {
        await generarYSubirCartaTermino(plan, firmaDocente);
      }
    }

  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar la solicitud de término.'
    });
  }
};

  useEffect(() => {
    const usuarioId = localStorage.getItem('id_usuario');

    axios.get(`/api/docentes/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` }
    })
    .then(async response => {
      const docenteId = response.data.id_docente;
      const firmaBase64 = await convertirImagenABase64(`${process.env.REACT_APP_API_URL}/uploads/firmas/${response.data.firma}`);
      setFirmaDocente(firmaBase64);

      axios.get(`/api/trabajo-social/docente/${docenteId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setTrabajosSociales(res.data))
        .catch(err => console.error('Error obteniendo trabajos sociales:', err));
    })
    .catch(err => console.error('Error obteniendo ID de docente:', err));
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
  const result = await confirmarAprobacionActividad();

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
    await mostrarErrorAprobacionActividad();
  }
};



const handleAbrirObservacion = (actividadId) => {
  setActividadSeleccionadaId(actividadId);
  setModalObservacionVisible(true);
};

const handleEnviarObservacion = () => {
  axios.patch(
    `/api/cronograma/${actividadSeleccionadaId}/observacion`,
    { observacion },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  .then(() => {
    setCronogramaSeleccionado(prev =>
      prev.map(act =>
        act.id === actividadSeleccionadaId
          ? { ...act, estado: 'observado', observacion }
          : act
      )
    );
    mostrarAlertaObservacionRegistrada();
    setModalObservacionVisible(false);
    setObservacion('');
  })
  .catch(err => {
    console.error('Error al guardar observación:', err);
    mostrarErrorGuardarObservacion();
  });
};

const generarPDFBlobTermino = async (html, filename) => {
  const contenedor = document.createElement('div');
  contenedor.innerHTML = html;
  document.body.appendChild(contenedor);

  await new Promise(resolve => setTimeout(resolve, 800));
  const blob = await html2pdf().set({
    margin: 10,
    filename,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(contenedor).outputPdf('blob');

  document.body.removeChild(contenedor);
  return blob;
};

const generarYSubirCartaTermino = async (plan, firmaDocente) => {
  const css = await fetch('/styles/carta-aceptacion.css').then(res => res.text());
  const nombreDocente = localStorage.getItem('nombre_usuario') || 'DOCENTE RESPONSABLE';
  const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documento-termino/${plan.id}`;
  const qrBase64 = await generarQRBase64(urlVerificacion);


  const contenido = `
    <html>
      <head><style>${css}</style></head>
      <body>
  <div class="carta-aceptacion">
    
    <!-- ENCABEZADO UDH -->
    <div class="encabezado-udh">
      <div class="logo-container">
        <img src="/images/logonuevo.png" alt="Logo UDH" class="logo-udh" />
      </div>
      <div class="separador-vertical"></div>
      <div class="facultad-container">
        <p class="texto-facultad">
          FACULTAD DE ${plan.Facultad?.nombre_facultad?.toUpperCase() || '--------'}
        </p>
      </div>
      <div class="separador-vertical"></div>
      <div class="programa-container">
        <p class="texto-programa">
          P. A. DE ${plan.ProgramasAcademico?.nombre_programa?.toUpperCase() || '--------'}
        </p>
      </div>
    </div>

    <hr class="linea-separadora" />

    <p class="carta-fecha">Huánuco, ${new Date().toLocaleDateString('es-PE')}</p>
    <h1 class="titulo-documento">APROBACION DE ACTIVIDADES SERVICIO SOCIAL</h1>
    <p class="parrafo-cartasss">De mi consideración:</p>
    <p class="parrafo-cartas">
      Reciba un cordial saludo, por medio de la presente se deja constancia que el estudiante <strong>${plan.Estudiante?.nombre_estudiante || '--------'}</strong>,
      del programa académico de <strong>${plan.ProgramasAcademico?.nombre_programa || '--------'}</strong>, perteneciente a la facultad de <strong>${plan.Facultad?.nombre_facultad || '--------'}</strong>,
      ha culminado satisfactoriamente sus actividades del servicio social denominado "<strong>${plan.LaboresSociale?.nombre_labores || '--------'}</strong>".
    </p>
    <p class="parrafo-carta">Se extiende la presente a solicitud del interesado(a), para los fines que estime convenientes.</p>
    <p class="parrafo-cartass">Sin otro particular, me despido con las muestras de mi especial consideración y estima.</p>

    <div class="bloque-firma">
      <p class="firma-etiqueta">Atentamente,</p>
      <img src="${firmaDocente}" style="width:150px;margin-top:90px;margin-bottom:-15px;" />
      <p class="firma-docente"><em>${nombreDocente}</em></p>
    </div>
  </div>
   <div style="display: flex; flex-direction: row; align-items: flex-start; margin-top: 40px; padding-left: 30px;">
          <img src="${qrBase64}" style="width: 70px; height: 70px; margin-right: 10px;" />
          <div style="font-size: 10px; line-height: 1.2; max-width: 300px; margin-top: 12px;">
            <strong>Documento:</strong> CARTA DE TÉRMINO<br/>
            <strong>URL de Verificación:</strong><br/>
            ${urlVerificacion}
          </div>
        </div>
</body>
    </html>
  `;

  const contenedor = document.createElement('div');
  contenedor.innerHTML = contenido;
  document.body.appendChild(contenedor);

  await new Promise(r => setTimeout(r, 800));
  const blob = await html2pdf().set({
    margin: 10,
    filename: `carta_termino_${plan.id}.pdf`, 
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(contenedor).outputPdf('blob');
  document.body.removeChild(contenedor);

  const formData = new FormData();
  formData.append('archivo', blob, `carta_termino_${plan.id}.pdf`);
  formData.append('trabajo_id', plan.id);

 await axios.post('/api/trabajo-social/guardar-carta-termino-html', formData, {
  headers: { Authorization: `Bearer ${token}` }
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
                      onClick={async () => {
                        const result = await confirmarAceptarSolicitudTermino();
                        if (result.isConfirmed) {
                          actualizarSolicitud(plan.id, "aprobada", plan);
                        }
                      }}
                    >
                      Aceptar
                    </button>
                    <button
                      className="btn-rechazar-termino"
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
                      <button className="btn-aprobar-estado" onClick={() => handleAprobar(item.id)}>Aprobar</button>
                      <button className="btn-observar-estado" onClick={() => handleAbrirObservacion(item.id)}>Observar</button>
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

{planPDF && (
  <div id="carta-termino-pdf" style={{ display: 'none' }}>
    <div className="carta-pdf">
      {/* ENCABEZADO DINÁMICO */}
      <div className="encabezado-udh">
  <div className="logo-container">
    <img src="/images/logonuevo.png" alt="Logo UDH" className="logo-udh" />
  </div>

  <div className="separador-vertical" />

  <div className="facultad-container">
    <p className="texto-facultad">
      FACULTAD DE: {planPDF.Facultad?.nombre_facultad?.toUpperCase() || 'NO DISPONIBLE'}
    </p>
  </div>

  <div className="separador-vertical" />

  <div className="programa-container">
    <p className="texto-programa">
      P. A. DE {planPDF.ProgramasAcademico?.nombre_programa?.toUpperCase() || 'NO DISPONIBLE'}
    </p>
  </div>
</div>
      <hr className="linea-separadora" />

      {/* CUERPO DE LA CARTA */}
      <p className="fecha-derecha">Huánuco, {fechaPDF}</p>
      <h3 className="titulo-documento">CARTA DE TÉRMINO DEL SERVICIO SOCIAL</h3>
      
      <p className="parrafo-carta">
        De mi consideración:
      </p>
      <p className="parrafo-carta">
        Reciba un cordial saludo, por medio de la presente se deja constancia que el estudiante <strong>{planPDF.Estudiante?.nombre_estudiante || '--------'}</strong>, 
        del programa académico de <strong>{planPDF.ProgramasAcademico?.nombre_programa || '--------'}</strong>, perteneciente a la facultad de 
        <strong> {planPDF.Facultad?.nombre_facultad || '--------'}</strong>, ha culminado satisfactoriamente su servicio social denominado 
        "<strong>{planPDF.LaboresSociale?.nombre_labores || '--------'}</strong>".
      </p>
      <p className="parrafo-carta">
  Se extiende la presente a solicitud del interesado(a), para los fines que estime convenientes.
</p>
      <p className="parrafo-cartass">
  Sin otro particular, me despido con las muestras de mi especial consideración y estima.
</p>
      <div className="bloque-firma">
  <p className="firma-etiqueta">Atentamente,</p>
  <img
    src={firmaDocente}
    alt="Firma del docente"
    style={{ width: '150px', marginTop: '80px', marginBottom: '5px' }}
  />
  <p className="firma-docente">
    <em>{localStorage.getItem('nombre_usuario') || 'Docente responsable'}</em>
  </p>
</div>
    </div>
  </div>
)}
    </>
  );
}

export default SeguimientoServicioDocente;
