import React, { useState, useEffect } from 'react';
import Header from './Header';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import SidebarDocente from './SidebarDocente';
import './DashboardDocente.css';
import Swal from 'sweetalert2';
import { useWelcomeToast } from '../hooks/alerts/useWelcomeToast';
import VerBoton from "../hooks/componentes/VerBoton";
import axios from 'axios';
import QRCode from 'qrcode';
import EditarEstadoModal from "./modals/EditarEstadoModal";
import ModalDeclinar from "./modals/ModalDeclinar";
import GrupoDocenteModal from "./modals/GrupoDocenteModal";
import { useUser } from '../UserContext';
import {
  mostrarExitoTrabajoAceptado,
  mostrarErrorGuardarCambiosTrabajo,
  mostrarAlertaCompletarPerfilDocente,
  mostrarErrorObtenerTrabajosDocente,
  mostrarErrorObtenerDatosDocente,
  confirmarAceptarEstudianteTrabajo,
  mostrarAlertaSinDatosGrupo,
  mostrarErrorServidorUDHNoDisponible,
  mostrarExitoCambioEstadoTrabajo,
  mostrarErrorCambioEstadoTrabajo
} from "../hooks/alerts/alertas";


function RevisionDocente() {
  const { user } = useUser();
  const token = user?.token;
  const [collapsed, setCollapsed] = useState(() => window.innerWidth <= 768);
  const [trabajosSociales, setTrabajosSociales] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedTrabajo, setSelectedTrabajo] = useState(null); 
  const [nuevoEstado, setNuevoEstado] = useState(''); 
  const [activeSection, setActiveSection] = useState('revision');
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [integrantesGrupo, setIntegrantesGrupo] = useState([]);
  const [firmaDocente, setFirmaDocente] = useState('');
  const [trabajoEnProcesoId, setTrabajoEnProcesoId] = useState(null);
  const [modalDeclinarVisible, setModalDeclinarVisible] = useState(false);
  const [observacionDeclinar, setObservacionDeclinar] = useState('');
  const navigate = useNavigate();
  useWelcomeToast();

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
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send();
  });
};


function formatearFechaExtendida(fecha) {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  
  return `${dia} de ${mes} de ${anio}`;
}


const generarYSubirPDF = async (trabajo) => {
  try {
    const nombreDocente = localStorage.getItem('nombre_usuario') || 'DOCENTE DESCONOCIDO';

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      console.error('Token inválido o mal formado:', token);
      alert('Tu sesión ha expirado o hay un problema con la autenticación. Por favor, vuelve a iniciar sesión.');
      return;
    }

    const css = await fetch('/styles/carta-aceptacion.css').then(res => res.text());
    const firmaBase64 = await convertirImagenABase64(`${process.env.REACT_APP_API_URL}/uploads/firmas/${firmaDocente}`);
    const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`;
    const qrBase64 = await generarQRBase64(urlVerificacion);
    const contenido = `
      <html>
        <head><style>${css}</style></head>
        <body>
          <div class="carta-aceptacion">
            <div class="carta-encabezado">
              <img src="/images/logoudh.png" class="carta-logo" />
              <div class="separador-vertical"></div>
              <div class="carta-institucion">
                <p>FACULTAD DE ${trabajo.Facultad?.nombre_facultad || 'Facultad no disponible'}</p>
              </div>
              <div class="separador-vertical"></div>
              <div class="carta-institucion">
                <p>P.A. DE ${trabajo.ProgramasAcademico?.nombre_programa || 'Programa no disponible'}</p>
              </div>
            </div>
            <hr />
            <h1 style="text-align: center; font-size: 20px; margin: 20px 0; font-weight: bold;">
              CARTA DE ACEPTACIÓN
            </h1>
           <p class="carta-fecha">Huánuco, ${formatearFechaExtendida(new Date())}</p>
            <div class="carta-cuerpo">
              <p class="carta-asunto">
              <strong style="display: inline-block; width: 120px;">ASUNTO:</strong>
              <span class="asunto-texto">ACEPTACIÓN DE SUPERVISIÓN DE SERVICIO SOCIAL</span>
            </p>
              <p class="carta-body">De mi consideración:</p>
              <p class="carta-body" style="text-indent: 40px;">Tengo el agrado de dirigirme a usted para expresarle un cordial saludo y a la vez comunicarle que he aceptado supervisar el desarrollo de su servicio social al:</p>
              <p class="carta-asunto">
              <span style="display: inline-block; width: 150px;"><strong>ESTUDIANTE:</strong></span>
              ${trabajo.Estudiante?.nombre_estudiante || 'N/A'}
            </p>

              <p class="carta-body">Sin otro particular, me despido expresándole mi consideración y estima personal.</p>
              <div class="carta-footer">
                <p style="margin-top: 100px;">Atentamente,</p>
                <img src="${firmaBase64}" alt="Firma del docente" style="width: 150px; margin-top: 10px;" />
                <p class="carta-firma-docente"><strong>${nombreDocente}</strong></p>
              </div>
            </div>
          </div>
          <div class="qr-anchor">
          <img src="${qrBase64}" alt="QR" />
          <div class="qr-text">
            <strong>Documento:</strong> CARTA DE ACEPTACIÓN<br/>
            <strong>URL de Verificación:</strong><br/>
            ${urlVerificacion}
          </div>
        </div>
        </body>
      </html>`;

    const opt = {
        margin: 10,
        filename: `carta_aceptacion_${trabajo.id}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      const contenedorTemporal = document.createElement('div');
      contenedorTemporal.innerHTML = contenido;
      document.body.appendChild(contenedorTemporal);

      await new Promise(resolve => setTimeout(resolve, 800));

      const blob = await html2pdf().set(opt).from(contenedorTemporal).outputPdf('blob');
      document.body.removeChild(contenedorTemporal);

      const formData = new FormData();
      formData.append('archivo', blob, `carta_aceptacion_${trabajo.id}.pdf`);
      formData.append('trabajo_id', trabajo.id);

       await axios.post('/api/trabajo-social/guardar-pdf-html', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

    } catch (error) {
      console.error('Error al generar o subir el PDF:', error);

      if (error.response) {
        console.error('Detalles del backend:', error.response.data);
        alert(`Error al subir el PDF: ${error.response.data.message || 'Error del servidor'}`);
      } else {
        alert(`Error al generar PDF: ${error.message}`);
      }
    }
  };

