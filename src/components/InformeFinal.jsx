// src/components/alumno/InformeFinal.jsx
import React, { useRef, useState } from 'react';
import './DashboardAlumno.css';
import axios from 'axios';
import './ModalGlobal.css';
import Swal from 'sweetalert2';
import { pdf } from '@react-pdf/renderer';
import InformeFinalPDF from './InformeFinalPDF';
import { PDFDocument } from 'pdf-lib';
import './Tooltip.css';
import { useUser } from '../UserContext'; 
const InformeFinal = ({
  nombreFacultad,
  nombrePrograma,
  nombreCompleto,
  codigoUniversitario,
  nombreLaborSocial,
  nombreInstitucion,
  setNombreInstitucion,
  nombreResponsable,
  setPlanSeleccionado,
  setNombreResponsable,
  periodoEstimado,
  planSeleccionado,
  setPeriodoEstimado,
  antecedentes,
  setModalVisible,
  setImagenModal,
  setAntecedentes,
  objetivoGeneralInforme,
  setObjetivoGeneralInforme,
  objetivosEspecificosInforme,
  actividadesSeguimiento,
  setObjetivosEspecificosInforme,
  areaInfluenciaInforme,
  setAreaInfluenciaInforme,
  recursosUtilizadosInforme,
  setRecursosUtilizadosInforme,
  metodologiaInforme,
  setMetodologiaInforme,
  conclusionesInforme,
  setConclusionesInforme,
  recomendacionesInforme,
  setRecomendacionesInforme
  
}) => {
  const refInstitucion = useRef(null);
  const refResponsable = useRef(null);
  //const [documentoAprobado, setDocumentoAprobado] = useState(true);
  const [pdfFinalBlob, setPdfFinalBlob] = useState(null);
  //const [solicitudEnviada, setSolicitudEnviada] = useState(false);
  const refPeriodo = useRef(null);
  const yaSeEnvio = !!planSeleccionado?.informe_final_pdf;
  const refAntecedentes = useRef(null);
  const refObjetivoGeneral = useRef(null);
  const refObjetivosEspecificos = useRef(null);
  const refActividades = useRef(null);
  const refAreaInfluencia = useRef(null);
  const refRecursos = useRef(null);
  const refMetodologia = useRef(null);
  const refConclusiones = useRef(null);
  const refRecomendaciones = useRef(null);
  const refAnexos = useRef(null);
   const [anexos, setAnexos] = useState({
    cartaAceptacion: null,
    cartaTermino: null,
    fotosActividades: null,
    cronogramaFinal: null
  });

  // Obtener el token del contexto
  const { user } = useUser();
  const token = user?.token;


const handleFileChangeLocal = (e, tipo) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  setAnexos(prev => ({ ...prev, [tipo]: archivo }));
};

const handleGenerarYSubirPDF = async () => {
  try {
    // ✅ Validación de campos uno por uno con scroll
   if (!nombreInstitucion.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Nombre de la institución o comunidad receptora.',
    confirmButtonColor: '#3085d6'
  });

  // Darle tiempo al DOM para reposicionarse
  setTimeout(() => {
    refInstitucion.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refInstitucion.current?.focus();
  }, 200); // 200ms es suficiente

  return;
}
if (!nombreResponsable.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Nombre del responsable institucional o beneficiario.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refResponsable.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refResponsable.current?.focus();
  }, 200);
  return;
}


if (!periodoEstimado.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Periodo de Servicio Realizado.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refPeriodo.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refPeriodo.current?.focus();
  }, 200);
  return;
}

if (!antecedentes.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Antecedentes.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refAntecedentes.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refAntecedentes.current?.focus();
  }, 200);
  return;
}
if (!objetivoGeneralInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Objetivo general.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refObjetivoGeneral.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refObjetivoGeneral.current?.focus();
  }, 200);
  return;
}
if (!objetivosEspecificosInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Objetivos específicos.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refObjetivosEspecificos.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refObjetivosEspecificos.current?.focus();
  }, 200);
  return;
}


