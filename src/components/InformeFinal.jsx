import './DashboardAlumno.css';
import axios from 'axios';
import './ModalGlobal.css';
import React, { useRef, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import VerBoton, { VerBotonInline } from "../hooks/componentes/VerBoton";
import PdfIcon from "../hooks/componentes/PdfIcon";
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
  const [certificadosGrupo, setCertificadosGrupo] = useState([]);
  const refObjetivoGeneral = useRef(null);
  const refObjetivosEspecificos = useRef(null);
  const refActividades = useRef(null);
  const refAreaInfluencia = useRef(null);
  const refRecursos = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const refMetodologia = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const refConclusiones = useRef(null);
  const [nombresMiembros, setNombresMiembros] = useState([]);
  const refRecomendaciones = useRef(null);
  const refAnexos = useRef(null);
   const [anexos, setAnexos] = useState({
    cartaAceptacion: null,
    cartaTermino: null,
    fotosActividades: null,
    cronogramaFinal: null
  });


  const { user } = useUser();
  const token = user?.token;

useEffect(() => {
  const fetchCertificadosGrupo = async () => {
    if (planSeleccionado?.estado_informe_final === 'aprobado' && planSeleccionado.tipo_servicio_social === 'grupal') {
      try {
        const { data } = await axios.get(`/api/certificados-final/grupo/${planSeleccionado.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCertificadosGrupo(data); 
      } catch (error) {
        console.error('Error al obtener certificados del grupo:', error);
      }
    }
  };

  fetchCertificadosGrupo();
}, [planSeleccionado, token]);

useEffect(() => {
  const fetchNombres = async () => {
    if (planSeleccionado?.estado_informe_final === 'aprobado' && certificadosGrupo.length > 0) {
      const correos = certificadosGrupo.map(c => `${c.codigo_universitario}@udh.edu.pe`);
      try {
        const { data } = await axios.post('/api/estudiantes/grupo-nombres', { correos });
        setNombresMiembros(data);
      } catch (error) {
        console.error('Error al obtener nombres del grupo:', error);
      }
    }
  };

  fetchNombres();
}, [certificadosGrupo, planSeleccionado]);

const handleFileChangeLocal = (e, tipo) => {
  const archivo = e.target.files[0];
  if (!archivo) return;
  setAnexos(prev => ({ ...prev, [tipo]: archivo }));
};

const handleGenerarYSubirPDF = async () => {
  setIsLoading(true); 
  try {
   if (!nombreInstitucion.trim()) {
  await Swal.fire({
    icon: 'warning',
    title: 'Campos incompletos',
    text: 'Falta completar el campo: Nombre de la institución o comunidad receptora.',
    confirmButtonColor: '#3085d6'
  });
  setTimeout(() => {
    refInstitucion.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    refInstitucion.current?.focus();
  }, 200); 

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
    
    const mainPdf = await PDFDocument.load(await blobPrincipal.arrayBuffer());
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
    const formData = new FormData();
    formData.append('archivo', mergedBlob, 'informe_final.pdf');
    formData.append('trabajo_id', planSeleccionado.id);

    setPdfFinalBlob(mergedBlob);

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
  }finally {
    setIsLoading(false); 
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
    setIsSending(true);
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
        }finally {
          setIsSending(false); 
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
<div className="tabla-cronograma-wrapper">
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
        <td className="columna-actividad">{item.actividad}</td>
        <td>{item.justificacion}</td>
        <td>{item.fecha}</td>
        <td>{item.fecha_fin || '—'}</td>
        <td className="columna-resultados">{item.resultados}</td>
        <td style={{ textAlign: 'center' }}>
          {item.evidencia ? (
            <VerBoton
              label="Ver"
              onClick={() => {
                setImagenModal(`${process.env.REACT_APP_API_URL}/uploads/evidencias/${item.evidencia}`);
                setModalVisible(true);
              }}
            />
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
</div>
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
  <label className="bold-text">Documento de aprobacion actividades (PDF)</label>
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
    className="boton-descarga-informefinal flex items-center justify-center gap-2"
    disabled={isLoading}
  >
    {isLoading && <span className="spinner-informefinal"></span>}
    {isLoading ? 'Generando...' : 'Generar y Descargar'}
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
 <i className="fas fa-info-circle icono-azul"></i>

</span>
        <strong style={{ fontSize: '15px', color: '#2D3748' }}>Solicitar revisión al asesor:</strong>
      </div>
      <div className="texto-info-secundario-final">

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
          ? '#38A169' 
          : planSeleccionado.estado_informe_final === 'rechazado'
          ? '#E53E3E' 
          : '#8898aa', 
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
  disabled={isSending}
  className={`boton-enviar-final ${isSending ? 'enviando' : ''}`}
>
  {isSending && <span className="spinner-enviar-informefinal"></span>}
  {isSending ? 'Enviando...' : 'Solicitar revisión'}
</button>
)}

{planSeleccionado?.estado_informe_final === 'pendiente' &&
 planSeleccionado?.informe_final_pdf && (
  <button
  disabled
  className="boton-deshabilitado-final"
>
  Ya se ha enviado
</button>
)}

  {planSeleccionado?.estado_informe_final === 'rechazado' && (
    <button
  onClick={() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
  className="boton-scroll-arriba"
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
    <span className="check-circle">
      <i className="fas fa-check"></i>
    </span>
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
    <div className="certificado-header">
  <PdfIcon />

  <span className="certificado-titulo">
    CERTIFICADO FINAL SERVICIO SOCIAL
  </span>
</div>

 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
{planSeleccionado?.certificado_final ? (
  <VerBotonInline
  label="Ver"
  onClick={() =>
    window.open(
      `${process.env.REACT_APP_API_URL}/uploads/certificados_finales/${planSeleccionado.certificado_final}`,
      "_blank"
    )
  }
/>
) : (
  <span style={{ color: '#A0AEC0', fontSize: '14px' }}>No disponible</span>
)}
     <span className="estado-tramitado-final">Tramitado</span>
    </div>
  </div>
</div>
)}
{planSeleccionado?.estado_informe_final === 'aprobado' &&
 certificadosGrupo.length > 0 && (
  <div className="tarjeta-info-final">
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span className="check-circle">
      <i className="fas fa-check"></i>
    </span>
      <strong style={{ fontSize: '15px', color: '#2D3748' }}>
        Certificados de integrantes del grupo
      </strong>
    </div>

{certificadosGrupo.map((cert, index) => (
      <div key={index} className="item-resumen">
        
        <div className="item-certificado-info">
          <PdfIcon/>
          <span className="certificado-titulo">
            CERTIFICADO - {
              (() => {
                const correo = `${cert.codigo_universitario}@udh.edu.pe`.trim().toLowerCase();
                const miembro = nombresMiembros.find(n =>
                  n.correo?.trim().toLowerCase() === correo
                );
                return miembro && miembro.nombre && miembro.nombre !== 'NO ENCONTRADO'
                  ? miembro.nombre
                  : 'NOMBRE NO DISPONIBLE';
              })()
            }
          </span>
        </div>

        <VerBotonInline
          label="Ver"
          onClick={() =>
            window.open(
              `${process.env.REACT_APP_API_URL}/uploads/certificados_finales_miembros/${cert.nombre_archivo_pdf}`,
              "_blank"
            )
          }
        />
      </div>
))}
  </div>
)}
    </>
    
  );
};
export default InformeFinal;