const toggleSidebar = () => {
  setCollapsed(prev => {
    return !prev;
  });
};


useEffect(() => {
  const usuarioId = localStorage.getItem('id_usuario');
  const token = user?.token;

  if (!usuarioId || !token) {
    console.error('Faltan el ID del usuario o el token.');
    return;
  }

  axios.get(`/api/usuarios/${usuarioId}/primera-vez`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(async res => {
      if (res.data.primera_vez) {
        const result = await mostrarAlertaCompletarPerfilDocente();
        if (result.isConfirmed) navigate('/perfil-docente');
        return;
      }

      axios.get(`/api/docentes/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          const docenteId = response.data.id_docente;
          setFirmaDocente(response.data.firma);

          axios.get(`/api/trabajo-social/docente/${docenteId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => {
              setTrabajosSociales(res.data);
            })
            .catch(err => {
              console.error('Error al obtener trabajos sociales:', err);
              const mensaje = err.response?.data?.message;
              mostrarErrorObtenerTrabajosDocente(mensaje);
            });
        })
        .catch(error => {
          console.error('Error al obtener datos del docente:', error);
          const mensaje = error.response?.data?.message;
          mostrarErrorObtenerDatosDocente(mensaje);
        });
    })
    .catch(err => {
      console.error('Error al verificar primera vez del docente:', err);
    });

}, [user, navigate]);

  // const handleEdit = (trabajo) => {
  //   setSelectedTrabajo(trabajo);
  //   setNuevoEstado(trabajo.estado_plan_labor_social);
  //   setModalVisible(true);
  // };