if (actividadesSeguimiento.length === 0) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Debes agregar al menos una actividad con su evidencia.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refActividades.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 200);
  return;
}

if (!areaInfluenciaInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Área de Influencia.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refAreaInfluencia.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refAreaInfluencia.current?.focus();
  }, 200);
  return;
}


if (!recursosUtilizadosInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Recursos utilizados.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refRecursos.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refRecursos.current?.focus();
  }, 200);
  return;
}


if (!metodologiaInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Metodología.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refMetodologia.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refMetodologia.current?.focus();
  }, 200);
  return;
}

if (!conclusionesInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Conclusiones.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refConclusiones.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refConclusiones.current?.focus();
  }, 200);
  return;
}

if (!recomendacionesInforme.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Recomendaciones.',
    confirmButtonColor: '#3085d6'
  });

  setTimeout(() => {
    refRecomendaciones.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refRecomendaciones.current?.focus();
  }, 200);
  return;
}

    if (
      !anexos.cartaAceptacion ||
      !anexos.cartaTermino ||
      !anexos.fotosActividades ||
      !anexos.cronogramaFinal
    ) {
      return Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Faltan uno o más anexos obligatorios (PDF).',
        confirmButtonColor: '#3085d6'
      }).then(() => {
        refAnexos.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    if (!planSeleccionado || !planSeleccionado.id) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se encontró tu información de trabajo social. Vuelve a intentarlo.'
      });
    }

    // 1. Generar el PDF principal
    const blobPrincipal = await pdf(
      <InformeFinalPDF
        nombreFacultad={nombreFacultad}
        nombrePrograma={nombrePrograma}
        nombreCompleto={nombreCompleto}
        codigoUniversitario={codigoUniversitario}
        nombreLaborSocial={nombreLaborSocial}
        nombreInstitucion={nombreInstitucion}
        nombreResponsable={nombreResponsable}
        periodoEstimado={periodoEstimado}
        antecedentes={antecedentes}
        objetivoGeneralInforme={objetivoGeneralInforme}
        objetivosEspecificosInforme={objetivosEspecificosInforme}
        actividadesSeguimiento={actividadesSeguimiento}
        areaInfluenciaInforme={areaInfluenciaInforme}
        recursosUtilizadosInforme={recursosUtilizadosInforme}
        metodologiaInforme={metodologiaInforme}
        conclusionesInforme={conclusionesInforme}
        recomendacionesInforme={recomendacionesInforme}
      />
    ).toBlob();
    
    // 2. Cargar el documento PDF generado
    const mainPdf = await PDFDocument.load(await blobPrincipal.arrayBuffer());

    // 3. Unir anexos si existen
    const anexosArray = [
      anexos?.cartaAceptacion,
      anexos?.cartaTermino,
      anexos?.fotosActividades,
      anexos?.cronogramaFinal
    ];

    for (const anexo of anexosArray) {
      if (!anexo) continue;
      const anexoBytes = await anexo.arrayBuffer();
      const anexoDoc = await PDFDocument.load(anexoBytes);
      const pages = await mainPdf.copyPages(anexoDoc, anexoDoc.getPageIndices());
      pages.forEach((p) => mainPdf.addPage(p));
    }

    const mergedPdfBytes = await mainPdf.save();
    const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

    // 4. Enviar al backend
    const formData = new FormData();
    formData.append('archivo', mergedBlob, 'informe_final.pdf');
    formData.append('trabajo_id', planSeleccionado.id);

    setPdfFinalBlob(mergedBlob);

    // 5. Descargar el PDF fusionado
    const url = window.URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'informe_final_completo.pdf';
    a.click();

  } catch (error) {
    console.error('Error al generar o subir el informe final:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al procesar el informe final.'
    });
  }
};
 const handleEnviarPDF = async () => {
    if (!pdfFinalBlob || !planSeleccionado?.id) {
      return Swal.fire({
        icon: 'error',
        title: 'PDF no generado',
        text: 'Primero debes generar y descargar el PDF antes de enviarlo.'
      });
    }

    const formData = new FormData();
    formData.append('archivo', pdfFinalBlob, 'informe_final.pdf');
    formData.append('trabajo_id', planSeleccionado.id);

    try {
      await axios.post('/api/trabajo-social/guardar-informe-final', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });


   Swal.fire({
    icon: 'success',
    title: 'Revisión solicitada',
    text: 'Tu informe fue enviado exitosamente para revisión.',
    confirmButtonColor: '#3085d6'
  }).then(() => {
    setPlanSeleccionado(prev => ({
      ...prev,
      estado_informe_final: 'pendiente',
      informe_final_pdf: true
    }));
  });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo enviar el informe. Intenta nuevamente.'
    });
  }
};
  return (
    <>
   {!yaSeEnvio && (
    <div className="solicitar-revision-card">
      <div className="solicitar-revision-header">
        <h3>PORTADA</h3>
      </div>

      <div className="form-group">
        <label className="bold-text">Universidad</label>
        <textarea
          className="input-estilo-select universidad-readonly"
          value="UNIVERSIDAD DE HUÁNUCO"
          readOnly
          rows={1}
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Facultad</label>
        <textarea
          className="input-estilo-select universidad-readonly"
          value={nombreFacultad}
          readOnly
          rows={1}
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Programa académico</label>
        <textarea
          className="input-estilo-select universidad-readonly"
          value={nombrePrograma}
          readOnly
          rows={1}
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Nombre Completo</label>
        <textarea
          className="input-estilo-select universidad-readonly"
          value={nombreCompleto}
          readOnly
          rows={1}
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Código Universitario</label>
        <textarea
          className="input-estilo-select universidad-readonly"
          value={codigoUniversitario}
          readOnly
          rows={1}
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Nombre del Servicio Social</label>
        <textarea
          className="input-estilo-select universidad-readonly"
          value={nombreLaborSocial}
          readOnly
          rows={1}
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Nombre de la institución o comunidad receptora</label>
        <textarea
          ref={refInstitucion}
          className="input-estilo-select"
          value={nombreInstitucion}
          onChange={(e) => setNombreInstitucion(e.target.value)}
          placeholder="Describa aquí..."
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Nombre del responsable institucional o beneficiario</label>
        <textarea
          ref={refResponsable}
          className="input-estilo-select"
          value={nombreResponsable}
          onChange={(e) => setNombreResponsable(e.target.value)}
          placeholder="Describa aquí..."
        />
      </div>


      <div className="form-group">
        <label className="bold-text">Periodo de Servicio Realizado</label>
        <textarea
          ref={refPeriodo}
          className="input-estilo-select"
          value={periodoEstimado}
          onChange={(e) => setPeriodoEstimado(e.target.value)}
          placeholder="Describa aquí..."
        />
      </div>
       <div className="solicitar-revision-header">
        <h3>II. ANTECEDENTES</h3>
      </div>

      <div className="form-group">
        <label className="bold-text">Antecedentes del servicio social</label>
        <textarea
          ref={refAntecedentes}
          className="input-estilo-select"
          value={antecedentes}
          onChange={(e) => setAntecedentes(e.target.value)}
          placeholder="Describa aquí los antecedentes del servicio social..."
        />
      </div>

      <div className="solicitar-revision-header">
        <h3>III. OBJETIVOS</h3>
      </div>

      <div className="form-group">
        <label className="bold-text">Objetivo general</label>
        <textarea
          ref={refObjetivoGeneral}
          className="input-estilo-select"
          value={objetivoGeneralInforme}
          onChange={(e) => setObjetivoGeneralInforme(e.target.value)}
          placeholder="Escriba el objetivo general del servicio social..."
        />
      </div>

      <div className="form-group">
        <label className="bold-text">Objetivos específicos</label>
        <textarea
          ref={refObjetivosEspecificos}
          className="input-estilo-select"
          value={objetivosEspecificosInforme}
          onChange={(e) => setObjetivosEspecificosInforme(e.target.value)}
          placeholder={`Escriba los objetivos específicos separados por salto de línea:\n• Ejemplo 1\n• Ejemplo 2`}
          rows={4}
        />
      </div>
      <div className="solicitar-revision-header">
  <h3>IV. CRONOGRAMA DE ACTIVIDADES</h3>
</div>

<table className="tabla-cronograma">
  <thead>
    <tr>
      <th>N</th>
      <th>Actividad</th>
      <th>Justificación</th>
      <th>Fecha</th>
      <th>Fecha Fin</th>
      <th>Resultados Esperados</th>
      <th>Evidencia</th>

    </tr>
  </thead>
<tbody>
  {actividadesSeguimiento.length > 0 ? (
    actividadesSeguimiento.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.actividad}</td>
        <td>{item.justificacion}</td>
        <td>{item.fecha}</td>
        <td>{item.fecha_fin || '—'}</td>
        <td>{item.resultados}</td>
        <td style={{ textAlign: 'center' }}>
          {item.evidencia ? (
            <button
              onClick={() => {
                setImagenModal(`/uploads/evidencias/${item.evidencia}`);
                setModalVisible(true);
              }}
              className="btn-ver-evidencia"
              title="Ver evidencia"
              style={{
                backgroundColor: '#EDF2F7',
                border: '1px solid #CBD5E0',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: '500',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2D3748" viewBox="0 0 24 24">
                <path d="M12 5c-7.633 0-11 6.994-11 7s3.367 7 11 7 
                         11-6.994 11-7-3.367-7-11-7zm0 
                         12c-2.761 0-5-2.239-5-5s2.239-5 
                         5-5 5 2.239 5 5-2.239 5-5 
                         5zm0-8a3 3 0 1 0 0 6 
                         3 3 0 0 0 0-6z" />
              </svg>
              Ver
            </button>
          ) : (
            <span style={{ color: '#A0AEC0' }}>—</span>
          )}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: 'center', color: '#999' }}>
        No se han registrado actividades.
      </td>
    </tr>
  )}
</tbody>
</table>
<div className="solicitar-revision-header" style={{ marginTop: '30px' }}>
  <h3>V. ÁREA DE INFLUENCIA</h3>
</div>

<div className="form-group">
  <label className="bold-text">Área de Influencia</label>
  <textarea
    ref={refAreaInfluencia}
    className="input-estilo-select"
    value={areaInfluenciaInforme}
    onChange={(e) => setAreaInfluenciaInforme(e.target.value)}
    placeholder="Describa la población o área beneficiada..."
  />
</div>

<div className="solicitar-revision-header">
  <h3>VI. RECURSOS UTILIZADOS</h3>
</div>

<div className="form-group">
  <label className="bold-text">Recursos utilizados durante el servicio</label>
  <textarea
    ref={refRecursos}
    className="input-estilo-select"
    value={recursosUtilizadosInforme}
    onChange={(e) => setRecursosUtilizadosInforme(e.target.value)}
    placeholder={`• Recurso 1\n• Recurso 2\n• Recurso 3`}
    rows={4}
  />
</div>

<div className="solicitar-revision-header">
  <h3>VII. METODOLOGÍA</h3>
</div>

<div className="form-group">
  <label className="bold-text">Metodología aplicada</label>
  <textarea
    ref={refMetodologia}
    className="input-estilo-select"
    value={metodologiaInforme}
    onChange={(e) => setMetodologiaInforme(e.target.value)}
    placeholder="Describa cómo se desarrolló el servicio social: técnicas, enfoques, herramientas..."
    rows={5}
  />
</div>
<div className="solicitar-revision-header" style={{ marginTop: '30px' }}>
  <h3>VIII. CONCLUSIONES</h3>
</div>

<div className="form-group">
  <label className="bold-text">Conclusiones</label>
  <textarea
    ref={refConclusiones}
    className="input-estilo-select"
    value={conclusionesInforme}
    onChange={(e) => setConclusionesInforme(e.target.value)}
    placeholder={`Escriba cada conclusión separada por una línea:\n• Ejemplo 1\n• Ejemplo 2`}
    rows={4}
  />
</div>
<div className="solicitar-revision-header" style={{ marginTop: '30px' }}>
  <h3>IX. RECOMENDACIONES</h3>
</div>

<div className="form-group">
  <label className="bold-text">Recomendaciones</label>
  <textarea
    ref={refRecomendaciones}
    className="input-estilo-select"
    value={recomendacionesInforme}
    onChange={(e) => setRecomendacionesInforme(e.target.value)}
    placeholder={`Escriba cada recomendación separada por una línea:\n• Ejemplo 1\n• Ejemplo 2`}
    rows={4}
  />
</div>
<div className="solicitar-revision-header" style={{ marginTop: '30px' }}>
  <h3>X. ANEXOS</h3>
</div>

<div className="form-group">
  <label className="bold-text">Carta de aceptación (PDF)</label>
  <input type="file" accept="application/pdf" onChange={(e) => handleFileChangeLocal(e, 'cartaAceptacion')} />
</div>

<div className="form-group">
  <label className="bold-text">Carta de término (PDF)</label>
  <input type="file" accept="application/pdf" onChange={(e) => handleFileChangeLocal(e, 'cartaTermino')} />
</div>

<div className="form-group">
  <label className="bold-text">Fotografías de actividades (PDF)</label>
  <input type="file" accept="application/pdf" onChange={(e) => handleFileChangeLocal(e, 'fotosActividades')} />
</div>

<div className="form-group">
  <label className="bold-text">Fotos de las hojas de asistencia (PDF)</label>
  <input type="file" accept="application/pdf" onChange={(e) => handleFileChangeLocal(e, 'cronogramaFinal')} />
</div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
       
      </div>
   <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
  <button
    onClick={handleGenerarYSubirPDF}
    style={{
      padding: '8px 18px',
      backgroundColor: '#011B4B',
      color: 'white',
      borderRadius: '6px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '15px',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = '#1e429f';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = '#011B4B';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    Generar y Descargar
  </button>
  
</div>

    </div>
    )}

 {(pdfFinalBlob || planSeleccionado?.informe_final_pdf) && (
<div
  className="respuesta-asesor-card"
  style={{
    marginTop: '40px',
    border: '1px solid #CBD5E0',
    borderRadius: '10px',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
       <span
  style={{
    color: '#2B6CB0',
    padding: '2px 6px',
    borderRadius: '50%',
    fontWeight: 'bold',
    fontSize: '14px',
  }}
>
  ℹ️
</span>
        <strong style={{ fontSize: '15px', color: '#2D3748' }}>Solicitar revisión al asesor:</strong>
      </div>
      <div  style={{
      color: '#319795',
      fontStyle: 'italic',
      fontWeight: 400,
      marginLeft: '26px',
      marginTop: '4px',
      fontSize: '14px'
    }}
  >
      {planSeleccionado?.estado_informe_final === 'aprobado'
        ? 'Su informe final fue aprobado, ya puede revisar sus documentos.'
        : planSeleccionado?.estado_informe_final === 'rechazado'
        ? 'Su informe final fue rechazado. Por favor, vuelva a generarlo y enviarlo.'
        : planSeleccionado?.informe_final_pdf
        ? 'Su informe ya fue enviado. Está en espera de revisión.'
        : 'Ya puede solicitar la revisión del documento.'}

    </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {planSeleccionado?.estado_informe_final && (
  <span
    style={{
      backgroundColor:
        planSeleccionado.estado_informe_final === 'aprobado'
          ? '#38A169' // verde
          : planSeleccionado.estado_informe_final === 'rechazado'
          ? '#E53E3E' // rojo
          : '#8898aa', // naranja para pendiente
      color: 'white',
      fontWeight: '500',
      fontSize: '13px',
      padding: '4px 10px',
      borderRadius: '6px',
      textTransform: 'capitalize'
    }}
  >
    {planSeleccionado.estado_informe_final}
  </span>
)}
    </div>
  </div>
  <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '8px'
  }}
>
  {planSeleccionado?.estado_informe_final === 'pendiente' &&
 !planSeleccionado?.informe_final_pdf && (
  <button
    onClick={handleEnviarPDF}
    style={{
      padding: '8px 20px',
      backgroundColor: '#39B49E',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = '#147760';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = '#39B49E';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    Solicitar revisión
  </button>
)}

{planSeleccionado?.estado_informe_final === 'pendiente' &&
 planSeleccionado?.informe_final_pdf && (
  <button
    disabled
    style={{
      padding: '8px 20px',
      backgroundColor: '#CBD5E0',
      color: '#4A5568',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'not-allowed',
      opacity: 0.8
    }}
  >
    Ya se ha enviado
  </button>
)}

  {planSeleccionado?.estado_informe_final === 'rechazado' && (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      style={{
        padding: '8px 20px',
        backgroundColor: '#39B49E',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#147760';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = '#39B49E';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      Volver a generar informe
    </button>
  )}
</div>

</div>
)}


{planSeleccionado?.estado_informe_final === 'aprobado' && (
<div
  style={{
    marginTop: '40px',
    border: '1px solid #CBD5E0',
    borderRadius: '10px',
    padding: '16px 20px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  }}
>
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="#38A169"
      viewBox="0 0 24 24"
    >
      <path d="M20.285 2L9 13.567l-5.285-5.278L2 9.993 9 17l13-13z" />
    </svg>
    <strong style={{ fontSize: '15px', color: '#2D3748' }}>
      Documentos Generados Servicio Social
    </strong>
<div className="tooltip-container">
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  style={{ marginLeft: '4px', cursor: 'pointer' }}
>
  <path
    d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z"
    fill="#000"
  />
  <path
    d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
    fill="#000"
  />
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75Z"
    fill="#000"
  />
</svg>
  <div className="tooltip-text">
    Aquí encontrarás los documentos oficiales de tu servicio social. Haz clic en ver para abrir el documento.
  </div>
</div>

  </div>

  <div
    style={{
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '8px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
  xmlns="http://www.w3.org/2000/svg"
  width="28"
  height="28"
  viewBox="0 0 384 512"
>
  <path
    fill="#E2E5E7"
    d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24z"
  />
  <path
    fill="#B0B7BD"
    d="M224 0v128h128L224 0z"
  />
  <path
    fill="#F15642"
    d="M48 256h288c8.8 0 16 7.2 16 16v144c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V272c0-8.8 7.2-16 16-16z"
  />
  <text
    x="192"
    y="355"
    textAnchor="middle"
    fontFamily="Arial, sans-serif"
    fontSize="80"
    fill="#fff"
    fontWeight="bold"
  >
    PDF
  </text>
</svg>

   <span style={{ fontWeight: '600', fontSize: '14px' }}>
    CERTIFICADO FINAL SERVICIO SOCIAL 
   </span>
</div>
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
{planSeleccionado?.certificado_final ? (
  <button
    className="btn-ver-documento-inline"
    onClick={() =>
      window.open(
        `/uploads/certificados_finales/${planSeleccionado.certificado_final}`,
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
      <path d="M12 5c-7.633 0-11 6.994-11 7s3.367 7 11 7 
               11-6.994 11-7-3.367-7-11-7zm0 
               12c-2.761 0-5-2.239-5-5s2.239-5 
               5-5 5 2.239 5 5-2.239 5-5 
               5zm0-8a3 3 0 1 0 0 6 
               3 3 0 0 0 0-6z" />
    </svg>
    Ver
  </button>
) : (
  <span style={{ color: '#A0AEC0', fontSize: '14px' }}>No disponible</span>
)}

      <span
        style={{
          backgroundColor: '#38A169',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          padding: '4px 10px',
          borderRadius: '6px'
        }}
      >
        Tramitado
      </span>
    </div>
  </div>
</div>
)}
    </>
    
  );
};
export default InformeFinal;
