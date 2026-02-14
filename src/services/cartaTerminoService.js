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
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    xhr.send();
  });
};


const generarHTMLCartaTermino = async ({
  nombreEstudiante,
  programa,
  facultad,
  labor,
  firmaBase64,
  nombreDocente,
  qrBase64,
  urlVerificacion
}) => {
  const css = await obtenerCSSCarta();
  
  return `
   <html>
  <head>
    <style>${css}</style>
  </head>

  <body style="margin:0; padding:0;">
    <div class="carta-aceptacion">
      <div class="encabezado-udh" style="gap: 6mm;">
        <!-- LOGO movido un poco a la izquierda -->
        <div class="logo-container" style="margin-left: -10mm;">
          <img src="/images/logonuevo.png" alt="Logo UDH" class="logo-udh" />
        </div>

        <!-- separador controlado -->
        <div class="separador-vertical" style="margin: 0 4mm;"></div>

        <div class="facultad-container">
          <p class="texto-facultad">
            FACULTAD DE ${(facultad || '--------').toUpperCase()}
          </p>
        </div>

        <!-- separador controlado -->
        <div class="separador-vertical" style="margin: 0 4mm;"></div>

        <div class="programa-container">
          <p class="texto-programa">
            P. A. DE ${(programa || '--------').toUpperCase()}
          </p>
        </div>
      </div>

      <hr class="linea-separadora" />

      <p class="carta-fecha" style="margin-top: 10px;">
        Huánuco, ${new Date().toLocaleDateString('es-PE')}
      </p>

      <h1 style="text-align: center; font-size: 14px; margin: 8px 0; font-weight: bold;">
        APROBACIÓN DE ACTIVIDADES SERVICIO SOCIAL
      </h1>

      <!-- BLOQUE DE TEXTO -->
      <div style="margin-top: 20mm;">
        <p class="parrafo-cartasss" style="margin-top: 0;">
          De mi consideración:
        </p>

        <p class="parrafo-cartas" style="margin-top: 14px;">
          Reciba un cordial saludo, por medio de la presente se deja constancia que el estudiante
          <strong>${nombreEstudiante || '--------'}</strong>, del programa académico de
          <strong>${programa || '--------'}</strong>, perteneciente a la facultad de
          <strong>${facultad || '--------'}</strong>, ha culminado satisfactoriamente sus actividades
          del servicio social denominado "<strong>${labor || '--------'}</strong>".
        </p>

        <p class="parrafo-carta" style="margin-top: 14px;">
          Se extiende la presente a solicitud del interesado(a), para los fines que estime convenientes.
        </p>

        <p class="parrafo-cartass" style="margin-top: 14px;">
          Sin otro particular, me despido con las muestras de mi especial consideración y estima.
        </p>

        <div class="bloque-firma" style="margin-top: 82px;">
          <p class="firma-etiqueta" style="text-align: center;">
            Atentamente,
          </p>

          <img
            src="${firmaBase64}"
            style="width:150px;margin-top:70px;margin-bottom:-15px;display:block;margin-left:auto;margin-right:auto;"
          />

          <p class="firma-docente" style="text-align: center;">
            <em>${nombreDocente}</em>
          </p>
        </div>
      </div>
    </div>

    <!-- BLOQUE QR -->
    <div style="display: flex; flex-direction: row; align-items: flex-start; margin-top: -10px; padding-left: 0px;">
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
};


const generarPDFBlobTermino = async (html, filename) => {
  const contenedor = document.createElement('div');
  contenedor.innerHTML = html;
  document.body.appendChild(contenedor);

  await new Promise(resolve => setTimeout(resolve, 800));
  
  const blob = await html2pdf().set({
    margin: [3, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(contenedor).outputPdf('blob');

  document.body.removeChild(contenedor);
  return blob;
};


export const generarYSubirCartaTerminoPrincipal = async ({ plan, firmaBase64, token }) => {
  const nombreDocente = localStorage.getItem('nombre_usuario') || 'DOCENTE RESPONSABLE';
  const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documento-termino/${plan.id}`;
  const qrBase64 = await generarQRBase64(urlVerificacion);

  const html = await generarHTMLCartaTermino({
    nombreEstudiante: plan.Estudiante?.nombre_estudiante,
    programa: plan.ProgramasAcademico?.nombre_programa,
    facultad: plan.Facultad?.nombre_facultad,
    labor: plan.LaboresSociale?.nombre_labores,
    firmaBase64,
    nombreDocente,
    qrBase64,
    urlVerificacion
  });

  const blob = await generarPDFBlobTermino(html, `carta_termino_${plan.id}.pdf`);

  const formData = new FormData();
  formData.append('archivo', blob, `carta_termino_${plan.id}.pdf`);
  formData.append('trabajo_id', plan.id);

  await axios.post('/api/trabajo-social/guardar-carta-termino-html', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const generarYSubirCartaTerminoIntegrante = async ({
  plan,
  integrante,
  firmaBase64,
  token
}) => {
  const nombreDocente = localStorage.getItem('nombre_usuario') || 'DOCENTE RESPONSABLE';
  const urlVerificacion = `${process.env.REACT_APP_API_URL}/api/trabajo-social/documento-termino/${plan.id}?codigo=${integrante.codigo_universitario}`;
  const qrBase64 = await generarQRBase64(urlVerificacion);

  const html = await generarHTMLCartaTermino({
    nombreEstudiante: integrante.nombre_completo,
    programa: integrante.programa,
    facultad: integrante.facultad,
    labor: plan.LaboresSociale?.nombre_labores,
    firmaBase64,
    nombreDocente,
    qrBase64,
    urlVerificacion
  });

  const blob = await generarPDFBlobTermino(html, `Carta_Termino_${integrante.nombre_completo}.pdf`);

  const formData = new FormData();
  formData.append('archivo', blob, `Carta_Termino_${integrante.nombre_completo}.pdf`);
  formData.append('trabajo_id', plan.id);
  formData.append('codigo_universitario', integrante.codigo_universitario);

  await axios.post('/api/cartas-termino', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const procesarAprobacionCartasTermino = async ({
  plan,
  firmaBase64,
  token,
  onProgreso
}) => {
  const reportarProgreso = (data) => {
    if (onProgreso) onProgreso(data);
  };

  if (plan.tipo_servicio_social === 'grupal') {
    reportarProgreso({ actual: 0, total: 0, mensaje: 'Obteniendo integrantes...' });

    const { data: integrantes } = await axios.get(`/api/integrantes/${plan.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    reportarProgreso({ actual: 0, total: 0, mensaje: 'Conectando con servidor UDH...' });
    
    let datosEnriquecidos;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/integrantes/${plan.id}/enriquecido`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      datosEnriquecidos = response.data;
    } catch (error) {
      console.error('Error al conectar con API UDH:', error);
      throw new Error('SERVIDOR_UDH_NO_DISPONIBLE');
    }

    if (!Array.isArray(datosEnriquecidos) || datosEnriquecidos.length === 0) {
      throw new Error('SIN_DATOS_INTEGRANTES');
    }

    reportarProgreso({ actual: 0, total: 0, mensaje: 'Generando carta del estudiante principal...' });
    await generarYSubirCartaTerminoPrincipal({ plan, firmaBase64, token });

    const integrantesFiltrados = integrantes.filter(i => i.usuario_id !== plan.usuario_id);
    const total = integrantesFiltrados.length;
    let contador = 0;

    for (const integrante of integrantesFiltrados) {
      contador++;
      const codigo = integrante.correo_institucional.split('@')[0];
      const info = datosEnriquecidos.find(est => est.codigo_universitario === codigo);

      reportarProgreso({
        actual: contador,
        total,
        mensaje: `Generando carta de integrante ${contador}/${total}...`
      });

      if (!info) continue;

      await generarYSubirCartaTerminoIntegrante({
        plan,
        integrante: {
          codigo_universitario: codigo,
          nombre_completo: info.nombre_completo,
          programa: info.programa,
          facultad: info.facultad
        },
        firmaBase64,
        token
      });
    }

    reportarProgreso({ actual: total, total, mensaje: 'Proceso finalizado.' });

  } else {

    reportarProgreso({ actual: 0, total: 1, mensaje: 'Generando carta...' });
    await generarYSubirCartaTerminoPrincipal({ plan, firmaBase64, token });
    reportarProgreso({ actual: 1, total: 1, mensaje: 'Proceso finalizado.' });
  }
};


export const obtenerFirmaDocenteBase64 = async (firmaFilename, token) => {
  const url = `${process.env.REACT_APP_API_URL}/uploads/firmas/${firmaFilename}`;
  return await convertirImagenABase64(url, token);
};