const generarPDFBlob = async (trabajo) => {
  const css = await fetch('/styles/carta-aceptacion.css').then(res => res.text());
  const firmaBase64 = await convertirImagenABase64(`${process.env.REACT_APP_API_URL}/uploads/firmas/${firmaDocente}`);
  const nombreDocente = localStorage.getItem('nombre_usuario') || 'DOCENTE DESCONOCIDO';
  const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`;
  const qrBase64 = await generarQRBase64(urlVerificacion);

  const contenido = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        <div class="carta-aceptacion">
          <div class="carta-encabezado">
            <img src="/images/logoudh.png" class="carta-logo" />
            <div class="separador-vertical"></div>
            <div class="carta-institucion">
              <p>FACULTAD DE ${trabajo.Facultad?.nombre_facultad || 'Facultad no disponible'}</p>
            </div>
            <div class="separador-vertical"></div>
            <div class="carta-institucion">
              <p>P.A. DE ${trabajo.ProgramasAcademico?.nombre_programa || 'Programa no disponible'}</p>
            </div>
          </div>
          <hr />
          <h1 style="text-align: center; font-size: 20px; margin: 20px 0; font-weight: bold;">
            CARTA DE ACEPTACIÓN
          </h1>
          <p class="carta-fecha">Huánuco, ${formatearFechaExtendida(new Date())}</p>
          <div class="carta-cuerpo">
            <p class="carta-asunto">
              <strong style="display: inline-block; width: 120px;">ASUNTO:</strong>
              <span class="asunto-texto">ACEPTACIÓN DE SUPERVISIÓN DE SERVICIO SOCIAL</span>
            </p>
            <p class="carta-body">De mi consideración:</p>
            <p class="carta-body" style="text-indent: 40px;">
              Tengo el agrado de dirigirme a usted para expresarle un cordial saludo y a la vez comunicarle que he aceptado supervisar el desarrollo de su servicio social a:
            </p>
            <p class="carta-asunto">
              <span style="display: inline-block; width: 150px;"><strong>ESTUDIANTE:</strong></span>
              ${trabajo.Estudiante?.nombre_estudiante || 'N/A'}
            </p>
            <p class="carta-body">
              Sin otro particular, me despido expresándole mi consideración y estima personal.
            </p>

            <div class="carta-footer">
              <p style="margin-top: 100px;">Atentamente,</p>
              <img src="${firmaBase64}" alt="Firma del docente" style="width: 150px; margin-top: 10px;" />
              <p class="carta-firma-docente"><strong>${nombreDocente}</strong></p>
            </div>
          </div>
        </div>

        <div class="qr-anchor">
          <img src="${qrBase64}" alt="QR" />
          <div class="qr-text">
            <strong>Documento:</strong> CARTA DE ACEPTACIÓN<br/>
            <strong>URL de Verificación:</strong><br/>
            ${urlVerificacion}
          </div>
        </div>

      </body>
    </html>
  `;

  const opt = {
    margin: 10,
    filename: `temp.pdf`,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 4 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const contenedor = document.createElement('div');
  contenedor.innerHTML = contenido;
  document.body.appendChild(contenedor);

  await new Promise(resolve => setTimeout(resolve, 800));
  const blob = await html2pdf().set(opt).from(contenedor).outputPdf('blob');
  document.body.removeChild(contenedor);

  return blob;
};

const handleSave = async () => {
  if (!selectedTrabajo) return;

  try {
    await axios.put(
      `/api/trabajo-social/${selectedTrabajo.id}`,
      {
        estado_plan_labor_social: nuevoEstado,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (nuevoEstado === 'aceptado') {
      if (selectedTrabajo.tipo_servicio_social === 'grupal') {
        await generarYSubirPDF(selectedTrabajo);

        const { data: integrantes } = await axios.get(
          `/api/integrantes/${selectedTrabajo.id}/enriquecido`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        for (const integrante of integrantes) {
          const trabajoFake = {
            ...selectedTrabajo,
            Estudiante: {
              nombre_estudiante: integrante.nombre_completo
            },
            Facultad: {
              nombre_facultad: integrante.facultad
            },
            ProgramasAcademico: {
              nombre_programa: integrante.programa
            },
            id: `${selectedTrabajo.id}_${integrante.codigo_universitario}`
          };

          const pdfBlob = await generarPDFBlob(trabajoFake);

          const formData = new FormData();
          formData.append(
            'archivo',
            pdfBlob,
            `carta_aceptacion_${selectedTrabajo.id}_${integrante.codigo_universitario}.pdf`
          );
          formData.append('trabajo_id', selectedTrabajo.id);
          formData.append('codigo_universitario', integrante.codigo_universitario);

          await axios.post('/api/cartas-aceptacion', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
        }
      } else {
        await generarYSubirPDF(selectedTrabajo);
      }

      mostrarExitoTrabajoAceptado();
    }

    setTrabajosSociales(prev =>
      prev.map(trabajo =>
        trabajo.id === selectedTrabajo.id
          ? { ...trabajo, estado_plan_labor_social: nuevoEstado }
          : trabajo
      )
    );

    setModalVisible(false);

  } catch (error) {
    console.error('Error al guardar cambios:', error);
    const mensajeBackend = error.response?.data?.message;
    mostrarErrorGuardarCambiosTrabajo(mensajeBackend);
  }
};

  const handleCloseModal = () => {
    setModalVisible(false);
  };

const handleVerGrupo = async (trabajoId) => {
  try {
    const { data: integrantes } = await axios.get(`/api/integrantes/${trabajoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const correos = integrantes.map(item => item.correo_institucional);
    const { data: nombresYCorreos } = await axios.post(
      '/api/estudiantes/grupo-nombres',
      { correos },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setIntegrantesGrupo(nombresYCorreos);
    setModalGrupoVisible(true);

  } catch (error) {
    console.error('Error al obtener integrantes del grupo:', error);
    alert('No se pudieron cargar los integrantes del grupo');
  }
};


const cerrarModalGrupo = () => {
  setModalGrupoVisible(false);
  setIntegrantesGrupo([]);
};

const handleCambiarEstado = async (trabajo, nuevoEstado) => {
  if (trabajoEnProcesoId !== null) return;
  setTrabajoEnProcesoId(trabajo.id);

  if (nuevoEstado === 'aceptado') {
    const result = await confirmarAceptarEstudianteTrabajo();
    if (!result.isConfirmed) {
      setTrabajoEnProcesoId(null);
      return;
    }
  }

  try {
    await axios.put(
      `/api/trabajo-social/${trabajo.id}`,
      { estado_plan_labor_social: nuevoEstado },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (nuevoEstado === 'aceptado') {
      if (trabajo.tipo_servicio_social === 'grupal') {
        let integrantes = [];

        try {
          const response = await axios.get(
            `/api/integrantes/${trabajo.id}/enriquecido`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          integrantes = response.data;

          if (!Array.isArray(integrantes) || integrantes.length === 0) {
            await mostrarAlertaSinDatosGrupo();
            return;
          }

        } catch (err) {
          console.error('Error al obtener datos enriquecidos:', err);
          await mostrarErrorServidorUDHNoDisponible();
          return;
        }

        await generarYSubirPDF(trabajo);

        for (const integrante of integrantes) {
          const trabajoFake = {
            ...trabajo,
            Estudiante: {
              nombre_estudiante: integrante.nombre_completo
            },
            Facultad: {
              nombre_facultad: integrante.facultad
            },
            ProgramasAcademico: {
              nombre_programa: integrante.programa
            },
            id: `${trabajo.id}_${integrante.codigo_universitario}`
          };

          const pdfBlob = await generarPDFBlob(trabajoFake);

          const formData = new FormData();
          formData.append(
            'archivo',
            pdfBlob,
            `carta_aceptacion_${trabajo.id}_${integrante.codigo_universitario}.pdf`
          );
          formData.append('trabajo_id', trabajo.id);
          formData.append('codigo_universitario', integrante.codigo_universitario);

          await axios.post('/api/cartas-aceptacion', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`
            }
          });
        }

      } else {
        await generarYSubirPDF(trabajo);
      }
    }

    setTrabajosSociales(prev =>
      prev.map(t =>
        t.id === trabajo.id ? { ...t, estado_plan_labor_social: nuevoEstado } : t
      )
    );

    await mostrarExitoCambioEstadoTrabajo(nuevoEstado);

  } catch (error) {
    console.error(`Error al cambiar estado a ${nuevoEstado}:`, error);
    const backendMessage = error.response?.data?.message;
    await mostrarErrorCambioEstadoTrabajo(backendMessage);
  } finally {
    setTrabajoEnProcesoId(null);
  }
};

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <SidebarDocente
        collapsed={collapsed}
        nombre={localStorage.getItem('nombre_usuario')}
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
        <div className="revision-container-d">
          <div className="revision-card">
            <h2 className="revision-title">Revisión del Docente</h2>
  
            {trabajosSociales.length > 0 ? (
              <div className="revision-table-wrapper">
              <table className="revision-table">
                <thead className="revision-table-thead">
                  <tr>
                    <th>Alumno</th>
                    <th>Programa Académico</th>
                    <th>Servicio Social</th>
                     <th>Tipo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                    <th>Documentos</th>
                  </tr>
                </thead>
                <tbody>
  {trabajosSociales.map((trabajo) => (
    <tr key={trabajo.id}>
      <td>{trabajo.Estudiante ? trabajo.Estudiante.nombre_estudiante : 'No disponible'}</td>
      <td>{trabajo.ProgramasAcademico ? trabajo.ProgramasAcademico.nombre_programa : 'No disponible'}</td>
      <td>{trabajo.LaboresSociale ? trabajo.LaboresSociale.nombre_labores : 'No disponible'}</td>
      
     <td>
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
    <span>{trabajo.tipo_servicio_social}</span>
    {trabajo.tipo_servicio_social === 'grupal' && (
     <VerBoton
      label="Ver"
      onClick={() => handleVerGrupo(trabajo.id)}
    />
    )}
  </div>
</td>
      <td>
      <span
        className={
          trabajo.estado_plan_labor_social === 'aceptado'
            ? 'estado-badge aceptado'
            : trabajo.estado_plan_labor_social === 'pendiente'
            ? 'estado-badge pendiente'
            : 'estado-badge rechazado'
        }
      >
        {trabajo.estado_plan_labor_social}
      </span>
    </td>

     <td>
  {trabajo.estado_plan_labor_social === 'pendiente' ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <button
  className="btn-accion aceptar"
  onClick={() => handleCambiarEstado(trabajo, 'aceptado')}
  disabled={trabajoEnProcesoId === trabajo.id}
>
  {trabajoEnProcesoId === trabajo.id ? (
    <>
      <span className="spinner" />
      Generando...
    </>
  ) : (
    'Aceptar'
  )}
</button>

<button
  className="btn-accion rechazar"
  onClick={() => handleCambiarEstado(trabajo, 'rechazado')}
  disabled={trabajoEnProcesoId === trabajo.id}
>
  {trabajoEnProcesoId === trabajo.id ? (
    <>
      <span className="spinner" />
      Procesando...
    </>
  ) : (
    'Rechazar'
  )}
</button>

    </div>
  ) : (
    <button
      className="boton-declinar"
      onClick={() => {
        setSelectedTrabajo(trabajo);
        setModalDeclinarVisible(true);
      }}
    >
      Declinar
    </button>
  )}
</td>

    <td>
  {trabajo.estado_plan_labor_social === 'aceptado' ? (
    <VerBoton
  label="Ver"
  onClick={() =>
    window.open(
      `${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`,
      "_blank"
    )
  }
/>

  ) : (
    <span style={{ color: '#999', fontSize: '12px' }}>SIN DOCUMENTO</span>
  )}
</td>

    </tr>
  ))}
</tbody>
              </table>
               </div>
            ) : (
              <p className="revision-no-data">No hay trabajos sociales disponibles aún.</p>
            )}
  
          </div>
          <div className="revision-footer">
              <button
                className="revision-btn siguiente"
                onClick={() => navigate('/revision-documento-docente')}
              >
                Siguiente
              </button>
            </div>
        </div>
      </main>

