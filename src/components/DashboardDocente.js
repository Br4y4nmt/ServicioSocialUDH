import React, { useState, useEffect } from 'react';
import Header from './Header';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import SidebarDocente from './SidebarDocente';
import './DashboardDocente.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import QRCode from 'qrcode';
import { useUser } from '../UserContext';

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

  const generarQRBase64 = async (url) => {
    try {
      return await QRCode.toDataURL(url, {
        width: 120, // Tamaño controlado
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
      console.error('❌ Token inválido o mal formado:', token);
      alert('Tu sesión ha expirado o hay un problema con la autenticación. Por favor, vuelve a iniciar sesión.');
      return;
    }

    const css = await fetch('/styles/carta-aceptacion.css').then(res => res.text());
    const firmaBase64 = await convertirImagenABase64(`${process.env.REACT_APP_API_URL}/uploads/firmas/${firmaDocente}`);

    // ✅ Generar URL usando solo el id (ya puede incluir guión bajo si es miembro)
    const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`;

    const qrBase64 = await generarQRBase64(urlVerificacion);

    // Aquí continúa como antes...
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

              <p class="carta-body">Sin otro particular, me despido recordándole las muestras de mi especial consideración y estima personal.</p>
              <div class="carta-footer">
                <p style="margin-top: 100px;">Atentamente,</p>
                <img src="${firmaBase64}" alt="Firma del docente" style="width: 150px; margin-top: 10px;" />
                <p class="carta-firma-docente"><strong>${nombreDocente}</strong></p>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: row; align-items: flex-start; margin-top: 120px; padding-left: 30px;">
          <img src="${qrBase64}" style="width: 70px; height: 70px; margin-right: 10px;" />
          <div style="font-size: 10px; line-height: 1.2; max-width: 300px; margin-top: 12px;">
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

      await new Promise(resolve => setTimeout(resolve, 800)); // ⏳ Espera que cargue

      const blob = await html2pdf().set(opt).from(contenedorTemporal).outputPdf('blob');
      document.body.removeChild(contenedorTemporal); // 🧹 Limpieza

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
      console.error('❌ Error al generar o subir el PDF:', error);

      if (error.response) {
        console.error('📩 Detalles del backend:', error.response.data);
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

  // Verificar si es la primera vez del docente
  axios.get(`/api/usuarios/${usuarioId}/primera-vez`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => {
      if (res.data.primera_vez) {
        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Antes de continuar, debes completar tu perfil.',
          icon: 'info',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(result => {
          if (result.isConfirmed) {
            navigate('/perfil-docente');
          }
        });
        return;
      }


      axios.get(`/api/docentes/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          const docenteId = response.data.id_docente;
          setFirmaDocente(response.data.firma); 
             
       if (!sessionStorage.getItem('bienvenidaDocenteMostrada')) {
        Swal.fire({
          toast: true,
          position: 'bottom-end',
          icon: 'success',
          title: `Bienvenido ${localStorage.getItem('nombre_usuario')}`,
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });

        sessionStorage.setItem('bienvenidaDocenteMostrada', 'true'); // ⬅️ Marca que ya se mostró
      }

          axios.get(`/api/trabajo-social/docente/${docenteId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => {
              setTrabajosSociales(res.data);
            })
            .catch(err => {
              console.error('Error al obtener trabajos sociales:', err.response ? err.response.data : err.message);
              Swal.fire({
                icon: 'error',
                title: 'Error al obtener trabajos sociales',
                text: 'No se pudo obtener los trabajos sociales del docente.',
              });
            });
        })
        .catch(error => {
          console.error('Error al obtener datos del docente:', error.response ? error.response.data : error.message);
          Swal.fire({
            icon: 'error',
            title: 'Error al obtener datos del docente',
            text: 'No se pudo obtener la información del docente.',
          });
        });
    })
    .catch(err => {
      console.error('Error al verificar primera vez del docente:', err.response ? err.response.data : err.message);
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

  // ✅ Generar URL usando solo el ID (con o sin _)
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
              Sin otro particular, me despido recordándole las muestras de mi especial consideración y estima personal.
            </p>

            <div class="carta-footer">
              <p style="margin-top: 100px;">Atentamente,</p>
              <img src="${firmaBase64}" alt="Firma del docente" style="width: 150px; margin-top: 10px;" />
              <p class="carta-firma-docente"><strong>${nombreDocente}</strong></p>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: row; align-items: flex-start; margin-top: 120px; padding-left: 30px;">
          <img src="${qrBase64}" style="width: 70px; height: 70px; margin-right: 10px;" />
          <div style="font-size: 10px; line-height: 1.2; max-width: 300px; margin-top: 12px;">
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
    // 1. Actualizar el estado del trabajo en la BD
    await axios.put(
      `/api/trabajo-social/${selectedTrabajo.id}`,
      {
        estado_plan_labor_social: nuevoEstado,
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // 2. Si el estado es 'aceptado', generar cartas PDF
    if (nuevoEstado === 'aceptado') {
      if (selectedTrabajo.tipo_servicio_social === 'grupal') {
        // 2.1 PDF del estudiante principal
        await generarYSubirPDF(selectedTrabajo); // se guarda en tabla principal

 
        const { data: integrantes } = await axios.get(
          `/api/integrantes/${selectedTrabajo.id}/enriquecido`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 2.3 Generar y subir PDF para cada integrante
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
          formData.append('archivo', pdfBlob, `carta_aceptacion_${selectedTrabajo.id}_${integrante.codigo_universitario}.pdf`);
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
        // ✅ Servicio individual
        await generarYSubirPDF(selectedTrabajo);
      }

      // 3. Mostrar confirmación
      Swal.fire({
        icon: 'success',
        title: '¡Trabajo aceptado!',
        text: 'Has aceptado supervisar el trabajo del estudiante.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Entendido'
      });
    }

    // 4. Actualizar estado en la UI
    setTrabajosSociales(prev =>
      prev.map(trabajo =>
        trabajo.id === selectedTrabajo.id
          ? { ...trabajo, estado_plan_labor_social: nuevoEstado }
          : trabajo
      )
    );

    setModalVisible(false); // cerrar modal

  } catch (error) {
    console.error('Error al guardar cambios:', error);
    Swal.fire({
      icon: 'error',
      title: '¡Error!',
      text: 'Ocurrió un problema al guardar los cambios o generar el documento.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  }
};

  const handleCloseModal = () => {
    setModalVisible(false);
  };
const handleVerGrupo = async (trabajoId) => {
  try {
    // Paso 1: Obtener correos institucionales
    const { data: integrantes } = await axios.get(`/api/integrantes/${trabajoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Extraer solo los correos institucionales
    const correos = integrantes.map(item => item.correo_institucional);

    // Paso 2: Obtener nombres desde tu API personalizada
    const { data: nombresYCorreos } = await axios.post(
      '/api/estudiantes/grupo-nombres',
      { correos },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Paso 3: Mostrar en el modal
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
  if (trabajoEnProcesoId !== null) return; // Previene doble clic
  setTrabajoEnProcesoId(trabajo.id);

  if (nuevoEstado === 'aceptado') {
    const result = await Swal.fire({
      title: '¿Estás seguro de aceptar al estudiante?',
      text: 'Esta acción generará la carta de aceptación y no podrá ser revertida.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      setTrabajoEnProcesoId(null);
      return;
    }
  }

  try {
    // 1. Actualizar estado en la base de datos
    await axios.put(
      `/api/trabajo-social/${trabajo.id}`,
      { estado_plan_labor_social: nuevoEstado },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 2. Si se aceptó, generar carta(s)
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
            await Swal.fire({
              icon: 'warning',
              title: 'Sin datos de grupo',
              text: 'No se encontraron integrantes del grupo. Intenta nuevamente más tarde.',
              confirmButtonText: 'Aceptar'
            });
            return;
          }

        } catch (err) {
          console.error('❌ Error al obtener datos enriquecidos:', err);
          await Swal.fire({
            icon: 'error',
            title: 'Servidor de UDH no disponible',
            text: 'No se pudo contactar con el servidor de datos académicos. Inténtalo más tarde.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        // PDF del estudiante principal
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
          formData.append('archivo', pdfBlob, `carta_aceptacion_${trabajo.id}_${integrante.codigo_universitario}.pdf`);
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
        // Individual
        await generarYSubirPDF(trabajo);
      }
    }

    // 3. Actualizar UI
    setTrabajosSociales(prev =>
      prev.map(t =>
        t.id === trabajo.id ? { ...t, estado_plan_labor_social: nuevoEstado } : t
      )
    );

    // 4. Confirmación
    Swal.fire({
      icon: 'success',
      title: `Trabajo ${nuevoEstado === 'aceptado' ? 'aceptado' : 'rechazado'}`,
      text: `Has marcado este trabajo como ${nuevoEstado}.`,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Entendido'
    });

  } catch (error) {
    console.error(`Error al cambiar estado a ${nuevoEstado}:`, error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo actualizar el estado del trabajo.',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    });
  } finally {
    setTrabajoEnProcesoId(null); // siempre limpia
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
    onClick={() => toggleSidebar()} // Llama a tu función para colapsar el sidebar
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
      <button
        className="btn-ver-ojo"
        title="Ver integrantes del grupo"
        onClick={() => handleVerGrupo(trabajo.id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#0b1f46" viewBox="0 0 24 24">
          <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 
            12c-2.761 0-5-2.239-5-5s2.239-5 
            5-5 5 2.239 5 5-2.239 5-5 5zm0-8a3 3 0 1 0 0 6 
            3 3 0 0 0 0-6z"/>
        </svg>
        <span style={{ marginLeft: '4px' }}>Ver</span>
      </button>
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
    <button
      className="btn-ver-documento"
      onClick={() => window.open(`${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`, '_blank')}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="18" height="18" viewBox="0 0 24 24">
        <path d="M12 5c-7.633 0-12 7-12 7s4.367 7 12 7 12-7 12-7-4.367-7-12-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 
                5-5 5 2.239 5 5-2.239 5-5 5zm0-8c-1.657 0-3 1.343-3 3s1.343 3 
                3 3 3-1.343 3-3-1.343-3-3-3z"/>
      </svg>
      &nbsp;Ver
    </button>
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
  {modalGrupoVisible && (
    <div className="modal-grupo-overlay">
      <div className="modal-grupo-content">
        <h3 className="modal-grupo-title">Integrantes del Grupo</h3>
        <ul className="modal-grupo-lista">
          {integrantesGrupo.length > 0 ? (
            integrantesGrupo.map((integrante, index) => (
              <li key={index} className="modal-grupo-item">
                <span className="modal-grupo-correo" style={{ display: 'inline' }}>
                  {integrante.correo}
                </span>
                <span style={{ display: 'inline' }}> - </span>
                <span className="modal-grupo-nombre" style={{ display: 'inline' }}>
                  {integrante.nombre && integrante.nombre !== 'NO ENCONTRADO'
                    ? integrante.nombre
                    : 'NOMBRE NO DISPONIBLE'}
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



{modalDeclinarVisible && (
  <div className="modal-declinar-overlay">
    <div className="modal-declinar-content">
      <h3 style={{ fontWeight: 'bold', fontSize: '15px' }}>ESCRIBA EL MOTIVO DE SU DECISIÓN</h3>
      <textarea
        maxLength={300}
        rows={5}
        placeholder="Escriba aquí su observación..."
        value={observacionDeclinar}
        onChange={(e) => setObservacionDeclinar(e.target.value)}
        className="textarea-declinar"
      />
      <div className="modal-declinar-char-count">
      {observacionDeclinar.length}/300 caracteres
    </div>

      <div className="modal-declinar-actions">
        <button className="btn-cancelar" onClick={() => setModalDeclinarVisible(false)}>
          Cancelar
        </button>
        <button
          className="btn-enviar"
          onClick={async () => {
            if (!observacionDeclinar.trim()) {
              Swal.fire({
                icon: 'warning',
                title: 'Observación requerida',
                text: 'Por favor, escriba una observación antes de enviar.',
                confirmButtonText: 'Entendido'
              });
              return;
            }

            try {
              await axios.post(`/api/trabajo-social/declinar`, {
                trabajo_id: selectedTrabajo.id,
                observacion: observacionDeclinar
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              setTrabajosSociales(prev =>
                prev.map(t =>
                  t.id === selectedTrabajo.id
                    ? { ...t, estado_plan_labor_social: 'declinado' }
                    : t
                )
              );

              Swal.fire({
                icon: 'success',
                title: 'Trabajo declinado',
                text: 'El motivo ha sido registrado correctamente.',
              });
              setModalDeclinarVisible(false);
              setObservacionDeclinar('');
            } catch (err) {
              console.error(err);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo guardar la observación.',
              });
            }
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  </div>
)}
      {modalVisible && (
        <div className="revision-modal">
          <div className="revision-modal-content">
            <h3>Editar Estado</h3>
            <label htmlFor="estado">Estado:</label>
            <select
              id="estado"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              className="revision-modal-select"
            >
              <option value="pendiente">Pendiente</option>
              <option value="aceptado">Aceptado</option>
              <option value="rechazado">Rechazado</option>
            </select>
            <div className="revision-modal-actions">
              <button className="revision-btn guardar" onClick={handleSave}>
                Guardar
              </button>
              <button className="revision-btn cancelar" onClick={handleCloseModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
  
}

export default RevisionDocente;
