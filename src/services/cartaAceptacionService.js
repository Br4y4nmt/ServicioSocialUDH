import html2pdf from 'html2pdf.js';
import QRCode from 'qrcode';
import axios from 'axios';


let cssCartaCache = null;

const obtenerCSSCarta = async () => {
  if (cssCartaCache) return cssCartaCache;
  cssCartaCache = await fetch('/styles/carta-aceptacion.css').then(res => res.text());
  return cssCartaCache;
};

const generarQRBase64 = async (url) => {
  try {
    return await QRCode.toDataURL(url, { width: 120, margin: 1 });
  } catch (err) {
    console.error('Error generando QR:', err);
    return null;
  }
};

const convertirImagenABase64 = (url, token) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = () => reject('Error al cargar la imagen');
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send();
  });
};

const formatearFechaExtendida = (fecha) => {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  return `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
};

// ==============================
// GENERADOR DE HTML PARA CARTA
// ==============================

const generarHTMLCarta = ({ css, trabajo, firmaBase64, qrBase64, nombreDocente, urlVerificacion }) => `
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

// ==============================
// FUNCIONES PÚBLICAS DEL SERVICIO
// ==============================

/**
 * Genera un blob PDF de la carta de aceptación
 */
export const generarCartaPDFBlob = async ({ trabajo, firmaDocente, token }) => {
  const css = await obtenerCSSCarta();
  const firmaBase64 = await convertirImagenABase64(
    `${process.env.REACT_APP_API_URL}/uploads/firmas/${firmaDocente}`,
    token
  );
  const nombreDocente = localStorage.getItem('nombre_usuario') || 'DOCENTE DESCONOCIDO';
  const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documentos-trabajo/${trabajo.id}`;
  const qrBase64 = await generarQRBase64(urlVerificacion);

  const contenido = generarHTMLCarta({ css, trabajo, firmaBase64, qrBase64, nombreDocente, urlVerificacion });

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

/**
 * Genera y sube el PDF de carta de aceptación al servidor
 */
export const generarYSubirCartaPDF = async ({ trabajo, firmaDocente, token }) => {
  const blob = await generarCartaPDFBlob({ trabajo, firmaDocente, token });

  const formData = new FormData();
  formData.append('archivo', blob, `carta_aceptacion_${trabajo.id}.pdf`);
  formData.append('trabajo_id', trabajo.id);

  await axios.post('/api/trabajo-social/guardar-pdf-html', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  });
};

/**
 * Genera y sube cartas para todos los integrantes de un grupo
 */
export const generarCartasGrupales = async ({ trabajo, integrantes, firmaDocente, token }) => {
  // Primero generar la carta principal del grupo
  await generarYSubirCartaPDF({ trabajo, firmaDocente, token });

  // Luego generar carta individual para cada integrante
  for (const integrante of integrantes) {
    const trabajoIntegrante = {
      ...trabajo,
      Estudiante: { nombre_estudiante: integrante.nombre_completo },
      Facultad: { nombre_facultad: integrante.facultad },
      ProgramasAcademico: { nombre_programa: integrante.programa },
      id: `${trabajo.id}_${integrante.codigo_universitario}`
    };

    const pdfBlob = await generarCartaPDFBlob({ 
      trabajo: trabajoIntegrante, 
      firmaDocente, 
      token 
    });

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
};

/**
 * Procesa la aceptación de un trabajo (individual o grupal)
 */
export const procesarAceptacionTrabajo = async ({ trabajo, firmaDocente, token }) => {
  if (trabajo.tipo_servicio_social === 'grupal') {
    // Obtener integrantes del grupo
    const { data: integrantes } = await axios.get(
      `/api/integrantes/${trabajo.id}/enriquecido`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!Array.isArray(integrantes) || integrantes.length === 0) {
      throw new Error('SIN_DATOS_GRUPO');
    }

    await generarCartasGrupales({ trabajo, integrantes, firmaDocente, token });
  } else {
    await generarYSubirCartaPDF({ trabajo, firmaDocente, token });
  }
};