<GrupoDocenteModal
  visible={modalGrupoVisible}
  integrantesGrupo={integrantesGrupo}
  onClose={cerrarModalGrupo}
/>

<ModalDeclinar
  visible={modalDeclinarVisible}
  observacion={observacionDeclinar}
  setObservacion={setObservacionDeclinar}
  onCancel={() => setModalDeclinarVisible(false)}
  onSubmit={async () => {
    if (!observacionDeclinar.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Observación requerida',
        text: 'Por favor, escriba una observación antes de enviar.',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    if (!selectedTrabajo) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se ha seleccionado ningún trabajo.',
      });
      return;
    }

    const nuevoEstadoFinal =
      selectedTrabajo.estado_plan_labor_social === 'aceptado'
        ? 'rechazado'
        : 'aceptado';

    try {
      await axios.post(
        `/api/trabajo-social/declinar`,
        {
          trabajo_id: selectedTrabajo.id,
          observacion: observacionDeclinar,
          nuevo_estado: nuevoEstadoFinal
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTrabajosSociales(prev =>
        prev.map(t =>
          t.id === selectedTrabajo.id
            ? { ...t, estado_plan_labor_social: nuevoEstadoFinal }
            : t
        )
      );

      Swal.fire({
        icon: 'success',
        title:
          nuevoEstadoFinal === 'rechazado'
            ? 'Trabajo rechazado'
            : 'Trabajo aceptado',
        text: 'El motivo ha sido registrado correctamente.'
      });

      setModalDeclinarVisible(false);
      setObservacionDeclinar('');

    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message;

      Swal.fire({
        icon: 'error',
        title: 'No se puede declinar',
        text: backendMessage || 'No se pudo guardar la observación.',
        confirmButtonText: 'Entendido'
      });
    }
  }}
/>

<EditarEstadoModal
  visible={modalVisible}
  nuevoEstado={nuevoEstado}
  onChangeEstado={setNuevoEstado}
  onSave={handleSave}
  onClose={handleCloseModal}
/>
    </>
  );
}

export default RevisionDocente;
