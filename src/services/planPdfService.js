import axios from 'axios';

const crearPlanFormData = ({
  imagenesAnexos,
  actividades,
  nombreInstitucion,
  nombreResponsable,
  fechaPresentacion,
  periodoEstimado,
  introduccion,
  justificacion,
  objetivoGeneral,
  objetivosEspecificos,
  nombreEntidad,
  misionVision,
  areasIntervencion,
  ubicacionPoblacion,
  areaInfluencia,
  metodologiaIntervencion,
  recursosRequeridos,
  resultadosEsperados,
}) => {
  const formData = new FormData();

  formData.append(
    'actividades',
    JSON.stringify(actividades || [])
  );

  formData.append(
    'nombreInstitucion',
    nombreInstitucion || ''
  );

  formData.append(
    'nombreResponsable',
    nombreResponsable || ''
  );

  formData.append(
    'fechaPresentacion',
    fechaPresentacion || ''
  );

  formData.append(
    'periodoEstimado',
    periodoEstimado || ''
  );

  formData.append(
    'introduccion',
    introduccion || ''
  );

  formData.append(
    'justificacion',
    justificacion || ''
  );

  formData.append(
    'objetivoGeneral',
    objetivoGeneral || ''
  );

  formData.append(
    'objetivosEspecificos',
    objetivosEspecificos || ''
  );

  formData.append(
    'nombreEntidad',
    nombreEntidad || ''
  );

  formData.append(
    'misionVision',
    misionVision || ''
  );

  formData.append(
    'areasIntervencion',
    areasIntervencion || ''
  );

  formData.append(
    'ubicacionPoblacion',
    ubicacionPoblacion || ''
  );

  formData.append(
    'areaInfluencia',
    areaInfluencia || ''
  );

  formData.append(
    'metodologiaIntervencion',
    metodologiaIntervencion || ''
  );

  formData.append(
    'recursosRequeridos',
    recursosRequeridos || ''
  );

  formData.append(
    'resultadosEsperados',
    resultadosEsperados || ''
  );

  if (imagenesAnexos?.cartaAceptacion) {
    formData.append(
      'anexo',
      imagenesAnexos.cartaAceptacion
    );
  }

  return formData;
};

const obtenerMensajeError = async (
  error,
  fallback
) => {
  const data = error.response?.data;

  if (data instanceof Blob) {
    try {
      const texto = await data.text();
      const json = JSON.parse(texto);
      return json.message || fallback;
    } catch {
      return fallback;
    }
  }

  return data?.message || error.message || fallback;
};

export async function generarPlanServicioSocialPDF(
  datos,
  token
) {
  if (!token) {
    throw new Error(
      'No se encontró el token de autenticación'
    );
  }

  try {
    const formData = crearPlanFormData(datos);

    const response = await axios.post(
      '/api/trabajo-social/plan/previsualizar',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      }
    );

    const mergedBlob = response.data;

    const url = URL.createObjectURL(
      mergedBlob
    );

    const file = new File(
      [mergedBlob],
      'PLAN-SERVICIO-SOCIAL-UDH.pdf',
      {
        type: 'application/pdf',
      }
    );

    return {
      url,
      file,
      mergedBlob,
    };
  } catch (error) {
    const message = await obtenerMensajeError(
      error,
      'No se pudo generar el plan de servicio social'
    );

    throw new Error(message);
  }
}

export async function guardarPlanServicioSocialPDF(
  datos,
  token
) {
  if (!token) {
    throw new Error(
      'No se encontró el token de autenticación'
    );
  }

  try {
    const formData = crearPlanFormData(datos);

    const response = await axios.post(
      '/api/trabajo-social/plan/guardar',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const message = await obtenerMensajeError(
      error,
      'No se pudo enviar el plan de servicio social'
    );

    throw new Error(message);
  }
}